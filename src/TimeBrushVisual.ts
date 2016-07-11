declare var _: any;

import { TimeBrush as TimeBrushImpl, TimeBrushDataItem } from "./TimeBrush";

import { VisualBase, Visual } from "essex.powerbi.base";
import { default as Utils } from "essex.powerbi.base/src/lib/Utils";
import IVisual = powerbi.IVisual;
import IVisualHostServices = powerbi.IVisualHostServices;
import VisualCapabilities = powerbi.VisualCapabilities;
import VisualInitOptions = powerbi.VisualInitOptions;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;
import VisualObjectInstance = powerbi.VisualObjectInstance;
import DataView = powerbi.DataView;
import SelectionId = powerbi.visuals.SelectionId;
import VisualDataRoleKind = powerbi.VisualDataRoleKind;
import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;

/* tslint:disable */
const moment = require("moment");
/* tslint:enable */

@Visual(require("./build").output.PowerBI)
export default class TimeBrush extends VisualBase implements IVisual {

    /**
     * The set of capabilities for the visual
     */
    public static capabilities: VisualCapabilities = $.extend(true, {}, VisualBase.capabilities, {
        dataRoles: [{
            name: "Times",
            kind: VisualDataRoleKind.Grouping,
            displayName: "Time",
        }, {
            name: "Values",
            kind: VisualDataRoleKind.Measure,
            displayName: "Values",
        }, ],
        dataViewMappings: [{
            categorical: {
                categories: {
                    for: { in: "Times" },
                    dataReductionAlgorithm: { top: {} },
                },
                values: {
                    select: [{ bind: { to: "Values" } }]
                },
            },
            conditions: [{ "Times": { max: 1, min: 0 }, "Values": { max: 1, min: 0 } }],
        }, ],
        objects: {
            general: {
                displayName: powerbi.data.createDisplayNameGetter("Visual_General"),
                properties: {
                    filter: {
                        type: { filter: {} },
                        rule: {
                            output: {
                                property: "selected",
                                selector: ["Time"],
                            },
                        },
                    },
                },
            },
            selection: {
                displayName: "Selection",
                properties: {
                    clearSelectionAfterDataChange: {
                        displayName: "Clear selection after data changed",
                        description: "Setting this to true will clear the selection after the data is changed",
                        type: { bool: true },
                    },
                },
            },
        },
    });

    /**
     * The formats for moment to test
     */
    public static MOMENT_FORMATS = [
        moment.ISO_8601,
        "MM/DD/YYYY HH:mm:ss",
        "MM/DD/YYYY HH:mm",
        "MM/DD/YYYY",
        "YYYY/MM/DD HH:mm:ss",
        "YYYY/MM/DD HH:mm",
        "YYYY/MM/DD",
        "YYYY",
        "HH:mm:ss",
        "HH:mm",
        "MM",
        "DD",
    ];

    private host: IVisualHostServices;
    private timeColumn: DataViewCategoryColumn;
    private timeBrush: TimeBrushImpl;

    /**
     * The current data set
     */
    private _data: any[];

    /**
     * Setting for clearing selection after data has changed
     */
    private clearSelectionOnDataChange = false;

    /**
     * The template for the grid
     */
    private template: string = `
        <div>
            <div class="timebrush"></div>
        </div>
    `;

    /**
     * Whether or not to include css
     */
    private noCss = false;

    /**
     * Constructor for the timebrush visual
     */
    constructor(noCss = false) {
        super();
        this.noCss = noCss;
    }

    /**
     * Converts the data view into a time scale
     */
    public static converter(dataView: DataView): TimeBrushVisualDataItem[] {
        let items: TimeBrushVisualDataItem[];
        let dataViewCategorical = dataView && dataView.categorical;

        // Must be two columns: times and values
        if (dataViewCategorical && dataViewCategorical.categories && dataViewCategorical.values && dataViewCategorical.values.length) {
            if (dataViewCategorical.categories.length === 1) {
                items = dataViewCategorical.categories[0].values.map((date, i) => {
                    let coercedDate = TimeBrush.coerceDate(date);
                    return coercedDate ? {
                        date: coercedDate,
                        rawDate: date,
                        value: dataViewCategorical.values[0].values[i],
                        identity: SelectionId.createWithId(dataViewCategorical.categories[0].identity[i]),
                    } : null;
                }).filter(n => !!n);
            }/* else if (dataViewCategorical.categories.length > 1) {
                let yearCategory;
                let monthCategory;
                let dayCategory;
                dataViewCategorical.categories.forEach(cat => {
                    let categoryName = cat.source.displayName;
                    if (categoryName === "Year") {
                        yearCategory = cat;
                    } else if (categoryName === "Month") {
                        monthCategory = cat;
                    } else if (categoryName === "Day") {
                        dayCategory = cat;
                    }
                });
                
                items = [];
                let numValues = dataViewCategorical.categories[0].values.length;
                let date = new Date();
                for (let i = 0; i < numValues; i++) {
                    items.push({
                        date: new Date(
                            yearCategory ? yearCategory.values[i] : date.getFullYear(),
                            monthCategory ? TimeBrushVisual.getMonthFromString(monthCategory.values[i]) - 1 : 0,
                            dayCategory ? dayCategory.values[i] : 1
                        ),
                        value: dataViewCategorical.values[0].values[i],
                        identity: SelectionId.createWithId(dataViewCategorical.categories[0].identity[i])
                    });
                }
            }*/
        }
        return items;
    }

