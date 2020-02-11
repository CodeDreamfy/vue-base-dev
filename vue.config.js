const webpack = require('webpack');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
  },
  publicPath: './',
  devServer: {
    https: false,
    hotOnly: false,
    proxy: {
      '/dealbook/server': {
        target: 'http://172.16.4.157',
        // target: 'http://172.16.4.156',
        changeOrigin: true,
      },
      '/dbookWebGateway': {
        target: 'http://172.16.4.156',
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        _: 'lodash',
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.BASE_URL': JSON.stringify('/'),
      }),
      // new MiniCssExtractPlugin({
      //   filename: devMode ? '[name].css' : '[name].[hash].css',
      //   chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      // })
      // new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en')
    ],
    module: {
      rules: [],
    },
  },
  css: {
    loaderOptions: {
      postcss: {},
    },
  },
};