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

import VisualDataRoleKind = powerbi.VisualDataRoleKind;
import VisualCapabilities = powerbi.VisualCapabilities;
export default {
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
            displayName: "General",
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
} as VisualCapabilities;
