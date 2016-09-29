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
import SelectionId = powerbi.visuals.SelectionId;
import { TimeBrushVisualDataItem } from "./models";
/* tslint:disable */
const moment = require("moment");
/* tslint:enable */

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

export default function converter(dataView: DataView): TimeBrushVisualDataItem[] {
    "use strict";
    let items: TimeBrushVisualDataItem[];
    let dataViewCategorical = dataView && dataView.categorical;

    // Must be two columns: times and values
    if (dataViewCategorical && dataViewCategorical.categories && dataViewCategorical.values && dataViewCategorical.values.length) {
        if (dataViewCategorical.categories.length === 1) {
            items = dataViewCategorical.categories[0].values.map((date, i) => {
                let coercedDate = coerceDate(date);
                return coercedDate ? {
                    date: coercedDate,
                    rawDate: date,
                    value: dataViewCategorical.values[0].values[i],
                    identity: SelectionId.createWithId(dataViewCategorical.categories[0].identity[i]),
                } : null;
            }).filter(n => !!n);
        }
    }
    return items;
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
    } else if (typeof dateValue === "number" && dateValue > 10000) {
        // Assume epoch
        dateValue = new Date(dateValue);
    }
    return dateValue;
}
