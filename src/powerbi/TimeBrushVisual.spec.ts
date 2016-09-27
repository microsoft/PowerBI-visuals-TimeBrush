import { Utils as SpecUtils } from "essex.powerbi.base/spec/visualHelpers";
import { expect } from "chai";
import TimeBrushVisual from "./TimeBrushVisual";
import * as $ from "jquery";

describe("TimeBrushVisual", () => {
    let parentEle: JQuery;
    beforeEach(() => {
        global["d3"] = require("d3");
        global["_"] = require("underscore");
        parentEle = $("<div></div>");
    });

    afterEach(() => {
        if (parentEle) {
            parentEle.remove();
        }
        parentEle = null;
    });

    let createVisual = () => {
        let instance = new TimeBrushVisual(true);
        let initOptions = SpecUtils.createFakeInitOptions();
        parentEle.append(initOptions.element);

        instance.init(initOptions);
        return {
            instance,
            element: initOptions.element,
        };
    };

    it("should load", () => {
        expect(createVisual()).to.not.be.undefined;
    });

    it("should restore selection after a page change");
});
