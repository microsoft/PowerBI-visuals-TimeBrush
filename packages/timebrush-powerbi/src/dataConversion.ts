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

import DataView = powerbi.DataView;
import { TimeBrushVisualDataItem, IColorSettings } from "./models";
import { calculateSegments } from "@essex/visual-utils";
import * as moment from "moment";
import get = require("lodash.get");

const MOMENT_FORMATS = [
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

export default function converter(
    dataView: DataView,
    selectionIdBuilderFactory: () => powerbi.visuals.ISelectionIdBuilder,
    settings?: IConversionSettings): TimeBrushVisualDataItem[] {
    "use strict";
    let items: TimeBrushVisualDataItem[];
    const dataViewCategorical = dataView && dataView.categorical;

    // Must be two columns: times and values
    if (dataViewCategorical && dataViewCategorical.categories && dataViewCategorical.values && dataViewCategorical.values.length) {
        if (dataViewCategorical.categories.length === 1) {
            const { defaultBarColor, seriesColors, reverseBars } = (settings || {}) as IConversionSettings;
            const values = dataViewCategorical.values;
            const gradient = getGradientFromSettings(settings || {});

            // We should only add gradients if the data supports gradients, and the user has gradients enabled
            const shouldAddGradients = dataSupportsGradients(dataView) && settings.useGradient;

            // We should only colorize instances if the data supports colorized instances and the user isn't
            // trying to use gradients
            const shouldAddInstanceColors = dataSupportsColorizedInstances(dataView) && !settings.useGradient;
            const segmentInfo = calculateSegments(
                values,
                dataSupportsDefaultColor(dataView) ? defaultBarColor : undefined,
                shouldAddGradients ? gradient : undefined,
                shouldAddInstanceColors ? seriesColors : undefined);
            const dates = dataViewCategorical.categories[0].values;
            items = dates.map((date, i) => {
                return convertItem(
                    date,
                    segmentInfo,
                    i,
                    dataViewCategorical.categories[0],
                    values,
                    reverseBars !== false,
                    selectionIdBuilderFactory());
            }).filter(n => !!n);
        }
    }
    return items;
}

/**
 * Converts an individual time brush item
 */
export function convertItem(
    date: any,
    segmentInfo: Array<{ name: string; color: any; }>,
    valueIdx: number,
    categoryIdentity: powerbi.DataViewCategoryColumn,
    values: powerbi.DataViewValueColumns,
    reverseBars: boolean,
    selectionIdBuilder: powerbi.visuals.ISelectionIdBuilder) {
    "use strict";
    const coercedDate = coerceDate(date);
    let total = 0;
    segmentInfo.forEach((n, j) => {
        total += (values[j].values[valueIdx] as number || 0);
    });
    let valueSegments = segmentInfo.map((n, j) => {
        const segVal = values[j].values[valueIdx] as number;
        return {
            value: parseFloat(((total === 0 ? 0 : segVal / total) * 100).toFixed(2)),
            color: n.color,
        };
    }).filter(n => n.value > 0.1);
    valueSegments = reverseBars ? valueSegments.reverse() : valueSegments;
    return coercedDate ? {
        date: coercedDate,
        rawDate: date,
        value: total,
        identity: (selectionIdBuilder) ? selectionIdBuilder.withCategory(categoryIdentity, valueIdx).createSelectionId() : -1,
        valueSegments,
    } as TimeBrushVisualDataItem : null;
}

/**
 * Coerces a date object from some type of date value
 */
export function coerceDate(dateValue: any): Date {
    "use strict";
    if (!dateValue) {
        return;
    }

    if (typeof dateValue === "string" && dateValue) {
        dateValue = dateValue.replace(/-/g, "/");
        const parsedDate = moment(dateValue, MOMENT_FORMATS);
        dateValue = parsedDate.toDate();
    }

    // Assume it is just a year
    if (dateValue > 31 && dateValue <= 10000) {
        dateValue = new Date(dateValue, 0);
    } else if (dateValue >= 0 && dateValue <= 31) {
        dateValue = new Date(new Date().getFullYear(), 1, dateValue);
    } else if (typeof dateValue === "number" && (dateValue > 10000 || dateValue < 0)) {
        // Assume epoch
        dateValue = new Date(dateValue);
    }
    return dateValue;
}

/**
 * True if the given dataview supports multiple value segments
 */
export function dataSupportsValueSegments(dv: powerbi.DataView) {
    "use strict";
    return get(dv, "categorical.values.length", 0) > 0;
}

/**
 * Returns true if the data supports default colors
 */
export function dataSupportsDefaultColor(dv: powerbi.DataView) {
    "use strict";

    // TODO: Disabled for now, cause it doesn't really work well with multiple
    // bars without identities
    // // Default color only works on a single value instance
    // if (dataSupportsValueSegments(dv)) {
    //     return get(dv, v => v.categorical.values.length, 0) === 1;
    // }

    return false;
}

/**
 * Returns true if gradients can be used with the data
 */
export function dataSupportsGradients(dv: powerbi.DataView) {
    "use strict";

    // We can use gradients on ANY data that has more than one value, otherwise it doesn't make sense
    if (dataSupportsValueSegments(dv)) {
        return get(dv, v => v.categorical.values.length, 0) > 0;
    }
    return false;
}

/**
 * Returns true if individiual instances of the dataset can be uniquely colored
 */
export function dataSupportsColorizedInstances(dv: powerbi.DataView) {
    "use strict";

    // If there are no value segments, then there is definitely going to be no instances
    if (dataSupportsValueSegments(dv)) {
        // We can uniquely color items that have an identity associated with it
        const grouped = dv.categorical.values.grouped();
        return grouped.filter(n => !!n.identity).length > 0;
    }
    return false;
}

/**
 * Retrieves the gradient info from the given set of settings.
 */
export function getGradientFromSettings(settings: IColorSettings) {
    "use strict";
    const { useGradient, gradient } = (settings || {}) as IColorSettings;
    const { startColor, endColor, startValue, endValue } = gradient;
    if (useGradient && startColor && endColor) {
        return { startColor, endColor, startValue, endValue };
    }
}

export type IConversionSettings = IColorSettings & { reverseBars?: boolean };
