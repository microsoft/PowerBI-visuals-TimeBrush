import * as React from "react";

export interface IDocumentViewerProps {
    data: string;
};

export interface IDocumentViewerState { }

/**
 * Thin wrapper around LineUp
 */
export class History extends React.Component<IDocumentViewerProps, IDocumentViewerState> {
    /**
     * Renders this component
     */
    public render() {
        return (
            <div style={{ height: "100%", width: "100%" }}>
                <h1>History Widget</h1>
                {this.props.data}
            </div>
        );
    }
}
