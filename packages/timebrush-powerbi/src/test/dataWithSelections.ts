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

const baseOptions = {"viewport":{"width":749.9630655586335,"height":457.3979686057248},"viewMode":1,"type":2,"operationKind":0,"dataViews":[{"metadata":{"objects":{"general":{"filter":{"fromValue":{"items":{"d":{"entity":"Documents"}}},"whereItems":[{"condition":{"_kind":9,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Documents","variable":"d"},"ref":"date"},"lower":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T16:32:42.263Z","valueEncoded":"datetime'2015-02-01T08:32:42.263'"},"upper":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T23:58:19.480Z","valueEncoded":"datetime'2015-02-01T15:58:19.48'"}}}]}}},"columns":[{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNon<any>Null(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"Documents.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"Documents","variable":"d"},"ref":"date"}}]},"categorical":{"categories":[{"source":{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"Documents.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"Documents","variable":"d"},"ref":"date"}},"identity":[{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:12:39.490Z","valueEncoded":"datetime'2015-02-01T01:12:39.49'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:12:39.490Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:50:34.623Z","valueEncoded":"datetime'2015-02-01T01:50:34.623'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:50:34.623Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:08:24.673Z","valueEncoded":"datetime'2015-02-01T04:08:24.673'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:08:24.673Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:32:56.097Z","valueEncoded":"datetime'2015-02-01T04:32:56.097'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:32:56.097Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T14:26:34.607Z","valueEncoded":"datetime'2015-02-01T06:26:34.607'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T14:26:34.607Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T16:32:42.263Z","valueEncoded":"datetime'2015-02-01T08:32:42.263'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T16:32:42.263Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T18:33:05.697Z","valueEncoded":"datetime'2015-02-01T10:33:05.697'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T18:33:05.697Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T18:51:37.520Z","valueEncoded":"datetime'2015-02-01T10:51:37.52'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T18:51:37.520Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T19:26:50.883Z","valueEncoded":"datetime'2015-02-01T11:26:50.883'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T19:26:50.883Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T23:58:19.480Z","valueEncoded":"datetime'2015-02-01T15:58:19.48'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T23:58:19.480Z\"}}}}"}}],"identityFields":[{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"}],"values":["2015-02-01T09:12:39.490Z","2015-02-01T09:50:34.623Z","2015-02-01T12:08:24.673Z","2015-02-01T12:32:56.097Z","2015-02-01T14:26:34.607Z","2015-02-01T16:32:42.263Z","2015-02-01T18:33:05.697Z","2015-02-01T18:51:37.520Z","2015-02-01T19:26:50.883Z","2015-02-01T23:58:19.480Z"]}],"values":[{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNon<any>Null(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[2,1,1,4,10,2,18,1,19,8],"maxLocal":20,"minLocal":1}]}}]}; //tslint:disable-line

import * as moment from "moment";
import * as _ from "lodash";
export default function dataWithSelections() {
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
        selectedRange: [
            moment("2015-02-01T16:32:42.000").toDate(),
            moment("2015-02-01T23:58:19.000").toDate(),
        ],
    };
};
