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

import EventEmitter from "../base/EventEmitter";
import { TimeBrushDataItem } from "./models";

/* tslint:disable */
const $ = require("jquery");
/* tslint:enable */
import * as _ from "lodash";
import * as d3 from "d3";

const DEBOUNCE_TIME = 1000;
const TICK_WIDTH = 100;
const MINIMUM_WIDTH = 100;
const MINIMUM_HEIGHT = 50;

/**
 * Represents a timebrush
 */
/* @Mixin(EventEmitter)*/
export class TimeBrush {
    private element: JQuery;
    private svg: d3.Selection<any>;
    private x: d3.time.Scale<Date, any>;
    private y: d3.scale.Linear<any, any>;
    private brush: d3.svg.Brush<Date>;
    private clip: d3.Selection<any>;
    private brushGrip: d3.Selection<any>;
    private context: d3.Selection<any>;
    private brushEle: d3.Selection<any>;
    private xAxis: d3.Selection<any>;
    private _dimensions: { width: number; height: number; } = { width: 500, height: 500 };
    private _eventEmitter = new EventEmitter();
    private _data: TimeBrushDataItem[];
    private _range: [Date, Date];
    private defs: d3.Selection<any>;
    private bars: d3.Selection<any>;
    private _barWidth = 2;

    /**
     * Constructor for the timebrush
     */
    constructor(element: JQuery, dimensions?: any) {
        this.element = element;
        this.element.hide();
        this.x = d3.time.scale<Date>();
        this.y = d3.scale.linear();
        this.buildTimeScale();
        if (!this.dimensions) {
            this.resizeElements();
        } else {
            this.dimensions = dimensions;
        }
    }

    /**
     * Returns the data contained in this timebrush
     */
    public get data() {
        return this._data;
    }

    /**
     * Setter for the data
     */
    public set data(data: TimeBrushDataItem[]) {
        this._data = data || [];
        this.selectedRange = undefined;

        // Hide/show based on the data
        this.element.toggle(this._data.length > 0);

        this.x.domain(d3.extent(this._data.map((d) => d.date)));
        this.y.domain([0, d3.max(this._data.map((d) => +d.value))]);
        this.resizeElements();
    }

    /**
     * Gets an event emitter by which events can be listened to
     * Note: Would be nice if we could mixin EventEmitter
     */
    public get events() {
        return this._eventEmitter;
    }

    /**
     * Gets the dimensions of this timebrush
     */
    public get dimensions() {
        return this._dimensions;
    }

    /**
     * Gets the bar width
     */
    public get barWidth() {
        return this._barWidth;
    }

    /**
     * Sets the bar width
     */
    public set barWidth(value: number) {
        this._barWidth = value || 2;
        this.resizeElements();
    }

    /**
     * Sets the dimensions of this timebrush
     */
    public set dimensions(value: any) {
        $.extend(this._dimensions, value);
        this.dimensions.height = Math.max(MINIMUM_HEIGHT, this.dimensions.height);
        this.dimensions.width = Math.max(MINIMUM_WIDTH, this.dimensions.width);
        this.resizeElements();
        if (this._range && this._range.length) {
            this.brush.extent(<any>this._range);
            this.brush(d3.select(this.element.find(".brush")[0]));
        }
    }

    /**
     * Getter for selected range
     */
    public get selectedRange() {
        return (this._range || []).slice(0) as [Date, Date];
    }

    /**
     * Sets the currently selected range of dates
     */
    public set selectedRange(range: [Date, Date]) {
        function selectedRangeChanged(): boolean {
            // One is set, other is unset
            if ((!range || !this._range) && (range || this._range)) {
                return true;
            }

            if (range && this._range) {
                // Length of Array Changed
                if (range.length !== this._range.length) {
                    return true;
                } else {
                    // Check each date
                    return range.some((v, i) => {
                        return v.getTime() !== this._range[i].getTime();
                    });
                }
            }
            return false;
        }

        function redrawRange() {
            if (range && range.length === 2) {
                this.brush.extent(<any>range);
            } else {
                this.brush.clear();
            }
            this.brush(d3.select(this.element.find(".brush")[0]));
        }

        if (selectedRangeChanged.bind(this)()) {
            this._range = range;
            redrawRange.bind(this)();
        }
    }

    /**
     * Builds the initial timescale
     */
    private buildTimeScale() {
        this.svg = d3.select(this.element[0]).append("svg");

        this.defs = this.svg.append("defs");
        this.clip = this.defs.append("clipPath")
            .attr("id", "clip")
            .append("rect");

        this.context = this.svg.append("g")
            .attr("class", "context");

        this.bars = this.context.append("g")
            .attr("class", "bars");

        this.xAxis = this.context.append("g")
            .attr("class", "x axis");

        let brushed = _.debounce(() => {
            const dateRange: any[] = this.brush.empty() ? [] : this.brush.extent();
            this._range = <any>dateRange;
            this.events.raiseEvent("rangeSelected", dateRange);
        }, DEBOUNCE_TIME);

        this.brush = d3.svg.brush().on("brush", brushed);
    }

