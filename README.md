[![CircleCI](https://circleci.com/gh/Microsoft/PowerBI-visuals-TimeBrush/tree/master.svg?style=svg)](https://circleci.com/gh/Microsoft/PowerBI-visuals-TimeBrush/tree/master)

# TimeBrush

Time Brush lets you filter a time-based dataset by directly dragging or brushing over a time period of interest. The initial display is a helpful overview that shows the frequency of items in each pre-defined time bucket (e.g., hours, days, years) as a vertical bar chart. Whenever you select a time period, any linked visuals are automatically filtered to display only those records with time attributes in the selected period.

![TimeBrush](/assets/screenshot.png?raw=true)

> This visual is experimental and not actively being developed, only major issues will be addressed.

## Usage
* Install [node.js 6+](https://nodejs.org)
* Install [yarn](https://yarnpkg.com/lang/en/docs/install)
* Run `yarn` on the project directory, which will install all the dependencies
* Run `yarn test` which will lint, test, and compile the `timebrush` and `timebrush-powerbi` packages.
    * Compiling `timebrush-powerbi` will also create a `.pbiviz` file in the `packages/timebrush/powerbi/dist` directory, which can be imported directly in [Power BI](https://app.powerbi.com/)