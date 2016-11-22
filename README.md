# TimeBrush

Time Brush lets you filter a time-based dataset by directly dragging or brushing over a time period of interest. The initial display is a helpful overview that shows the frequency of items in each pre-defined time bucket (e.g., hours, days, years) as a vertical bar chart. Whenever you select a time period, any linked visuals are automatically filtered to display only those records with time attributes in the selected period.

> This visual is currently in beta testing and is undergoing active development.

## Getting Started
* Fork this repo
* Install [node.js 6+](https://nodejs.org)
* Run `npm install` on the project directory
* The `src` directory contains all of the visual's code.

## Building
* Running `npm run build` will do the following:
  * Compiles the `src` directory.
  * Creates a `.pbiviz` file in the `dist\powerbi` directory.
    * Go to [Power BI](https://app.powerbi.com/), and to import your new visual.
