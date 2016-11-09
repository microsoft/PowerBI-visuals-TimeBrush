/*
 * Copyright (c) Microsoft
 * All rights reserved.
 * MIT License
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

declare var _: any;
import { StatefulVisual } from "pbi-stateful/src/StatefulVisual";

import { TimeBrush as TimeBrushImpl } from "../TimeBrush";
import { TimeBrushDataItem } from "../models";
import { default as dataConverter, coerceDate } from "./dataConversion";
import {
    publishChange,
} from "pbi-stateful/src/stateful";
import {
    Visual,
    IDimensions,
    receiveDimensions,
    capabilities,
    UpdateType,
} from "essex.powerbi.base";
import IVisualHostServices = powerbi.IVisualHostServices;
import VisualInitOptions = powerbi.VisualInitOptions;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import data = powerbi.data;
import myCapabilities from "./capabilities";
import TimeBrushState from "./state";

/* tslint:disable */
const stringify = require("json-stringify-safe");
const MY_CSS_MODULE = require("!css!sass!./css/TimeBrushVisual.scss");
const ldget = require("lodash/get");
/* tslint:enable */

@Visual(require("../build").output.PowerBI)
@receiveDimensions
@capabilities(myCapabilities)
export default class TimeBrush extends StatefulVisual<TimeBrushState> {
    private host: IVisualHostServices;
    private timeColumn: DataViewCategoryColumn;
    private timeBrush: TimeBrushImpl;
    private _internalState: TimeBrushState;
    private _doPBIFilter: (range: [Date, Date]) => void;

    /**
     * The current data set
     */
    private _data: any[];

    /**
     * The current dataview that we are looking at
     */
    private dataView: powerbi.DataView;

    /**
     * Returns a numerical value for a month
     */
    public static getMonthFromString(mon: string) {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
    }

    /**
     * Constructor for the timebrush visual
     */
    constructor(noCss = false) {
        super("TimeBrush", noCss);
        TimeBrush.DEFAULT_SANDBOX_ENABLED = false;

        const className = MY_CSS_MODULE && MY_CSS_MODULE.locals && MY_CSS_MODULE.locals.className;
        if (className) {
            this.element.addClass(className);
        }

        // HACK: PowerBI Swallows these events unless we prevent propagation upwards
        this.element.on("mousedown", (e: any) => e.stopPropagation());
        this._internalState = TimeBrushState.create<TimeBrushState>();
        this._doPBIFilter = _.debounce((range: [Date, Date]) => this.updatePBIFilter(range), 500);
    }

    /** This is called once when the visual is initialially created */
    protected onInit(options: VisualInitOptions): void {
        this.host = options.host;
        const dims = { width: options.viewport.width, height: options.viewport.height };
        this.timeBrush = new TimeBrushImpl(this.element.find(".timebrush"), dims);
        this.timeBrush.events.on("rangeSelected", this.onTimeRangeSelected.bind(this));
    }

    /** Update is called for data updates, resizes & formatting changes */
    protected onUpdate(options: VisualUpdateOptions, updateType: UpdateType) {
        let dataView = this.dataView = options.dataViews && options.dataViews[0];
        const newState = this._internalState.receiveFromPBI(dataView);

        if (dataView) {
            const hasDataChanged = !!(updateType & UpdateType.Data);
            this.loadDataFromPowerBI(dataView, hasDataChanged, newState);
            this.loadSelectedRangeFromPowerBI(dataView, hasDataChanged, newState);

            // Safari for some reason will not repaint after an dynamically added class, so we are adding this here
            // to ensure that safari repaints after an update
            this.element.addClass("SAFARI_HACK").removeClass("SAFARI_HACK");
        }

        if (updateType & UpdateType.Settings) {
            if (newState.barWidth !== this._internalState.barWidth) {
                this.timeBrush.barWidth = newState.barWidth;
            }
        }

        this.state = newState.toJSONObject();
    }
    /**
     * Called when the dimensions of the visual have changed
     */
    public setDimensions(value: IDimensions) {
        if (this.timeBrush) {
            this.timeBrush.dimensions = value;
        }
    }

