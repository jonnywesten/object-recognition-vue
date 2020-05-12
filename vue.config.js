const path = require("path");

module.exports = {
  productionSourceMap: false,
  lintOnSave: false,
  outputDir: path.resolve(__dirname, "dist"),
  publicPath: './'
}