    /**
     * Resizes all the elements in the graph
     */
    private resizeElements() {
        let margin = { top: 0, right: 20, bottom: 20, left: 20 },
            width = this._dimensions.width - margin.left - margin.right,
            height = this._dimensions.height - margin.top - margin.bottom;

        const actualDims = this.element[0].getBoundingClientRect();
        const actualWidth = actualDims.right - actualDims.left;

        // Default to 1 if we have no data
        let scale = actualWidth > 0 && this.dimensions.width > 0 ? this.dimensions.width / actualWidth : 1;

        this.x.range([0, <any>width]);
        this.y.range([height, 0]);

        if (this.bars && this._data) {
            const barWidth = this.barWidth || 2;
            let tmp = this.bars
                .selectAll("rect")
                .data(this._data);

            tmp
                .enter().append("rect");

            tmp
                .attr("transform", (d, i) => {
                    let rectHeight = this.y(0) - this.y(d.value);
                    let x = this.x(d.date) || 0;
                    return `translate(${(x - (barWidth / 2))},${height - rectHeight})`;
                })
                .attr("fill", (d, i) => {
                    return `url(${this.element[0].ownerDocument.URL || ""}#rect_gradient_${i})`;
                })
                .attr("width", barWidth)
                .attr("height", (d) => Math.max(0, this.y(0) - this.y(d.value)));

            tmp.exit().remove();
        }

        if (this._data) {
            const gradients =
                this.defs.selectAll("linearGradient")
                    .data(this._data);
            gradients.enter()
                .append("linearGradient")
                .attr("id", (d, i) => "rect_gradient_" + i)
                .attr({
                    x1: 0,
                    x2: 0,
                    y1: 1,
                    y2: 0,
                });

            gradients.exit().remove();
            gradients
                .attr("id", (d, i) => "rect_gradient_" + i);

            const stops = gradients.selectAll("stop")
                .data((d) => {
                    const stops: any[] = [];
                    const segments = d.valueSegments;
                    let offset = 0;
                    segments.forEach((n, i) => {
                        stops.push({
                            offset: (offset + (i > 0 ? .0001 : 0)) + "%",
                            color: n.color,
                        });

                        offset += n.value;

                        if (i < segments.length - 1) {
                            stops.push({
                                offset: offset + "%",
                                color: n.color,
                            });
                        }
                    });
                    return stops;
                });
            stops.enter().append("stop");
            stops
                .attr({
                    offset: (d) => d.offset,
                    "stop-color": (d) => d.color,
                });
            stops.exit().remove();
        }

        // This translates the scaling done by PBI from css scaling to svg scaling.
        const svgWidth = width + margin.left + margin.right;
        const svgHeight = height + margin.top + margin.bottom;
        const invertScale = 1 / scale;
        const renderedWidth = svgWidth * invertScale;
        const renderedHeight = svgHeight * invertScale;
        const translateX = (renderedWidth - svgWidth) / 2;
        const translateY = (renderedHeight - svgHeight) / 2;
        this.svg
            .attr("width", renderedWidth)
            .attr("height", renderedHeight)
            .attr("style", `transform:translate(-${translateX}px, -${translateY}px) scale(${scale}, ${scale})`);

        this.clip
            .attr("width", width)
            .attr("height", height);

        this.xAxis
            .attr("transform", "translate(0," + height + ")")
            .call(d3.svg.axis().scale(this.x).orient("bottom").ticks(this.dimensions.width / TICK_WIDTH));

        // Removes all overlapping/offscreen thangies
        let svgInfo = (this.svg.node() as Element).getBoundingClientRect();
        let dateTicks = this.xAxis
            .selectAll(".tick");
        for (let j = 0; j < dateTicks[0].length; j++) {
            let c = dateTicks[0][j] as Element,
            n = dateTicks[0][j + 1] as Element;
            let cRect = c && c.getBoundingClientRect();
            let nRect = n && n.getBoundingClientRect();
            if (cRect && (cRect.right > svgInfo.right || cRect.left < svgInfo.left)) {
                d3.select(c).remove();
                continue;
            }
            if (!cRect || !nRect) {
                continue;
            }
            while (cRect.right > nRect.left) {
                d3.select(n).remove();
                j++;
                n = dateTicks[0][j + 1] as Element;
                nRect = n && n.getBoundingClientRect();
                if (!n) {
                    break;
                }
            }
        }

        this.context
            .attr("transform", `scale(${invertScale}, ${invertScale}) translate(${margin.left},${margin.top})`);

        this.brush.x(<any>this.x);

        // Need to recreate the brush element for some reason
        d3.selectAll(this.element.find(".x.brush").toArray()).remove();
        this.brushEle = this.context.append("g")
            .attr("class", "x brush")
            .call(this.brush)
            .selectAll("rect")
            .attr("height", height + 7)
            .attr("y", -6);

        this.brushGrip = d3.select(this.element.find(".x.brush")[0])
            .selectAll(".resize").append("rect")
            .attr("x", -3)
            .attr("rx", 2)
            .attr("ry", 2)
            .attr("y", (height / 2) - 15)
            .attr("width", 6)
            .attr("fill", "lightgray")
            .attr("height", 30);
    }
}