    protected getCustomCssModules() {
        return [MY_CSS_MODULE];
    }

    protected generateState() {
        return this._internalState.toJSONObject();
    }

    protected onSetState(state: TimeBrushState) {
        if (this.timeBrush && state) {
            // Incoming state has been json-serialized/deserialized. Dates are ISO string.
            state.range = state.range || [] as [Date, Date];
            state.range = state.range.map((v: any) => new Date(v)) as [Date, Date];

            // Update the Time Brush
            this.timeBrush.selectedRange = state.range;

            // Update the internal state
            this._internalState = this._internalState.receive(state);

            // Update PBI if this is user-triggered
            if (!this.isHandlingUpdate) {
                this._doPBIFilter(this._internalState.range);
            }
        }
    }

    public areEqual(s1: TimeBrushState, s2: TimeBrushState): boolean {
        const otherPropsAreEqual = _.isEqual(
            _.omit(s1, ["seriesColors"]),
            _.omit(s2, ["seriesColors"])
        );
        const seriesColorsChanged = (s1.seriesColors.length > 1 || s2.seriesColors.length > 1) &&
            !_.isEqual(s1.seriesColors, s2.seriesColors);
        return otherPropsAreEqual && !seriesColorsChanged;
    }

    public getHashCode(state: TimeBrushState) {
        return super.getHashCode(_.omit(state, ["seriesColors"]));
    }

    /**
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
        let instances = (super.enumerateObjectInstances(options) || []) as VisualObjectInstance[];
        return instances.concat(this._internalState.buildEnumerationObjects(options.objectName, this.dataView));
    }

    /**
     * The template for the grid
     */
    public get template() {
        return `<div><div class="timebrush"></div></div>`;
    }

    /**
     * Gets the inline css used for this element
     */
    protected getCss(): string[] {
        return (super.getCss() || []).concat([MY_CSS_MODULE]);
    }

