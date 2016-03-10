"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/// <reference path="../../base/references.d.ts"/>
var ForceGraph_1 = require("./ForceGraph");
var VisualBase_1 = require("../../base/VisualBase");
var Utils_1 = require("../../base/Utils");
var InteractivityService = powerbi.visuals.InteractivityService;
var SelectionId = powerbi.visuals.SelectionId;
var utility = powerbi.visuals.utility;
var colors = require("../../base/powerbi/colors");
var GraphVisual = (function (_super) {
    __extends(GraphVisual, _super);
    function GraphVisual() {
        _super.apply(this, arguments);
        /**
         * The font awesome resource
         */
        this.fontAwesome = {
            url: '//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css',
            integrity: 'sha256-3dkvEK0WLHRJ7/Csr0BZjAWxERc5WH7bdeUya2aXxdU= sha512-+L4yy6FRcDGbXJ9mPG8MT' +
                '/3UCDzwR9gPeyFNMCtInsol++5m3bk2bXWKdZjvybmohrAsn3Ua5x8gfLnbE1YkOg==',
            crossorigin: "anonymous"
        };
        this.settings = $.extend(true, {}, GraphVisual.DEFAULT_SETTINGS);
        // private template : string = `
        //     <div class="load-container load5">
        //         <div class="loader">Loading...</div>
        //     </div>`;
        this.template = "\n        <div id=\"node_graph\" style= \"height: 100%;\"> </div>\n    ";
    }
    /** This is called once when the visual is initialially created */
    GraphVisual.prototype.init = function (options) {
        _super.prototype.init.call(this, options, this.template);
        this.element.append(this.template);
        this.myGraph = new ForceGraph_1.ForceGraph(this.element.find("#node_graph"), 500, 500);
        this.host = options.host;
        this.interactivityService = new InteractivityService(this.host);
        this.attachEvents();
        this.selectionManager = new utility.SelectionManager({ hostServices: this.host });
    };
    /** Update is called for data updates, resizes & formatting changes */
    GraphVisual.prototype.update = function (options) {
        _super.prototype.update.call(this, options);
        var dataView = options.dataViews && options.dataViews.length && options.dataViews[0];
        var dataViewTable = dataView && dataView.table;
        var forceDataReload = this.updateSettings(options);
        if (dataViewTable) {
            if ((forceDataReload || this.hasDataChanged(this.dataViewTable, dataViewTable))) {
                var parsedData = GraphVisual.converter(dataView, this.settings);
                this.myGraph.setData(parsedData);
            }
            var selectedIds = this.selectionManager.getSelectionIds();
            var data = this.myGraph.getData();
            if (data && data.nodes && data.nodes.length) {
                var updated = false;
                data.nodes.forEach(function (n) {
                    var isSelected = !!_.find(selectedIds, function (id) { return id.equals(n.identity); });
                    if (isSelected !== n.selected) {
                        n.selected = isSelected;
                        updated = true;
                    }
                });
                if (updated) {
                    this.myGraph.redrawSelection();
                }
                this.myGraph.redrawLabels();
            }
        }
        this.dataViewTable = dataViewTable;
        var currentDimensions = this.myGraph.dimensions;
        if (currentDimensions.width !== options.viewport.width ||
            currentDimensions.height !== options.viewport.height) {
            this.myGraph.dimensions = { width: options.viewport.width, height: options.viewport.height };
            this.element.css({ width: options.viewport.width, height: options.viewport.height });
        }
    };
    /**
     * Enumerates the instances for the objects that appear in the power bi panel
     */
    GraphVisual.prototype.enumerateObjectInstances = function (options) {
        return [{
                selector: null,
                objectName: options.objectName,
                properties: $.extend(true, {}, this.settings[options.objectName])
            }];
    };
    /**
     * Converts the data view into an internal data structure
     */
    GraphVisual.converter = function (dataView, settings) {
        var nodeList = [];
        var nodeMap = {};
        var linkList = [];
        var table = dataView.table;
        var colMap = {};
        table.columns.forEach(function (n, i) {
            colMap[n.displayName.toLocaleLowerCase()] = i;
        });
        // group defines the bundle basically
        // name, user friendly name,
        // num, size of circle, probably meant to be the number of matches
        // source - array index into nodes
        // target - array index into node
        // value - The number of times that the link has been made, ie, I emailed bob@gmail.com 10 times, so value would be 10
        var sourceIdx = colMap[settings.columnMappings.source.toLocaleLowerCase()];
        var sourceColorIdx = colMap[settings.columnMappings.sourceColor.toLocaleLowerCase()];
        var sourceLabelColorIdx = colMap[settings.columnMappings.sourceLabelColor.toLocaleLowerCase()];
        var sourceGroup = colMap[settings.columnMappings.sourceGroup.toLocaleLowerCase()];
        var targetGroupIdx = colMap[settings.columnMappings.targetGroup.toLocaleLowerCase()];
        var targetColorIdx = colMap[settings.columnMappings.targetColor.toLocaleLowerCase()];
        var targetLabelColorIdx = colMap[settings.columnMappings.targetLabelColor.toLocaleLowerCase()];
        var targetIdx = colMap[settings.columnMappings.target.toLocaleLowerCase()];
        var edgeValueIdx = colMap[settings.columnMappings.edgeValue.toLocaleLowerCase()];
        var sourceField = dataView.categorical.categories[0].identityFields[sourceIdx];
        var targetField = dataView.categorical.categories[0].identityFields[targetIdx];
        function getNode(id, identity, isSource, color, labelColor, group) {
            if (color === void 0) { color = "gray"; }
            if (labelColor === void 0) { labelColor = undefined; }
            if (group === void 0) { group = 0; }
            var node = nodeMap[id];
            // var expr = identity.expr;
            var expr = powerbi.data.SQExprBuilder.equal(isSource ? sourceField : targetField, powerbi.data.SQExprBuilder.text(id));
            if (!nodeMap[id]) {
                node = nodeMap[id] = {
                    name: id,
                    color: color || "gray",
                    labelColor: labelColor,
                    index: nodeList.length,
                    filterExpr: expr,
                    num: 1,
                    selected: false,
                    identity: SelectionId.createWithId(powerbi.data.createDataViewScopeIdentity(expr))
                };
                nodeList.push(node);
            }
            return node;
        }
        table.rows.forEach(function (row, idx) {
            var identity = table.identity[idx];
            if (row[sourceIdx] && row[targetIdx]) {
                /** These need to be strings to work properly */
                var sourceId = row[sourceIdx] + "";
                var targetId = row[targetIdx] + "";
                var edge = {
                    source: getNode(sourceId, identity, true, row[sourceColorIdx], row[sourceLabelColorIdx], row[sourceGroup]).index,
                    target: getNode(targetId, identity, false, row[targetColorIdx], row[targetLabelColorIdx], row[targetGroupIdx]).index,
                    value: row[edgeValueIdx]
                };
                nodeList[edge.source].num += 1;
                nodeList[edge.target].num += 1;
                linkList.push(edge);
            }
        });
        return {
            nodes: nodeList,
            links: linkList
        };
    };
    /**
    * Gets the external css paths used for this visualization
    */
    GraphVisual.prototype.getExternalCssResources = function () {
        return _super.prototype.getExternalCssResources.call(this).concat(this.fontAwesome);
    };
    /**
     * Gets the inline css used for this element
     */
    GraphVisual.prototype.getCss = function () {
        return _super.prototype.getCss.call(this).concat([require("!css!sass!./css/GraphVisual.scss")]);
    };
    /**
     * Handles updating of the settings
     */
    GraphVisual.prototype.updateSettings = function (options) {
        // There are some changes to the options
        var dataView = options.dataViews && options.dataViews.length && options.dataViews[0];
        if (dataView && dataView.metadata) {
            var oldSettings = $.extend(true, {}, this.settings);
            var newObjects = dataView.metadata.objects;
            // Merge in the settings
            $.extend(true, this.settings, newObjects ? newObjects : GraphVisual.DEFAULT_SETTINGS);
            // There were some changes to the layout
            if (!_.isEqual(oldSettings.layout, this.settings.layout)) {
                this.myGraph.configuration = $.extend(true, {}, this.settings.layout);
            }
            if (!_.isEqual(oldSettings.columnMappings, this.settings.columnMappings)) {
                // This is necessary because some of the settings affect how the data is loaded
                return true;
            }
        }
        return false;
    };
    /**
     * Returns if all the properties in the first object are present and equal to the ones in the super set
     */
    GraphVisual.prototype.objectIsSubset = function (set, superSet) {
        var _this = this;
        if (_.isObject(set)) {
            return _.any(_.keys(set), function (key) { return !_this.objectIsSubset(set[key], superSet[key]); });
        }
        return set === superSet;
    };
    /**
     * Determines if the old data is different from the new data.
     */
    GraphVisual.prototype.hasDataChanged = function (oldData, newData) {
        if (!oldData || !newData || oldData.rows.length !== newData.rows.length) {
            return true;
        }
        // If there are any elements in newdata that arent in the old data
        return _.any(newData.identity, function (n) { return !_.any(oldData.identity, function (m) { return m.key.indexOf(n.key) === 0; }); });
    };
    /**
     * Attaches the line up events to lineup
     */
    GraphVisual.prototype.attachEvents = function () {
        var _this = this;
        if (this.myGraph) {
            // Cleans up events
            if (this.listener) {
                this.listener.destroy();
            }
            this.listener = this.myGraph.events.on("selectionChanged", function (node) { return _this.onNodeSelected(node); });
        }
    };
    /**
     * Gets called when a node is selected
     */
    GraphVisual.prototype.onNodeSelected = function (node) {
        var filter;
        if (node) {
            filter = powerbi.data.SemanticFilter.fromSQExpr(node.filterExpr);
            this.selectionManager.select(node.identity, false);
        }
        else {
            this.selectionManager.clear();
        }
        var objects = {
            merge: [
                {
                    objectName: "general",
                    selector: undefined,
                    properties: {
                        "filter": filter
                    }
                }
            ]
        };
        this.host.persistProperties(objects);
    };
    GraphVisual.DEFAULT_SETTINGS = {
        columnMappings: {
            source: "source",
            target: "target",
            edgeValue: "value",
            sourceColor: "sourceColor",
            sourceLabelColor: "sourceLabelColor",
            targetColor: "targetColor",
            targetLabelColor: "targetLabelColor",
            sourceGroup: "sourceGroup",
            targetGroup: "targetGroup"
        },
        layout: {
            linkDistance: 10,
            linkStrength: 2,
            gravity: .1,
            charge: -120,
            labels: false,
            minZoom: .1,
            maxZoom: 100,
            defaultLabelColor: colors[0]
        }
    };
    GraphVisual.capabilities = {
        dataRoles: [{
                name: "Edges",
                displayName: "Edges",
                kind: powerbi.VisualDataRoleKind.GroupingOrMeasure,
            }],
        dataViewMappings: [{
                table: {
                    rows: {
                        for: { in: "Edges" }
                    }
                }
            }],
        objects: {
            general: {
                displayName: powerbi.data.createDisplayNameGetter('Visual_General'),
                properties: {
                    filter: {
                        type: { filter: {} },
                        rule: {
                            output: {
                                property: 'selected',
                                selector: ['Values'],
                            }
                        }
                    },
                },
            },
            columnMappings: {
                displayName: "Column Bindings",
                properties: {
                    source: {
                        displayName: "Source Column",
                        type: { text: true }
                    },
                    target: {
                        displayName: "Target Column",
                        type: { text: true }
                    },
                    edgeValue: {
                        displayName: "Edge Weight Column",
                        type: { text: true }
                    },
                    sourceColor: {
                        displayName: "Source Node Color Column",
                        type: { text: true }
                    },
                    sourceLabelColor: {
                        displayName: "Source Node Label Color Column",
                        type: { text: true }
                    },
                    targetColor: {
                        displayName: "Target Node Color Column",
                        type: { text: true }
                    },
                    targetLabelColor: {
                        displayName: "Target Node Label Color Column",
                        type: { text: true }
                    },
                },
            },
            layout: {
                displayName: "Layout",
                properties: {
                    linkDistance: {
                        displayName: "Link Distance",
                        type: { numeric: true }
                    },
                    linkStrength: {
                        displayName: "Link Strength",
                        type: { numeric: true }
                    },
                    gravity: {
                        displayName: "Gravity",
                        type: { numeric: true }
                    },
                    charge: {
                        displayName: "Charge",
                        type: { numeric: true }
                    },
                    labels: {
                        displayName: "Labels",
                        description: "If labels on the nodes should be shown",
                        type: { bool: true }
                    },
                    defaultLabelColor: {
                        displayName: "Default Label Color",
                        description: "The default color to use for labels",
                        type: { text: true }
                    },
                    minZoom: {
                        displayName: "Min Zoom",
                        type: { numeric: true }
                    },
                    maxZoom: {
                        displayName: "Max Zoom",
                        type: { numeric: true }
                    }
                }
            }
        }
    };
    GraphVisual = __decorate([
        Utils_1.Visual(JSON.parse(require("./build.json")).output.PowerBI)
    ], GraphVisual);
    return GraphVisual;
}(VisualBase_1.VisualBase));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GraphVisual;
;