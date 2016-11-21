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

const baseOptions = {"viewport":{"width":489.1571906354515,"height":304.4882943143813},"viewMode":1,"type":2,"operationKind":0,"dataViews":[{"metadata":{"objects":{"dataPoint":{"colorMode":1,"startColor":{"solid":{"color":"#FE9666"}},"startValue":50},"selection":{"clearSelectionAfterDataChange":false},"display":{"reverseBars":true,"barWidth":10}},"columns":[{"roles":{"Series":true},"type":{"underlyingType":260,"category":<any>null},"format":"0","displayName":"bucket","queryName":"Attributes.bucket","expr":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"bucket"}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"Documents.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"Documents","variable":"d"},"ref":"date"}}]},"categorical":{"categories":[{"source":{"roles":{"Times":true},"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"format":"G","displayName":"date","queryName":"Documents.date","expr":{"_kind":2,"source":{"_kind":0,"entity":"Documents","variable":"d"},"ref":"date"}},"identity":[{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:12:39.490Z","valueEncoded":"datetime'2015-02-01T01:12:39.49'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:12:39.490Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:50:34.623Z","valueEncoded":"datetime'2015-02-01T01:50:34.623'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:50:34.623Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T09:53:10.430Z","valueEncoded":"datetime'2015-02-01T01:53:10.43'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T09:53:10.430Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T10:20:44.597Z","valueEncoded":"datetime'2015-02-01T02:20:44.597'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T10:20:44.597Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T10:51:02.040Z","valueEncoded":"datetime'2015-02-01T02:51:02.04'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T10:51:02.040Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T11:41:19.393Z","valueEncoded":"datetime'2015-02-01T03:41:19.393'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T11:41:19.393Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:08:24.673Z","valueEncoded":"datetime'2015-02-01T04:08:24.673'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:08:24.673Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:16:45.757Z","valueEncoded":"datetime'2015-02-01T04:16:45.757'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:16:45.757Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:26:17.947Z","valueEncoded":"datetime'2015-02-01T04:26:17.947'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:26:17.947Z\"}}}}"}},{"_expr":{"_kind":13,"comparison":0,"left":{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"},"right":{"_kind":17,"type":{"underlyingType":519,"category":<any>null,"temporalType":{"underlyingType":519}},"value":"2015-02-01T12:32:56.097Z","valueEncoded":"datetime'2015-02-01T04:32:56.097'"}},"_key":{"factoryMethod":<any>null,"value":"{\"comp\":{\"k\":0,\"l\":{\"col\":{\"s\":{\"e\":\"Documents\"},\"r\":\"date\"}},\"r\":{\"const\":{\"t\":7,\"v\":\"2015-02-01T12:32:56.097Z\"}}}}"}}],"identityFields":[{"_kind":2,"source":{"_kind":0,"entity":"Documents"},"ref":"date"}],"values":["2015-02-01T09:12:39.490Z","2015-02-01T09:50:34.623Z","2015-02-01T09:53:10.430Z","2015-02-01T10:20:44.597Z","2015-02-01T10:51:02.040Z","2015-02-01T11:41:19.393Z","2015-02-01T12:08:24.673Z","2015-02-01T12:16:45.757Z","2015-02-01T12:26:17.947Z","2015-02-01T12:32:56.097Z"]}],"values":[{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,4,2,<any>null,1,1,<any>null,1,1]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[1,<any>null,1,1,1,1,<any>null,<any>null,2,1]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,1,4,1,3,<any>null,1,1,1]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,1,2,1,2,<any>null,<any>null,1,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,3,<any>null,2,3,<any>null,<any>null,<any>null,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,2,1,1,<any>null,<any>null,<any>null,<any>null,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[1,<any>null,2,1,2,1,<any>null,1,1,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,1,<any>null,<any>null,1,<any>null,1,1,1]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,<any>null,5,2,1,<any>null,1,<any>null,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,1,4,2,1,<any>null,<any>null,2,<any>null,<any>null]},{"source":{"roles":{"Values":true},"type":{"underlyingType":260,"category":<any>null},"displayName":"Count of doc_id","queryName":"CountNonNull(Attributes.doc_id)","expr":{"_kind":4,"arg":{"_kind":2,"source":{"_kind":0,"entity":"Attributes","variable":"a"},"ref":"doc_id"},"func":5}},"values":[<any>null,<any>null,<any>null,<any>null,<any>null,<any>null,<any>null,<any>null,<any>null,<any>null]}]}}]}; // tslint:disable-line


