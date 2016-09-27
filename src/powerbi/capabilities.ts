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
