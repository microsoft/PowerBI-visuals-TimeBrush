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
import "powerbi-visuals-tools/templates/visuals/.api/v1.7.0/PowerBI-visuals";
import { TimeBrush as TimeBrushImpl } from "@essex/timebrush";
import { TimeBrushVisualDataItem } from "./models";
import { default as dataConverter, coerceDate } from "./dataConversion";
import {
    IDimensions,
    receiveDimensions,
    UpdateType,
    calcUpdateType,
} from "@essex/visual-utils";

import TimeBrushState from "./state";
import * as models from "powerbi-models";
import * as $ from "jquery";
/* tslint:disable */
const stringify = require("json-stringify-safe");
const MY_CSS_MODULE = require("!css!sass!./css/TimeBrushVisual.scss");
const ldget = require("lodash/get");
/* tslint:enable */

@receiveDimensions
export default class TimeBrush implements powerbi.extensibility.visual.IVisual {

    /**
     * The visuals element
     */
    protected element: JQuery;

    private host: powerbi.extensibility.visual.IVisualHost;
    private timeColumn: powerbi.DataViewCategoryColumn;
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
     * The previous update options
     */
    private prevUpdateOptions: powerbi.extensibility.visual.VisualUpdateOptions;

    /**
     * Returns a numerical value for a month
     */
    public static getMonthFromString(mon: string) {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
    }

    /**
     * Constructor for the timebrush visual
     */
    constructor(options: powerbi.extensibility.visual.VisualConstructorOptions, timeBrushOverride?: TimeBrushImpl) {
        this.host = options.host;

        this.element = $(`<div><div class="timebrush"></div></div>`);

        const className = MY_CSS_MODULE && MY_CSS_MODULE.locals && MY_CSS_MODULE.locals.className;
        if (className) {
            $(options.element).append($("<style>" + MY_CSS_MODULE + "</style>"));
            this.element.addClass(className);
        }

        // HACK: PowerBI Swallows these events unless we prevent propagation upwards
        this.element.on("mousedown click pointerdown touchstart touchdown", (e: any) => e.stopPropagation());
        this._internalState = TimeBrushState.create<TimeBrushState>();
        this._doPBIFilter = _.debounce((range: [Date, Date]) => this.updatePBIFilter(range), 500);

        options.element.appendChild(this.element[0]);

         // Allow for overriding of the timebrush
        this.timeBrush = timeBrushOverride;
        this.timeBrush = this.timeBrush || new TimeBrushImpl(this.element.find(".timebrush"));
        this.timeBrush.events.on("rangeSelected", this.onTimeRangeSelected.bind(this));
    }


    /**
     * Update function for when the visual updates
     * @param options The update options
     * @param updateType Optional update type
     */
    public update(options: powerbi.extensibility.visual.VisualUpdateOptions, vm?: any, type?: UpdateType) {
        const updateType = type !== undefined ? type : calcUpdateType(this.prevUpdateOptions, options);
        this.prevUpdateOptions = options;
        const dataView = this.dataView = options.dataViews && options.dataViews[0];
        if (updateType !== UpdateType.Resize) {
            const newState = this._internalState.receiveFromPBI(dataView);

            if (dataView) {
                const hasDataChanged = !!(updateType & UpdateType.Data);
                this.loadLegendFromPowerBI(newState);
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
                if (!_.isEqual(newState.yAxisSettings, this._internalState.yAxisSettings)) {
                    this.timeBrush.showYAxis = newState.yAxisSettings.show;
                    this.timeBrush.yAxisPosition = newState.yAxisSettings.yAxisPosition;
                    this.timeBrush.showYAxisReferenceLines = newState.yAxisSettings.showReferenceLines;
                }
            }

            let newRange = (<any>newState.selectedRange || []).map((v: string) => new Date(v)) as [Date, Date];
            // Bound the range to actual available dates
            newRange = <[Date, Date]>this.getRangeBoundItems(newRange).map(n => n.date);

            // If the selected range is just a single item, then offset the final dates a little bit to create a brush
            if (newRange.length === 2 && newRange[0].getTime() === newRange[1].getTime()) {
                newRange = [new Date(newRange[0].getTime() - 1), new Date(newRange[1].getTime() + 1)];
            }

            newState.selectedRange = newRange;

            // Update the Time Brush
            this.timeBrush.selectedRange = newState.selectedRange;

            // Update the internal state
            this._internalState = this._internalState.receive(newState);

        }
    }

    /**
     * Called when the dimensions of the visual have changed
     */
    public setDimensions(value: IDimensions) {
        if (this.timeBrush) {
            this.timeBrush.dimensions = value;
        }
    }


    /**
     * Generates the current state of the visual
     */
    public get state(): TimeBrushState {
        return this._internalState.toJSONObject();
    }


    public areEqual(s1: TimeBrushState, s2: TimeBrushState): boolean {
        const otherPropsAreEqual = _.isEqual(
            _.omit(s1, ["seriesColors"]),
            _.omit(s2, ["seriesColors"]),
        );
        const seriesColorsChanged = (s1.seriesColors.length > 1 || s2.seriesColors.length > 1) &&
            !_.isEqual(s1.seriesColors, s2.seriesColors);
        return otherPropsAreEqual && !seriesColorsChanged;
    }