import * as _ from "lodash";
export default function dataWithBucketsAndSettings() {
    "use strict";
    const clonedOptions = <powerbi.VisualUpdateOptions><any>_.cloneDeep(baseOptions);

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
    const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;

    // We use valueSegments.reverse() because we set the "Reverse Bars" setting to true
    // Colors are from the
    return {
        options: clonedOptions,
        settings: {
            barWidth: 10,
            clearSelectionOnDataChange: false,
            reverseBars: true,
            gradient: {
                startValue: 50,
                endValue: <any>undefined,
                startColor: "#FE9666",
                endColor: <any>undefined,
            },
        },
        expected: [{
            date: new Date(Date.parse("2015-02-01T09:12:39.000Z") + tzOffset),
            value: 2,
            valueSegments: [
                { color: "#082cbd", value: 50 },
                { color: "#001ec8", value: 50 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T09:50:34.000Z") + tzOffset),
            value: 1,
            valueSegments: [{ color: "#0026c1", value: 100 }].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T09:53:10.000Z") + tzOffset),
            value: 19,
            valueSegments: [
                { color: "#0014d0", value: 21.05 },
                { color: "#082cbd", value: 5.26 },
                { color: "#0e2ebb", value: 5.26 },
                { color: "#0016ce", value: 5.26 },
                { color: "#0019cc", value: 15.79 },
                { color: "#001cca", value: 10.53 },
                { color: "#001ec8", value: 10.53 },
                { color: "#0021c6", value: 5.26 },
                { color: "#0026c1", value: 21.05 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T10:20:44.000Z") + tzOffset),
            value: 18,
            valueSegments: [
                { color: "#0014d0", value: 11.11 },
                { color: "#082cbd", value: 5.56 },
                { color: "#0e2ebb", value: 22.22 },
                { color: "#0016ce", value: 11.11 },
                { color: "#001cca", value: 5.56 },
                { color: "#001ec8", value: 5.56 },
                { color: "#0024c3", value: 27.78 },
                { color: "#0026c1", value: 11.11 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T10:51:02.000Z") + tzOffset),
            value: 11,
            valueSegments: [
                { color: "#082cbd", value: 9.09 },
                { color: "#0e2ebb", value: 9.09 },
                { color: "#0016ce", value: 9.09 },
                { color: "#0019cc", value: 18.18 },
                { color: "#001cca", value: 9.09 },
                { color: "#001ec8", value: 18.18 },
                { color: "#0024c3", value: 18.18 },
                { color: "#0026c1", value: 9.09 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T11:41:19.000Z") + tzOffset),
            value: 13,
            valueSegments: [
                { color: "#0014d0", value: 7.69 },
                { color: "#082cbd", value: 7.69 },
                { color: "#0e2ebb", value: 23.08 },
                { color: "#0016ce", value: 15.38 },
                { color: "#0019cc", value: 23.08 },
                { color: "#001ec8", value: 7.69 },
                { color: "#0021c6", value: 7.69 },
                { color: "#0024c3", value: 7.69 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T12:08:24.000Z") + tzOffset),
            value: 1,
            valueSegments: [{ color: "#0014d0", value: 100 }].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T12:16:45.000Z") + tzOffset),
            value: 6,
            valueSegments: [
                { color: "#0e2ebb", value: 16.67 },
                { color: "#001ec8", value: 16.67 },
                { color: "#0021c6", value: 16.67 },
                { color: "#0024c3", value: 16.67 },
                { color: "#0026c1", value: 33.33 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T12:26:17.000Z") + tzOffset),
            value: 7,
            valueSegments: [
                { color: "#0014d0", value: 14.29 },
                { color: "#082cbd", value: 28.57 },
                { color: "#0e2ebb", value: 14.29 },
                { color: "#0016ce", value: 14.29 },
                { color: "#001ec8", value: 14.29 },
                { color: "#0021c6", value: 14.29 },
            ].reverse(),
        },
        {
            date: new Date(Date.parse("2015-02-01T12:32:56.000Z") + tzOffset),
            value: 4,
            valueSegments: [
                { color: "#0014d0", value: 25 },
                { color: "#082cbd", value: 25 },
                { color: "#0e2ebb", value: 25 },
                { color: "#0021c6", value: 25 },
            ].reverse(),
        }],
    };
};

