
var wallabyWebpack = require('wallaby-webpack');
var wallabyPostprocessor = wallabyWebpack(require("./webpack.config.test"));

module.exports = function (wallaby) {
  return {
    // set `load: false` to all source files and tests processed by webpack
    // (except external files),
    // as they should not be loaded in browser,
    // their wrapped versions will be loaded instead
    files: [
      // {pattern: 'lib/jquery.js', instrument: false},
      {pattern: 'src/**/*.{ts,scss,json}', load: false},
      {pattern: 'base/**/*.{ts,scss,json}', load: false},
      {pattern: 'node_modules/essex.powerbi.base/css/*.{scss}', load: false},
      {pattern: '!src/**/*.spec.ts', load: false}
    ],

    tests: [
      {pattern: 'src/**/*.spec.ts', load: false}
    ],

    postprocessor: wallabyPostprocessor,

    setup: function () {
      // required to trigger test loading
      window.__moduleBundler.loadTests();
    }
  };
};
