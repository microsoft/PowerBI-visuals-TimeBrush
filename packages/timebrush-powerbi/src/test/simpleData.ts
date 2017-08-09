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

const baseOptions = {"viewport":{"width":699.1761148904005,"height":217.8095238095238},"viewMode":1,"type":4,"dataViews":[{"metadata":{"objects":{"dataPoint":{"colorMode":1}},"columns":[{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"TimeBrush.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush","variable":"t"},"ref":"date"}}]},"categorical":{"categories":[{"source":{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"TimeBrush.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush","variable":"t"},"ref":"date"}},"identity":[{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T08:34:11.367Z","valueEncoded":"datetime'2015-02-01T00:34:11.367'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T08:34:11.367Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:55:51.197Z","valueEncoded":"datetime'2015-02-01T01:55:51.197'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:55:51.197Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T13:04:44.227Z","valueEncoded":"datetime'2015-02-01T05:04:44.227'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T13:04:44.227Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T16:10:08.297Z","valueEncoded":"datetime'2015-02-01T08:10:08.297'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T16:10:08.297Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T17:34:52.093Z","valueEncoded":"datetime'2015-02-01T09:34:52.093'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T17:34:52.093Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T20:22:23.773Z","valueEncoded":"datetime'2015-02-01T12:22:23.773'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T20:22:23.773Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T21:48:40.513Z","valueEncoded":"datetime'2015-02-01T13:48:40.513'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T21:48:40.513Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-02T02:42:38.377Z","valueEncoded":"datetime'2015-02-01T18:42:38.377'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-02T02:42:38.377Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-02T05:07:26.540Z","valueEncoded":"datetime'2015-02-01T21:07:26.54'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-02T05:07:26.540Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-02T09:14:15.057Z","valueEncoded":"datetime'2015-02-02T01:14:15.057'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"TimeBrush\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-02T09:14:15.057Z\"}}}}"}}],"identityFields":[{"_kind":2,"source":{"_kind":0,"entity":"TimeBrush"},"ref":"date"}],"values":["2015-02-01T08:34:11.367Z","2015-02-01T09:55:51.197Z","2015-02-01T13:04:44.227Z","2015-02-01T16:10:08.297Z","2015-02-01T17:34:52.093Z","2015-02-01T20:22:23.773Z","2015-02-01T21:48:40.513Z","2015-02-02T02:42:38.377Z","2015-02-02T05:07:26.540Z","2015-02-02T09:14:15.057Z"]}],"values":[{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[49,48,47,46,45,44,43,42,41,40],"maxLocal":49,"minLocal":49}]}}]}; // tslint:disable-line

import * as moment from "moment";
import * as _ from "lodash";
export default function simpleData() {
    "use strict";
    const clonedOptions = <powerbi.extensibility.visual.VisualUpdateOptions><any>_.cloneDeep(baseOptions);

    // Wont represent correctly with JSON stringify
    const values = clonedOptions.dataViews[0].categorical.values;

    (<any>values)["grouped"] = () => {
        return values.map((n, i) => {
            const v = _.cloneDeep(n);
            v["name"] = "GROUPED_" + i;
            // v["objects"] = objects[i] as any;
            return v;
        });
    };
    return {
        options: clonedOptions,
        expected: [{
            date: moment("2015-02-01T08:34:11.000").toDate(),
            value: 49,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T09:55:51.000").toDate(),
            value: 48,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T13:04:44.000").toDate(),
            value: 47,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T16:10:08.000").toDate(),
            value: 46,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T17:34:52.000").toDate(),
            value: 45,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T20:22:23.000").toDate(),
            value: 44,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-01T21:48:40.000").toDate(),
            value: 43,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-02T02:42:38.000").toDate(),
            value: 42,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-02T05:07:26.000").toDate(),
            value: 41,
            valueSegments: [{
                value: 100,
            }],
        },
        {
            date: moment("2015-02-02T09:14:15.000").toDate(),
            value: 40,
            valueSegments: [{
                value: 100,
            }],
        }],
    };
};

