import {
    HasSettings,
    instanceColorSetting as coloredInstances,
    IColoredObject,
    colorSetting as color,
    colors,
    numberSetting as num,
    boolSetting as bool,
} from "essex.powerbi.base";
import { IColorSettings, TimeBrushVisualDataItem } from "./models";
import { dataSupportsDefaultColor, dataSupportsColorizedInstances, dataSupportsGradients } from "./dataConversion";
const fullColors = colors.full;

/**
 * Represents the state of the timebrush
 */
export default class TimeBrushVisualState extends HasSettings implements IColorSettings {

    @color({
        category: "Data Point",
        displayName: "Bar Color",
        description: "Bar color",
        defaultValue: fullColors[0],
        enumerable: (s, dv) => dataSupportsDefaultColor(dv),
    })
    public defaultBarColor: string;

    /**
     * The colors to use for each of the series
     */
    @coloredInstances({
        category: "Data Point",
        name: "fill",
        defaultValue: (idx) => fullColors[idx] || "#ccc",
        enumerable: (s, dv) => dataSupportsColorizedInstances(dv) && !s.useGradient,
    })
    public seriesColors: IColoredObject[];

    /**
     * Whether or not to clear the selection when the data has changed
     */
    @bool({
        category: "Selection",
        displayName: "Clear selection after data changed",
        name: "clearSelectionAfterDataChange",
        description: "Setting this to true will clear the selection after the data is changed",
        defaultValue: true,
    })
    public clearSelectionOnDataChange: boolean;

    /**
     * If the gradient color scheme should be used when coloring the values in the slicer
     */
    @bool({
        category: "Data Point",
        displayName: "Use Gradient",
        description: "If the gradient color scheme should be used when coloring the values in the slicer",
        defaultValue: false,
        enumerable: (s, dataView) => dataSupportsGradients(dataView),
    })
    public useGradient: boolean;

    /**
     * If the gradient color scheme should be used when coloring the values in the slicer
     */
    @color({
        category: "Data Point",
        displayName: "Start color",
        description: "The start color of the gradient",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
        defaultValue: "#bac2ff",
    })
    public startColor: string;

    /**
     * If the gradient color scheme should be used when coloring the values in the slicer
     */
    @color({
        category: "Data Point",
        displayName: "End color",
        description: "The end color of the gradient",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
        defaultValue: "#0229bf",
    })
    public endColor: string;

    /**
     * The value to use as the start color
     */
    @num({
        category: "Data Point",
        displayName: "Start Value",
        description: "The value to use as the start color",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
    })
    public startValue: number;

    /**
     * The value to use as the end color
     */
    @num({
        category: "Data Point",
        displayName: "End Value",
        description: "The value to use as the end color",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
    })
    public endValue: number;

    /**
     * If the order of the bars in the display should be reversed
     */
    @bool({
        category: "Display",
        displayName: "Reverse Bar Order",
        description: "If true, the bar display order will be reversed",
        defaultValue: false,
    })
    public reverseBars: boolean;

    /**
     * The size of the bars
     */
    @num({
        category: "Display",
        displayName: "Bar Width",
        description: "The size of the bars",
        defaultValue: 2,
        min: .01,
        max: 100,
    })
    public barWidth: number;

    /**
     * The selected time range
     */
    public range: [Date, Date];
}
