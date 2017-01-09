const path = require("path");
const babel = require("rollup-plugin-babel");

const {
  version,
  name
} = require('./package.json');

const banner =
    '/*!\n' +
    ' * v' + version + '\n' +
    ' * (c) 2016-' + new Date().getFullYear() + ' Evan You\n' +
    ' * Released under the MIT License.\n' +
    ' */';

export default {
  banner,
  entry : path.resolve(__dirname,"./src/index.js"),
  dest : path.resolve(__dirname,"./dest/framwork.js"),
  format : "umd",
  sourceMap: true,
  moduleName : name,
  plugins : [
    babel({ runtimeHelpers: true })
  ]
};
