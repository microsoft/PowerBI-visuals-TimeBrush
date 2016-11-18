import {
    HasSettings,
    instanceColorSetting as coloredInstances,
    IColoredObject,
    colorSetting as color,
    colors,
    numberSetting as num,
    boolSetting as bool,
    deserializeObjectWithIdentity,
    serializeObjectWithIdentity,
    gradientSetting as gradient,
    enumSetting,
    GradientSettings,
} from "essex.powerbi.base";
import { IColorSettings, ColorMode } from "./models";
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
    @coloredInstances<TimeBrushVisualState>({
        category: "Data Point",
        name: "fill",
        defaultValue: (idx) => fullColors[idx] || "#ccc",
        enumerable: (s, dv) => dataSupportsColorizedInstances(dv) && !s.useGradient,
    })
    public seriesColors: IColoredObject[];

    /**
     * Represents the color mode to use
     */
    @enumSetting(ColorMode, {
        category: "Data Point",
        displayName: "Color Mode",
        defaultValue: ColorMode.Instance,
        description: "Determines how the individual bars within the time brush are colored",
    })
    public colorMode: ColorMode;

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
     * The set of gradient settings
     */
    @gradient<TimeBrushVisualState>({
        category: "Data Point",
        enumerable: (s, dataView) => dataSupportsGradients(dataView) && s.useGradient,
    })
    public gradient: GradientSettings;

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

    /**
     * A utility property to indicate if the Gradient color mode is selected
     */
    public get useGradient() {
        return this.colorMode === ColorMode.Gradient;
    }

    /**
     * Receives the new properties
     * @param newProps The properties to merge into state
     */
    public receive(newProps?: any) {
        if (newProps && newProps.seriesColors) {
            newProps.seriesColors = newProps.seriesColors.map(deserializeObjectWithIdentity);
        }
        const base = super.receive(newProps);
        return base;
    }

    /**
     * Creates a JSON object version of this state, suitable for storage
     */
    public toJSONObject() {
        const jsonObj = super.toJSONObject() as TimeBrushVisualState;
        if (this.seriesColors) {
            jsonObj.seriesColors = <any>this.seriesColors.map(serializeObjectWithIdentity);
        }
        return jsonObj;
    }
}
