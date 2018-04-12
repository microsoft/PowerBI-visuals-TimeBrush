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

import { TimeBrushDataItem } from "@essex/timebrush";
import { IColoredObject } from "@essex/visual-settings";

/**
 * The data item used by the TimeBrushVisual
 */
export interface TimeBrushVisualDataItem extends TimeBrushDataItem {

    /**
     * The identity for this individual selection item
     */
    identity: powerbi.visuals.ISelectionId;

    /**
     * The raw unparsed date for this item
     */
    rawDate: any;
}

/**
 * Represents a set of color settings for the time brush
 */
export interface IColorSettings {

    /**
     * The default bar color to use
     */
    defaultBarColor?: string;

    /**
     * The individual colors for each series
     */
    seriesColors?: IColoredObject[];

    /**
     * Whether or not to use a gradient
     */
    useGradient?: boolean;

    /**
     * The settings for the gradient
     */
    gradient?: IGradientSetting;
}

/**
 * Represents a set of settings required to create a gradient
 */
export interface IGradientSetting {
    /**
     * The start color of the gradient
     */
    startColor?: string;

    /**
     * The start value of the gradient
     */
    startValue?: number;

    /**
     * The end color of the gradient
     */
    endColor?: string;

    /**
     * The end value of the gradient
     */
    endValue?: number;
}

/**
 * Represents the mode to color things
 */
export enum ColorMode {
    Gradient = 1,
    Instance = 2
}