    /**
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration {
        const instances = [] as powerbi.VisualObjectInstance[];
        return instances.concat(this._internalState.buildEnumerationObjects(options.objectName, this.dataView));
    }

    /**
     * Loads the data from power bi
     */
    private loadDataFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean, state: TimeBrushState) {
        if (hasDataChanged || hasColorSettingsChanged(this._internalState, state)) {
            const dataViewCategorical = dataView.categorical;
            const data = dataConverter(dataView, this.host.createSelectionIdBuilder, state);
            this._data = data;
            // Stash this bad boy for later, so we can filter the time column
            if (dataViewCategorical && dataViewCategorical.categories) {
                this.timeColumn = dataViewCategorical.categories[0];
            }
            this.timeBrush.data = data;
        }
    }

    /**
     * Loads the legend
     */
    private loadLegendFromPowerBI(state: TimeBrushState) {
        this.timeBrush.legendFontSize = state.legendFontSize;
        this.timeBrush.legendItems = state.showLegend ? state.seriesColors : [];
    }

    /**
     * Loads the selected range from powerbi
     */
    private loadSelectedRangeFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean, state: TimeBrushState) {
        let startDate: Date;
        let endDate: Date;

        const {dataSourceChanged, filterStartDate, filterEndDate} = this.parseDatesFromPowerBi(dataView, hasDataChanged);

        if (filterStartDate && filterEndDate) {

            // If the user indicates whether or not to clear the selection when the underlying dataset has changed
            const updateSelection = !dataSourceChanged || !state.clearSelectionOnDataChange;
            if (updateSelection) {
                startDate = coerceDate(filterStartDate);
                endDate = coerceDate(filterEndDate);

                let range: [Date, Date] = [] as [Date, Date];
                if (startDate && endDate) {
                    range = [startDate, endDate];
                }

                this.timeBrush.selectedRange = range;
            } else {
                this.timeBrush.selectedRange = undefined;
            }

            state.selectedRange = this.timeBrush.selectedRange;
        } else if (dataView) {
            state.selectedRange = undefined;
        }
    }

    /**
     * Parse the filter date range from the dataView
     */
    private parseDatesFromPowerBi(dataView: powerbi.DataView, hasDataChanged: boolean) {
        const objects: any = ldget(dataView, "metadata.objects", undefined);
        let filterStartDate;
        let filterEndDate;
        let dataSourceChanged = hasDataChanged;

        // attempt reding the filter format for the new api
        const selectedRange = ldget(objects, "selection.selectedRange", undefined);

        // read the filter with the legacy format to support workbooks saved with the old api
        const oldFilter = ldget(objects, "general.filter.whereItems[0].condition", undefined);

        if (selectedRange) {
            [filterStartDate, filterEndDate] = JSON.parse(selectedRange);
            dataSourceChanged = false;
        } else if (oldFilter && oldFilter.upper && oldFilter.lower) {
            filterStartDate = (oldFilter.lower).value;
            filterEndDate = (oldFilter.upper).value;

            // Here we detect if the underlying datasource has changed
            const colExpr = oldFilter.arg;
            if (colExpr && colExpr.source) {
                const filterSource = colExpr.source;
                const source = this.timeColumn && (<any>this.timeColumn.source.expr).source;
                if (source) {
                    dataSourceChanged =
                        filterSource.entity !== source.entity ||
                        filterSource.schema !== source.schema;
                }
            }
        }

        return {dataSourceChanged, filterStartDate, filterEndDate};



    }

    /**
     * Raised when the time range is selected
     * @param range undefined means no range, otherwise should be [startDate, endDate]
     */
    private onTimeRangeSelected(range: [Date, Date]) {
        this._internalState.selectedRange = range;
        this._doPBIFilter(range);
    }

    /**
     * Updates the PBI filter to match the given date range
     */
    private updatePBIFilter(range: Date[]) {
        let filter: any;
        const items = this.getRangeBoundItems(range);
        if (items && items.length === 2) {
            const value1 = items[0].rawDate;
            const value2 = items[1].rawDate;

            const target: models.IFilterColumnTarget = {
                table: this.timeColumn.source.queryName.substr(0, this.timeColumn.source.queryName.indexOf(".")),
                column: this.timeColumn.source.displayName,
            };

            filter = new models.AdvancedFilter(target, "And", [
                { operator: "GreaterThanOrEqual", value: value1},
                { operator: "LessThanOrEqual", value: value2},
            ]);
            this.host.applyJsonFilter(filter, "general", "filter");
        } else {
            // TODO, clear the filter here.
        }

        // persist selection to powerbi
        const instance =  <powerbi.VisualObjectInstance>{
            objectName: "selection",
            selector: undefined,
            properties: { selectedRange: JSON.stringify(range) },
        };
        const objects: powerbi.VisualObjectInstancesToPersist = { };
        $.extend(objects, { [filter ? "merge" : "remove"]: [instance] });
        this.host.persistProperties(objects);
    }



    /**
     * Gets the items that are nearest to the given date range
     */
    private getRangeBoundItems(dateRange: Date[]) {
        let items: TimeBrushVisualDataItem[] = [];
        if (dateRange && dateRange.length) {
            let lowerItem: TimeBrushVisualDataItem;
            let upperItem: TimeBrushVisualDataItem;
            this.timeBrush.data.forEach((item: TimeBrushVisualDataItem) => {
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
        const changed = state.useGradient !== newState.useGradient ||
            state.gradient.endColor !== newState.gradient.endColor ||
            state.defaultBarColor !== newState.defaultBarColor ||
            state.gradient.startColor !== newState.gradient.startColor ||
            state.reverseBars !== newState.reverseBars ||
            state.gradient.endValue !== newState.gradient.endValue ||
            state.gradient.startValue !== newState.gradient.startValue;
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
