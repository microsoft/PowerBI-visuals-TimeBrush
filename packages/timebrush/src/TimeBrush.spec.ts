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

import { expect } from "chai";
import { TimeBrush } from "./TimeBrush";
import { TimeBrushDataItem, AxisPosition } from "./models";
import * as d3 from "d3";
import * as $ from "jquery";
describe("TimeBrush", () => {
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

    const SIMPLE_FAKE_DATA = [{
        date: new Date(2015, 1, 1),
        value: 20,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }, {
        date: new Date(2016, 1, 1),
        value: 60,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }];

    const SIMPLE_FAKE_DATA_2 = [{
        date: new Date(2015, 2, 2),
        value: 200,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }, {
        date: new Date(2106, 2, 2),
        value: 600,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }];

    const SIMPLE_FAKE_DATA_3 = [{
        date: new Date(2015, 1, 1),
        value: -20,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }, {
        date: new Date(2016, 1, 1),
        value: -60,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }];

    const SIMPLE_FAKE_DATA_4 = [{
        date: new Date(2015, 1, 1),
        value: -20,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }, {
        date: new Date(2016, 1, 1),
        value: 60,
        valueSegments: [{
            value: 100,
            color: "red",
        }],
    }];

    const createInstance = () => {
        const element = $("<div>");
        const instance = new TimeBrush(element);
        return {
            element,
            instance,
        };
    };
    it("should load", () => {
        const instance = createInstance();
        expect(instance).to.not.be.undefined;
    });

    it("should hide itself initially", () => {
        const { element } = createInstance();
        expect(element.css("display")).to.be.equal("none");
    });

    describe("data", () => {
        it("should default the data property to empty when data is set to an undefined", () => {
            const { instance } = createInstance();
            instance.data = undefined;
            expect(instance.data).to.be.deep.equal([]);
        });
        it("should set the data property when data is set to an empty array", () => {
            const { instance } = createInstance();
            const fakeData: TimeBrushDataItem[] = [];
            instance.data = fakeData;
            expect(instance.data).to.be.deep.equal(fakeData);
        });
        it("should set the data property when data is set to a non empty dataset", () => {
            const { instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            expect(instance.data).to.be.deep.equal(SIMPLE_FAKE_DATA);
        });
        it("should show the UI if there is sufficient data", () => {
            const { instance, element } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            expect(element.css("display")).to.not.equal("none");
        });
        it("should clear the selection when data is set", () => {
            const { instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.selectedRange = [SIMPLE_FAKE_DATA[0].date, SIMPLE_FAKE_DATA[1].date];
            instance.data = SIMPLE_FAKE_DATA_2;
            expect(instance.selectedRange).to.be.empty;
        });
        it("should adjust the x axis when new data is set", () => {
            const { element, instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };
            expect(element.find(".x.axis").text()).to.equal("AprilJulyOctober2016");
        });
        it("should adjust the y axis when new data is set", () => {
            const { element, instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.dimensions = { width: 500, height: 200 };
            expect(element.find(".y.axis").text()).to.equal("0204060");
        });
        it("should adjust the bars when new data is set", () => {
            const { element, instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            const bars = element.find(".bars rect");
            expect(bars.length).to.be.equal(SIMPLE_FAKE_DATA.length);
            expect(d3.select(bars[0]).data()[0].date).to.be.deep.equal(SIMPLE_FAKE_DATA[0].date);
            expect(d3.select(bars[1]).data()[0].date).to.be.deep.equal(SIMPLE_FAKE_DATA[1].date);
        });
        it("should have y-scale starting at 0 if all values are positive", () => {
            const { instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            let domain = instance["y"].domain();
            expect(domain[0]).to.equal(0);
            expect(domain[1]).to.equal(60);
        });
        it("should have y-scale ending at 0 if all values are negative", () => {
            const { instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA_3;
            instance.dimensions = { width: 500, height: 200 };

            let domain = instance["y"].domain();
            expect(domain[0]).to.equal(-60);
            expect(domain[1]).to.equal(0);
        });
        it("should have y-scale for full range if both negative and positive values are present", () => {
            const { instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA_4;
            instance.dimensions = { width: 500, height: 200 };

            let domain = instance["y"].domain();
            expect(domain[0]).to.equal(-20);
            expect(domain[1]).to.equal(60);
        });

    });

    describe("showYAxis", () => {
        it ("should not show the y axis by default", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            // Make sure it is 'hidden'
            expect(element.find(".y.axis").css("display")).to.equal("none");
        });
        it ("should show the y axis if true", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.showYAxis = true;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            expect(element.find(".y.axis").css("display")).to.equal("");

            // 0, 20, 40, 60
            expect(element.find(".y.axis").text()).to.equal("0204060");
        });
        it ("should force a repaint if set to true after data has been loaded", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.dimensions = { width: 500, height: 200 };

            expect(element.find(".y.axis").css("display")).to.equal("");
            expect(element.find(".y.axis").text()).to.equal("0204060");
        });
        it ("should adjust the scale when data is changed", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.dimensions = { width: 500, height: 200 };

            // Data has been changed
            instance.data = SIMPLE_FAKE_DATA_2;

            expect(element.find(".y.axis").text()).to.equal("0200400600");
        });
        it ("should adjust the scale when the size is changed", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.dimensions = { width: 500, height: 200 };

            // Make sure our initial expectations are true
            expect(element.find(".y.axis").text()).to.equal("0204060");

            // Make it larger
            instance.dimensions = { width: 500, height: 500 };

            expect(element.find(".y.axis").text()).to.equal("051015202530354045505560");
        });
    });

    describe("showYAxisReferenceLines", () => {
        it ("should show the y axis reference lines by default", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.showYAxis = true;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            expect(element.find(".y.axis line").css("display")).to.equal("");
        });
        it ("should not show the y axis lines if false", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.showYAxis = true;
            instance.showYAxisReferenceLines = false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            expect(element.find(".y.axis line").css("display")).to.equal("none");
        });
        it ("should force a repaint if set to false after data has been loaded", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.showYAxisReferenceLines = false;
            instance.dimensions = { width: 500, height: 200 };

            expect(element.find(".y.axis line").css("display")).to.equal("none");
        });
    });

    describe("yAxisPosition", () => {
        it ("should show the y axis position on the left by default", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.showYAxis = true;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            // The axis is on the left by default, and 0 means to movement
            expect(element.find(".y.axis").attr("transform")).to.equal("translate(5, 0)");

            // We make the x2 positive to draw the line to the right
            expect(element.find(".y.axis line").attr("x2")).to.equal("465");
        });
        it ("should show the y axis on the right if set on the right", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.showYAxis = true;
            instance.yAxisPosition = AxisPosition.Right;
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };

            // We move the axis to the right
            expect(element.find(".y.axis").attr("transform")).to.equal("translate(465, 0)");

            // We make the x2 negative to draw the line backward from the right
            expect(element.find(".y.axis line").attr("x2")).to.equal("-465");
        });
        it ("should force a repaint if value is changed", () => {
            const { element, instance } = createInstance();
            expect(instance.showYAxis).to.be.false;
            instance.data = SIMPLE_FAKE_DATA;
            instance.showYAxis = true;
            instance.yAxisPosition = AxisPosition.Right;
            instance.dimensions = { width: 500, height: 200 };

            // We move the axis to the right
            expect(element.find(".y.axis").attr("transform")).to.equal("translate(465, 0)");

            // We make the x2 negative to draw the line backward from the right
            expect(element.find(".y.axis line").attr("x2")).to.equal("-465");
        });
    });

    describe("selectedRange", () => {
        it("should return the selectedRange when set", () => {
            const { instance } = createInstance();
            const selectedRange = [new Date(), new Date()];
            instance.selectedRange = selectedRange.slice(0) as [Date, Date];
            expect(instance.selectedRange).to.be.deep.equal(selectedRange);
        });
        it("should return the selectedRange when set to a different value", () => {
            const { instance } = createInstance();
            const selectedRange = [new Date(1000000), new Date(2000000)];
            const selectedRange2 = [new Date(), new Date()];
            instance.selectedRange = selectedRange.slice(0) as [Date, Date];
            instance.selectedRange = selectedRange2.slice(0) as [Date, Date];
            expect(instance.selectedRange).to.be.deep.equal(selectedRange2);
        });
        it("should adjust the brush when new data is set", () => {
            const { element, instance } = createInstance();
            instance.data = SIMPLE_FAKE_DATA;
            instance.dimensions = { width: 500, height: 200 };
            instance.selectedRange = SIMPLE_FAKE_DATA.map(n => n.date) as [Date, Date];

            const bWidth = element.find(".brush .background").attr("width");

            instance.dimensions = { width: 5000, height: 200 };

            expect(bWidth).to.not.be.equal(element.find(".brush .background").attr("width"));
        });
    });

    describe("dimensions", () => {
        it("should adjust width to a reasonable width", () => {
            const { instance } = createInstance();
            instance.dimensions = { width: -1, height: 200 };
            expect(instance.dimensions.width).to.be.greaterThan(0);
        });
        it("should adjust height to a reasonable height", () => {
            const { instance } = createInstance();
            instance.dimensions = { width: 200, height: -1 };
            expect(instance.dimensions.height).to.be.greaterThan(0);
        });
    });

    describe("events", () => {
        it("should define events", () => {
            const { instance } = createInstance();
            expect(instance.events).to.not.be.undefined;
        });
    });

    describe("UI", () => {
        it("should make an appropriately sized svg", () => {
            const { instance, element } = createInstance();
            instance.dimensions = { width: 500, height: 200 };

            const svgEle = element.find("svg");
            expect(parseFloat(svgEle.attr("width"))).to.be.closeTo(500, 10);
            expect(parseFloat(svgEle.attr("height"))).to.be.closeTo(200, 10);
        });

        it("should create a brush", () => {
            const { instance, element } = createInstance();
            instance.dimensions = { width: 500, height: 200 };

            const brushHandles = element.find(".brush .resize");
            expect(brushHandles.length).to.be.equal(2);
        });
    });

    describe("legend", () => {
        it("should create legend element", () => {
            const { instance, element } = createInstance();
            const svgEle = element.find("svg");
            const legendElement = svgEle.find(".legend");

            expect(legendElement.length).to.equal(1);
        });

        it("should draw legend items when provided", () => {
             const { instance, element } = createInstance();
             const legendElement = element.find("svg").find(".legend");

             let legendData = [
                 {"name": "foo", "color": "#000000"},
                 {"name": "bar", "color": "#FFFFFF"},
             ];

             instance.legendItems = legendData;
             instance.legendFontSize = 10;
             instance.dimensions = { width: 500, height: 200 }; // change dimensions to trigger render

             let legendItems = legendElement.find(".legendItem");
             expect(legendItems.length).to.equal(2);
        });
    });
});