    /**
     * Coerces the given date value into a date object
     */
    public static coerceDate(dateValue: any): Date {
        if (!dateValue) {
            return;
        }

        if (typeof dateValue === "string" && dateValue) {
            dateValue = dateValue.replace(/-/g, "/");
            const parsedDate = moment(dateValue, TimeBrush.MOMENT_FORMATS);
            dateValue = parsedDate.toDate();
        }

        // Assume it is just a year
        if (dateValue > 31 && dateValue <= 10000) {
            dateValue = new Date(dateValue, 0);
        } else if (dateValue >= 0 && dateValue <= 31) {
            dateValue = new Date(new Date().getFullYear(), 1, dateValue);
        } else if (typeof dateValue === "number" && dateValue > 10000) {
            // Assume epoch
            dateValue = new Date(dateValue);
        }
        return dateValue;
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
        this.element.append($(this.template));
        this.host = options.host;
        const dims = { width: options.viewport.width, height: options.viewport.height };
        this.timeBrush = new TimeBrushImpl(this.element.find(".timebrush"), dims);
        this.timeBrush.events.on("rangeSelected", (range: Date[], items: any[]) => this.onTimeRangeSelected(range, items));
    }

    /** Update is called for data updates, resizes & formatting changes */
    public update(options: VisualUpdateOptions) {
        super.update(options);

        // If the dimensions changed
        if (!_.isEqual(this.timeBrush.dimensions, options.viewport)) {
            this.timeBrush.dimensions = { width: options.viewport.width, height: options.viewport.height };
        } else {
            let startDate: Date;
            let endDate: Date;
            let dataView = options.dataViews && options.dataViews[0];
            if (dataView) {
                let dataViewCategorical = dataView.categorical;
                let data = TimeBrush.converter(dataView);
                const hasDataChanged = Utils.hasDataChanged(data, this._data, (a, b) => a.identity.equals(b.identity));
                this._data = data;

                // Stash this bad boy for later, so we can filter the time column
                if (dataViewCategorical && dataViewCategorical.categories) {
                    this.timeColumn = dataViewCategorical.categories[0];
                }

                this.timeBrush.data = data;

                let item: any = dataView.metadata.objects;

                // Set the selection option
                let newSelection = item && item.selection && item.selection.clearSelectionAfterDataChange;
                this.clearSelectionOnDataChange = typeof newSelection !== "undefined" ? !!newSelection : true;
                const oldFilter = this.getFilterFromObjects(item);
                if (oldFilter) {
                    let updateSelection = !hasDataChanged || !this.clearSelectionOnDataChange;
                    if (updateSelection) {
                        let filterStartDate = oldFilter.lower.value;
                        let filterEndDate = oldFilter.upper.value;
                        startDate = TimeBrush.coerceDate(filterStartDate);
                        endDate = TimeBrush.coerceDate(filterEndDate);

                        // If the selection has changed at all, then set it
                        let currentSelection = this.timeBrush.selectedRange;
                        if (!currentSelection ||
                            currentSelection.length !== 2 ||
                            startDate !== currentSelection[0] ||
                            endDate !== currentSelection[1]) {
                            this.timeBrush.selectedRange = [startDate, endDate];
                        }
                    } else {
                        // Remove the filter completely
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
     * Gets the inline css used for this element
     */
    protected getCss(): string[] {
        return this.noCss ? [] : super.getCss().concat([require("!css!sass!./css/TimeBrushVisual.scss")]);
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

            filter = powerbi.data.SemanticFilter.fromSQExpr(
                powerbi.data.SQExprBuilder.between(
                    <any>this.timeColumn.identityFields[0],
                    powerbi.data.SQExprBuilder[builderType](value1),
                    powerbi.data.SQExprBuilder[builderType](value2))
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

    /**
     * Gets the filter from the objects
     */
    private getFilterFromObjects(objects: any) {
        if (objects &&
            objects.general &&
            objects.general.filter &&
            objects.general.filter.whereItems &&
            objects.general.filter.whereItems[0] &&
            objects.general.filter.whereItems[0].condition) {
            return objects.general.filter.whereItems[0].condition;
        }
    }
}

/**
 * The data item used by the TimeBrushVisual
 */
export interface TimeBrushVisualDataItem extends TimeBrushDataItem {

    /**
     * The identity for this individual selection item
     */
    identity: SelectionId;

    /**
     * The raw unparsed date for this item
     */
    rawDate: any;
}
