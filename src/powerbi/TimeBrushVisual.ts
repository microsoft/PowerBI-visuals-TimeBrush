declare var _: any;

import { TimeBrush as TimeBrushImpl } from "../TimeBrush";
import { TimeBrushVisualDataItem } from "./models";
import { default as dataConverter, coerceDate } from "./dataConversion";

import { VisualBase, Visual } from "essex.powerbi.base";
import { updateTypeGetter, UpdateType } from "essex.powerbi.base/src/lib/Utils";
import IVisual = powerbi.IVisual;
import IVisualHostServices = powerbi.IVisualHostServices;
import VisualCapabilities = powerbi.VisualCapabilities;
import VisualInitOptions = powerbi.VisualInitOptions;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
import data = powerbi.data;
import capabilities from "./capabilities";

/* tslint:disable */
const moment = require("moment");
const MY_CSS_MODULE = require("!css!sass!./css/TimeBrushVisual.scss");
const ldget = require("lodash/get");
/* tslint:enable */

@Visual(require("../build").output.PowerBI)
export default class TimeBrush extends VisualBase implements IVisual {

    /**
     * The set of capabilities for the visual
     */
    public static capabilities: VisualCapabilities = capabilities;
    private host: IVisualHostServices;
    private timeColumn: DataViewCategoryColumn;
    private timeBrush: TimeBrushImpl;
    private updateType = updateTypeGetter(this);

    /**
     * The current data set
     */
    private _data: any[];

    /**
     * Setting for clearing selection after data has changed
     */
    private clearSelectionOnDataChange = false;

    /**
     * Constructor for the timebrush visual
     */
    constructor(noCss = false) {
        super(noCss);

        const className = MY_CSS_MODULE && MY_CSS_MODULE.locals && MY_CSS_MODULE.locals.className;
        if (className) {
            this.element.addClass(className);
        }
    }

    /**
     * Returns a numerical value for a month
     */
    public static getMonthFromString(mon: string) {
        return new Date(Date.parse(mon + " 1, 2012")).getMonth() + 1;
    }

    /** This is called once when the visual is initialially created */
    public init(options: VisualInitOptions): void {
        super.init(options);
        this.host = options.host;
        const dims = { width: options.viewport.width, height: options.viewport.height };
        this.timeBrush = new TimeBrushImpl(this.element.find(".timebrush"), dims);
        this.timeBrush.events.on("rangeSelected", (range: Date[], items: any[]) => this.onTimeRangeSelected(range, items));
    }

    /** Update is called for data updates, resizes & formatting changes */
    public update(options: VisualUpdateOptions) {
        const updateType = this.updateType();
        super.update(options);

        // If the dimensions changed
        if (updateType & UpdateType.Resize) {
            this.timeBrush.dimensions = { width: options.viewport.width, height: options.viewport.height };
        }

        let dataView = options.dataViews && options.dataViews[0];
        if (dataView) {
            const hasDataChanged = !!(updateType & UpdateType.Data);
            this.loadDataFromPowerBI(dataView, hasDataChanged);
            this.loadSelectedRangeFromPowerBI(dataView, hasDataChanged);
        }
    }

    /**
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
        let instances = super.enumerateObjectInstances(options) || [{
            selector: null,
            objectName: options.objectName,
            properties: {},
        }, ];
        if (options.objectName === "selection") {
            instances[0].properties = {
                clearSelectionAfterDataChange: this.clearSelectionOnDataChange
            };
        }
        return instances;
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
    private loadDataFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean) {
        if (hasDataChanged) {
            let dataViewCategorical = dataView.categorical;
            let data = dataConverter(dataView);
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
    private loadSelectedRangeFromPowerBI(dataView: powerbi.DataView, hasDataChanged: boolean) {
        let startDate: Date;
        let endDate: Date;
        const objects: any = ldget(dataView, "metadata.objects", undefined);
        // Set the selection option
        const newSelection = ldget(objects, "selection.clearSelectionAfterDataChange", undefined);
        this.clearSelectionOnDataChange = typeof newSelection !== "undefined" ? !!newSelection : true;
        const oldFilter = ldget(objects, "general.filter.whereItems[0].condition", undefined) as data.SQBetweenExpr;
        if (oldFilter) {
            let dataSourceChanged = hasDataChanged;

            // Here we detect if the underlying datasource has changed
            const colExpr = oldFilter.arg as data.SQColumnRefExpr;
            if (colExpr && colExpr.source) {
                const filterSource = colExpr.source as data.SQEntityExpr;
                const source = this.timeColumn && (<data.SQColumnRefExpr>this.timeColumn.source.expr).source as data.SQEntityExpr;
                dataSourceChanged =
                    filterSource.entity !== source.entity ||
                    filterSource.schema !== source.schema ||
                    filterSource.variable !== source.variable;
            }

            // If the user indicates whether or not to clear the selection when the underlying dataset has changed
            let updateSelection = !dataSourceChanged || !this.clearSelectionOnDataChange;
            if (updateSelection) {
                let filterStartDate = (<data.SQConstantExpr>oldFilter.lower).value;
                let filterEndDate = (<data.SQConstantExpr>oldFilter.upper).value;
                startDate = coerceDate(filterStartDate);
                endDate = coerceDate(filterEndDate);

                // If the selection has changed at all, then set it
                let currentSelection = this.timeBrush.selectedRange;
                if (!currentSelection ||
                    currentSelection.length !== 2 ||
                    startDate !== currentSelection[0] ||
                    endDate !== currentSelection[1]) {
                    this.timeBrush.selectedRange = [startDate, endDate];
                }
            } else {
                // Remove the filter completely from PBI
                this.host.persistProperties({
                    remove: [{
                        objectName: "general",
                        selector: undefined,
                        properties: { filter: undefined },
                    }, ],
                });
            }
        }
    }

    /**
     * Raised when the time range is selected
     * @param range undefined means no range, otherwise should be [startDate, endDate]
     */
    private onTimeRangeSelected(range: Date[], items: TimeBrushVisualDataItem[]) {
        let filter: any;
        if (range && range.length === 2) {
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
            properties: {
                "filter": filter
            },
        };

        let objects: powerbi.VisualObjectInstancesToPersist = { };
        if (filter) {
            $.extend(objects, {
                merge: [instance]
            });
        } else {
            $.extend(objects, {
                remove: [instance]
            });
        }


        this.host.persistProperties(objects);

        // Hack from timeline.ts
        this.host.onSelect({ data: [] });
    }
}
