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

import * as $ from "jquery";
import simpleData from "./test/simpleData";
import dataWithBucketsAndSettings from "./test/dataWithBucketsAndSettings";
import dataWithSelection from "./test/dataWithSelections";
import { Utils as SpecUtils } from "@essex/pbi-base/dist/spec/visualHelpers";
import { expect } from "chai";
import { TimeBrush } from "@essex/timebrush";
import TimeBrushVisual from "./TimeBrushVisual";

describe("TimeBrushVisual", () => {
    let parentEle: JQuery;
    beforeEach(() => {
        parentEle = $("<div></div>");
    });

    afterEach(() => {
        if (parentEle) {
            parentEle.remove();
        }
        parentEle = null;
    });

    let createVisual = () => {
        const timeBrushEle = $("<div>");
        let timeBrush = new TimeBrush(timeBrushEle);
        let instance = new TimeBrushVisual(true, <any>timeBrush);
        instance["throwErrors"] = true;
        let initOptions = SpecUtils.createFakeInitOptions();
        parentEle.append(initOptions.element);

        instance.init(initOptions);

        return {
            instance,
            element: initOptions.element,
            timeBrush,
        };
    };

    const getSimpleDataUpdate = () => {
        return simpleData();
    };

    const getDataWithBucketsAndSettingsUpdate = () => {
        return dataWithBucketsAndSettings();
    };

    const getDataWithSelection = () => {
        return dataWithSelection();
    };

    it("should load", () => {
        expect(createVisual()).to.not.be.undefined;
    });

    describe("integration", () => {
        describe("simpleData", () => {
            const createInstanceAndPerformBasicUpdate = () => {
                const { instance, timeBrush } = createVisual();
                const { options, expected } = getSimpleDataUpdate();
                instance.update(options);
                return {
                    instance,
                    timeBrush,
                    expected,
                    options,
                };
            };
            describe("data", () => {
                it("should load dates correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformBasicUpdate();
                    const result = timeBrush.data.map(n => n.date);
                    expect(result).to.be.deep.equal(expected.map(n => n.date));
                });

                it("should load values correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformBasicUpdate();
                    const result = timeBrush.data.map(n => n.value);
                    expect(result).to.be.deep.equal(expected.map(n => n.value));
                });

                it("should load valueSegments correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformBasicUpdate();
                    const result = timeBrush.data.map(n => n.valueSegments.map(m => m.value));
                    expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.value)));
                });
            });
        });
        describe("Data with buckets and settings", () => {
            const createInstanceAndPerformComplexUpdate = () => {
                const { instance, timeBrush } = createVisual();
                const { options, expected, settings } = getDataWithBucketsAndSettingsUpdate();
                instance.update(options);
                return {
                    instance,
                    timeBrush,
                    expected,
                    options,
                    settings,
                };
            };
            describe("data", () => {
                it("should load dates correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformComplexUpdate();
                    const result = timeBrush.data.map(n => n.date);
                    expect(result).to.be.deep.equal(expected.map(n => n.date));
                });

                it("should load values correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformComplexUpdate();
                    const result = timeBrush.data.map(n => n.value);
                    expect(result).to.be.deep.equal(expected.map(n => n.value));
                });

                it("should load valueSegments correctly", () => {
                    const { instance, timeBrush, options, expected } = createInstanceAndPerformComplexUpdate();
                    const result = timeBrush.data.map(n => n.valueSegments.map(m => m.value));
                    expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.value)));
                });
            });

            describe("settings", () => {
                it("should load barWidth correctly into timeBrush", () => {
                    const { instance, timeBrush, options, expected, settings } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.barWidth).to.be.equal(settings.barWidth);
                });
                it("should load barWidth into state correctly", () => {
                    const { instance, timeBrush, options, expected, settings } = createInstanceAndPerformComplexUpdate();

                    expect(instance.state.barWidth).to.be.equal(settings.barWidth);
                });
                it("should load clearSearch into state correctly", () => {
                    const { instance, timeBrush, options, settings } = createInstanceAndPerformComplexUpdate();
                    expect(instance.state.clearSelectionOnDataChange).to.be.equal(settings.clearSelectionOnDataChange);
                });
                it("should load reverseBars into state correctly", () => {
                    const { instance, timeBrush, options, settings } = createInstanceAndPerformComplexUpdate();
                    expect(instance.state.reverseBars).to.be.equal(settings.reverseBars);
                });
                it("should load gradient into state correctly", () => {
                    const { instance, timeBrush, options, settings } = createInstanceAndPerformComplexUpdate();
                    expect(instance.state.gradient.startColor).to.be.deep.equal(settings.gradient.startColor);
                    expect(instance.state.gradient.startValue).to.be.deep.equal(settings.gradient.startValue);
                });

                it("should load the gradient colors correctly", () => {
                    const { instance, timeBrush, settings, expected } = createInstanceAndPerformComplexUpdate();
                    const result = timeBrush.data.map(n => n.valueSegments.map(m => m.color));
                    expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.color)));
                });

                it("should load the gradient colors correctly", () => {
                    const { instance, timeBrush, settings, expected } = createInstanceAndPerformComplexUpdate();
                    const result = timeBrush.data.map(n => n.valueSegments.map(m => m.color));
                    expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.color)));
                });

                it("should load the show y axis setting properly", () => {
                    const { instance, timeBrush, settings, expected } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.showYAxis).to.be.equal(settings["y-Axis"].showYAxis);
                });

                it("should load the show y axis reference lines properly", () => {
                    const { instance, timeBrush, settings, expected } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.showYAxisReferenceLines).to.be.equal(settings["y-Axis"].showReferenceLines);
                });

                it("should load the show y axis position properly", () => {
                    const { instance, timeBrush, settings, expected } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.yAxisPosition).to.be.equal(settings["y-Axis"].yAxisPosition);
                });

                it("should load font size into legend propertly", () => {
                    const { timeBrush, settings } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.legendFontSize).to.be.equal(settings.legendFontSize);
                });

                it("should not load legend items by default", () => {
                    const {  timeBrush } = createInstanceAndPerformComplexUpdate();
                    expect(timeBrush.legendItems.length).to.be.equal(0);
                });

            });

            describe("User switches the dataset from a simple one to a complex one", () => {
                const createInstanceAndPerformTwoUpdates = () => {
                    const { instance, timeBrush } = createVisual();
                    const { options, expected, settings } = getDataWithBucketsAndSettingsUpdate();
                    const simpleDataUpdate = getSimpleDataUpdate();

                    instance.update(simpleDataUpdate.options);

                    instance.update(options);

                    return {
                        instance,
                        timeBrush,
                        settings,
                        expected,
                    };
                };
                describe("data", () => {
                    it("should load dates correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        const result = timeBrush.data.map(n => n.date);
                        expect(result).to.be.deep.equal(expected.map(n => n.date));
                    });

                    it("should load values correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        const result = timeBrush.data.map(n => n.value);
                        expect(result).to.be.deep.equal(expected.map(n => n.value));
                    });

                    it("should load valueSegments correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        const result = timeBrush.data.map(n => n.valueSegments.map(m => m.value));
                        expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.value)));
                    });
                });

                describe("settings", () => {
                    it("should load barWidth correctly into timeBrush", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        expect(timeBrush.barWidth).to.be.equal(settings.barWidth);
                    });
                    it("should load barWidth into state correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        expect(instance.state.barWidth).to.be.equal(settings.barWidth);
                    });
                    it("should load clearSearch into state correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        expect(instance.state.clearSelectionOnDataChange).to.be.equal(settings.clearSelectionOnDataChange);
                    });
                    it("should load reverseBars into state correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        expect(instance.state.reverseBars).to.be.equal(settings.reverseBars);
                    });
                    it("should load gradient into state correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        expect(instance.state.gradient.startColor).to.be.deep.equal(settings.gradient.startColor);
                        expect(instance.state.gradient.startValue).to.be.deep.equal(settings.gradient.startValue);
                    });

                    it("should load the gradient colors correctly", () => {
                        const { instance, expected, settings, timeBrush } = createInstanceAndPerformTwoUpdates();

                        const result = timeBrush.data.map(n => n.valueSegments.map(m => m.color));
                        expect(result).to.be.deep.equal(expected.map(n => n.valueSegments.map(m => m.color)));
                    });
                });
            });
        });

        it("should load selection from PBI", () => {
            const { instance, timeBrush } = createVisual();
            const { options, selectedRange } = getDataWithSelection();

            instance.update(options);

            // Make sure it is on the timebrush
            expect(timeBrush.selectedRange).to.be.deep.equal(selectedRange);

            // Make sure the state was not cleared
            expect(instance.state.range).to.not.be.empty;
        });

        // Now that I think of it, why??
        it("should bound the selection if it is out of the range of the dates in PBI", () => {
            const { instance, timeBrush } = createVisual();
            const { options } = getDataWithSelection();

            instance.update(options);

            instance.state = <any>{
                range: [new Date(1000, 10, 10), new Date(12000, 10, 10)],
            };

            expect(timeBrush.selectedRange).to.be.deep.equal([timeBrush.data[0].date, timeBrush.data[timeBrush.data.length - 1].date]);
        });

        // Now that I think of it, why??
        it("should offset the selection slightly if the selected range is a single date", () => {
            const { instance, timeBrush } = createVisual();
            const { options } = getDataWithSelection();

            instance.update(options);

            const firstItem = timeBrush.data[0];
            const date = new Date(firstItem.date.getTime());

            instance.state = <any>{
                range: [date, date],
            };

            expect(timeBrush.selectedRange).to.be.deep.equal([new Date(date.getTime() - 1), new Date(date.getTime() + 1)]);
        });

        it("should clear the selection if the underlying datasource changes, and there was something already selected in the timebrush", () => { // tslint:disable-line
            const { instance, timeBrush } = createVisual();
            const simpleDataUpdate = getSimpleDataUpdate();
            const changedDatasetOptions = getDataWithBucketsAndSettingsUpdate().options;

            // Perform the first update
            instance.update(simpleDataUpdate.options);

            // Here is the initial range
            instance.state.range = timeBrush.selectedRange = [simpleDataUpdate.expected[0].date, simpleDataUpdate.expected[2].date];

            // Change the dataset
            instance.update(changedDatasetOptions);

            // Make sure the timebrush was cleared
            expect(timeBrush.selectedRange).to.be.empty;
        });

        it("should clear the selection if the underlying datasource changes", () => {
            const { instance, timeBrush } = createVisual();
            const simpleDataUpdate = getSimpleDataUpdate();
            const dataSetWithSelection = getDataWithSelection();

            // After this update, stuff should be selected
            instance.update(dataSetWithSelection.options);

            // Make sure stuff is selected
            expect(instance.state.range).to.not.be.empty;

            // Change the dataset with no selection, and an entirely different column
            instance.update(simpleDataUpdate.options);

            // Make sure the timebrush was cleared
            expect(timeBrush.selectedRange).to.be.empty;

            // Make sure the state was cleared
            expect(instance.state.range).to.be.empty;
        });

        it("should clear the selection if the underlying datasource changes", () => {
            const { instance, timeBrush } = createVisual();
            const simpleDataUpdate = getSimpleDataUpdate();
            const dataSetWithSelection = getDataWithSelection();

            // Perform the first update
            instance.update(dataSetWithSelection.options);

            // Change the dataset
            instance.update(simpleDataUpdate.options);

            // Make sure the timebrush was cleared
            expect(timeBrush.selectedRange).to.be.empty;
        });

        it("should NOT clear the selection if the underlying datasource hasn't changed", () => {
            const { instance, timeBrush } = createVisual();
            const selUpdate = getDataWithSelection();
            const selUpdate2 = getDataWithSelection();

            // Perform the first update
            instance.update(selUpdate.options);

            // Perform the second update
            instance.update(selUpdate2.options);

            // Make sure the timebrush was not cleared
            expect(timeBrush.selectedRange).to.not.be.empty;

            // Make sure the state was not cleared
            expect(instance.state.range).to.not.be.empty;
        });
    });
});
