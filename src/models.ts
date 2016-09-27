/**
 * Represents a data item on a timescale
 */
export interface TimeBrushDataItem {
    /**
     * The date of the time scale item
     */
    date: Date;

    /**
     * The value on the given date
     */
    value: number;
}
