const nodeExternals = require('webpack-node-externals');

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('shader')
      .test(/\.(vs|fs)$/i)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
  },
  devServer: {
    allowedHosts: "all"
  },
  configureWebpack: config => {
    if(process.env.NODE_ENV === 'production') {
      //By including element-ui and all abi projects, the problem with element-ui
      //stylesheet can be avoided.
      config.externals =  [ nodeExternals({allowlist: [/^element-ui/, /^@abi-software/, /^physiomeportal/]}) ];
    }
  },
  css: {
    //Import variables into all stylesheets.
    loaderOptions: {
      sass: {
        additionalData: `@import '@/assets/styles';`
      }
    }
  }
}
