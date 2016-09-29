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

import * as React from "react";
import * as ReactDOM from "react-dom";
/* tslint:disable */
const $ = require("jquery");
/* tsline:enable */
import { TimeBrush as TimeBrushImpl } from "../TimeBrush";
import { TimeBrushDataItem } from "../models";

import "../css/TimeBrush.scss";

export interface TimeBrushProps {
    selectedRange?: [Date, Date];
    onSelectedRangeChanged?: (range: [Date, Date]) => void;
    data?: TimeBrushDataItem[];
    width?: number;
    height?: number;
};

export interface TimeBrushState { }

/**
 * Thin wrapper around TimeBrush
 */
export class TimeBrush extends React.Component<TimeBrushProps, TimeBrushState> {
    public props: TimeBrushProps = {};
    private timeBrush: TimeBrushImpl;
    private node: any;

    public componentDidMount(): void {
        this.node = ReactDOM.findDOMNode(this);
        this.timeBrush = new TimeBrushImpl($(this.node), {width: this.props.width, height: this.props.height});
        this.timeBrush.events.on("rangeSelected", (range: [Date, Date]) => {
            if (this.props && this.props.onSelectedRangeChanged) {
                this.props.onSelectedRangeChanged(range);
            }
        });
        this.renderContent();
    }

    public componentWillReceiveProps(newProps: TimeBrushProps): void {
        this.renderContent(newProps);
    }

    /**
     * Renders this component
     */
    public render(): JSX.Element {
        return <div className="timeBrushContainer"></div>;
    }

    private renderContent(props?: TimeBrushProps): void {
        // if called from `componentWillReceiveProps`, then we use the new
        // props, otherwise use what we already have.
        props = props || this.props;

        this.timeBrush.data = props.data || [];
        this.timeBrush.selectedRange = props.selectedRange || null;
        this.timeBrush.dimensions = {
            width: this.props.width,
            height: this.props.height,
        };
    }
}
