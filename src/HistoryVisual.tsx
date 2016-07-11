import * as React from "react";
import * as ReactDOM from "react-dom";
import { History } from "./History";

import { VisualBase, Visual } from "essex.powerbi.base";
import IVisual = powerbi.IVisual;
import VisualCapabilities = powerbi.VisualCapabilities;
import VisualInitOptions = powerbi.VisualInitOptions;
import VisualUpdateOptions = powerbi.VisualUpdateOptions;

@Visual(require("./build").output.PowerBI)
export default class DocumentViewerVisual extends VisualBase implements IVisual {
    public static capabilities: VisualCapabilities = {
        dataRoles: [
            {
                displayName: "Category",
                name: "Category",
                kind: powerbi.VisualDataRoleKind.Grouping,
            },
        ],
        // This tells power bi how to map your roles above into the dataview you will receive
        dataViewMappings: [
            {
                categorical: {
                    categories: {
                        for: { in: "Category" },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [{ bind: { to: "Y" } }]
                    },
                },
            },
        ],
    };

    private hostContainer: JQuery;
    private visuals: any[] = [];

    /** This is called once when the visual is initialially created */
    public init(options: VisualInitOptions): void {
        if (!window["statefulVisuals"]) {
            window["statefulVisuals"] = [];
        }
        this.visuals = window["statefulVisuals"];
        window["registerStatefulVisual"] = (viz: any) => {
            console.log("Registering Visual", viz);
            this.visuals.push(viz);
        };

        console.log("Initializing History; statefulVisuals=", this.visuals);
        this.hostContainer = options.element;

        ReactDOM.render((
            <History data="hello!" />
        ), this.hostContainer.get(0));
    }

    /** Update is called for data updates, resizes & formatting changes */
    public update(options: VisualUpdateOptions) {
        // console.log("update options", options);
        const dataViews = options.dataViews;
        if (!dataViews)  {
            return;
        }
        this.updateContainerViewports(options.viewport);
    }

    private updateContainerViewports(viewport: {width: number; height: number}) {
        const width = viewport.width;
        const height = viewport.height;
        this.hostContainer.css({
            "height": height,
            "width": width
        });
    }
}
