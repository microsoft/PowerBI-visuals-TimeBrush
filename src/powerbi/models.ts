import { TimeBrushDataItem } from "../models";
import SelectionId = powerbi.visuals.SelectionId;

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