    /**
     * Loads the data from power bi
     */
    private loadDataFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean, state: TimeBrushState) {
        if (hasDataChanged || hasColorSettingsChanged(this._internalState, state)) {
            let dataViewCategorical = dataView.categorical;
            let data = dataConverter(dataView, state);
            this._data = data;
            // Stash this bad boy for later, so we can filter the time column
            if (dataViewCategorical && dataViewCategorical.categories) {
                this.timeColumn = dataViewCategorical.categories[0];
            }
            this.timeBrush.data = data;
        }
    }

    /**
     * Loads the selected range from powerbi
     */
    private loadSelectedRangeFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean, state: TimeBrushState) {
        let startDate: Date;
        let endDate: Date;
        const objects: any = ldget(dataView, "metadata.objects", undefined);
        // Set the selection option
        const oldFilter = ldget(objects, "general.filter.whereItems[0].condition", undefined) as data.SQBetweenExpr;
        if (oldFilter) {
            let dataSourceChanged = hasDataChanged;

            // Here we detect if the underlying datasource has changed
            const colExpr = oldFilter.arg as data.SQColumnRefExpr;
            if (colExpr && colExpr.source) {
                const filterSource = colExpr.source as data.SQEntityExpr;
                const source = this.timeColumn && (<data.SQColumnRefExpr>this.timeColumn.source.expr).source as data.SQEntityExpr;
                if (source) {
                    dataSourceChanged =
                        filterSource.entity !== source.entity ||
                        filterSource.schema !== source.schema ||
                        filterSource.variable !== source.variable;
                }
            }

            // If the user indicates whether or not to clear the selection when the underlying dataset has changed
            let updateSelection = !dataSourceChanged || !state.clearSelectionOnDataChange;
            if (updateSelection) {
                let filterStartDate = (<data.SQConstantExpr>oldFilter.lower).value;
                let filterEndDate = (<data.SQConstantExpr>oldFilter.upper).value;
                startDate = coerceDate(filterStartDate);
                endDate = coerceDate(filterEndDate);

                let range: [Date, Date] = [] as [Date, Date];
                if (startDate && endDate) {
                    range = [startDate, endDate];
                }

                // If the selection has changed at all, then set it
                this.timeBrush.selectedRange = range;
                // TODO: should the state be set here?
            } else {
                this.timeBrush.selectedRange = undefined;
            }
        }
    }

    /**
     * Raised when the time range is selected
     * @param range undefined means no range, otherwise should be [startDate, endDate]
     */
    private onTimeRangeSelected(range: [Date, Date]) {
        this.state = this._internalState.receive({ range }).toJSONObject();
        let label: string;
        if (range && range.length === 2) {
            label = `Select range ${range[0].toLocaleDateString()} - ${range[1].toLocaleDateString()}`;
        } else {
            label = "Clear selection";
        }
        publishChange(this, label, this.state);
        this._doPBIFilter(range);
    }

    private updatePBIFilter(range: Date[]) {
        let filter: any;
        const items = this.getRangeBoundItems(range);
        if (items && items.length === 2) {
            const sourceType = this.timeColumn.source.type;
            let builderType = "text";
            if (sourceType.extendedType === powerbi.ValueType.fromDescriptor({ integer: true }).extendedType) {
                builderType = "integer";
            } else if (sourceType.extendedType === powerbi.ValueType.fromDescriptor({ numeric: true }).extendedType) {
                builderType = "decimal";
            } else if (sourceType.extendedType === powerbi.ValueType.fromDescriptor({ dateTime: true }).extendedType) {
                builderType = "dateTime";
            }

            let value1 = items[0].rawDate;
            let value2 = items[1].rawDate;
            if (builderType === "text") {
                value1 = value1 + "";
                value2 = value2 + "";
            }

            filter = data.SemanticFilter.fromSQExpr(
                data.SQExprBuilder.between(
                    <any>this.timeColumn.identityFields[0],
                    data.SQExprBuilder[builderType](value1),
                    data.SQExprBuilder[builderType](value2))
            );
        }
        let instance =  <powerbi.VisualObjectInstance>{
            objectName: "general",
            selector: undefined,
            properties: { filter },
        };

        let objects: powerbi.VisualObjectInstancesToPersist = { };
        if (filter) {
            $.extend(objects, { merge: [instance] });
        } else {
            $.extend(objects, { remove: [instance] });
        }

        this.host.persistProperties(objects);
        this.host.onSelect(<any>{ data: [] }); // hack 
    }

    private getRangeBoundItems(dateRange: Date[]) {
        let items: any[] = [];
        if (dateRange && dateRange.length) {
            let lowerItem: TimeBrushDataItem;
            let upperItem: TimeBrushDataItem;
            this.timeBrush.data.forEach(item => {
                if (!lowerItem) {
                    lowerItem = item;
                }
                if (!upperItem) {
                    upperItem = item;
                }

                if (Math.abs(dateRange[0].getTime() - item.date.getTime()) <
                    Math.abs(dateRange[0].getTime() - lowerItem.date.getTime())) {
                    lowerItem = item;
                }

                if (Math.abs(dateRange[1].getTime() - item.date.getTime()) <
                    Math.abs(dateRange[1].getTime() - upperItem.date.getTime())) {
                    upperItem = item;
                }
            });
            items = [lowerItem, upperItem];
        }
        return items;
    }
}

/**
 * Returns true if any of the color settings have changed.
 */
function hasColorSettingsChanged(state: TimeBrushState, newState: TimeBrushState) {
    "use strict";
    if (state && newState) {
        let changed = state.useGradient !== newState.useGradient ||
            state.endColor !== newState.endColor ||
            state.defaultBarColor !== newState.defaultBarColor ||
            state.startColor !== newState.startColor ||
            state.reverseBars !== newState.reverseBars ||
            state.endValue !== newState.endValue ||
            state.startValue !== newState.startValue;
        if (!changed) {
            const oldSeriesColors = state.seriesColors || [];
            const newSeriesColors = newState.seriesColors || [];
            const mapper = (n: any, i: number) => ({ name: n.name, color: n.color, id: (n.identity && n.identity.key) || i });
            return oldSeriesColors.length !== newSeriesColors.length ||
                !_.isEqual(oldSeriesColors.map(mapper), newSeriesColors.map(mapper));
        }
        return changed;
    }
    return true;
}
