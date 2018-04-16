import { boolSetting as bool, enumSetting } from "@essex/visual-settings";
import { AxisPosition } from "@essex/timebrush";

/**
 * Represents the set of YAxis settings
 */
export class YAxisSettings {

    /**
     * If the order of the bars in the display should be reversed
     */
    @bool({
        category: "Y-Axis",
        displayName: "Show",
        name: "showYAxis",
        description: "If true, the Y-Axis will be displayed",
        defaultValue: false,
    })
    public show: boolean;

    /**
     * If the order of the bars in the display should be reversed
     */
    @bool<YAxisSettings>({
        category: "Y-Axis",
        displayName: "Show Reference lines",
        description: "If true, the Y-Axis will be displayed",
        defaultValue: true,
        enumerable: (s) => s.show,
    })
    public showReferenceLines: boolean;

    /**
     * The position of the Y axis
     */
    @enumSetting<YAxisSettings>(AxisPosition, {
        category: "Y-Axis",
        displayName: "Position",
        description: "The position of the Y-Axis",
        defaultValue: AxisPosition.Left,
        enumerable: (s) => s.show,
    })
    public yAxisPosition: AxisPosition;
}
