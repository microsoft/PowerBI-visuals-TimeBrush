import * as React from "react";
import * as ReactDOM from "react-dom";
/* tslint:disable */
const $ = require("jquery");
/* tsline:enable */
import { TimeBrush as TimeBrushImpl, TimeBrushDataItem } from "./TimeBrush";

import "./css/TimeBrush.scss";

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
