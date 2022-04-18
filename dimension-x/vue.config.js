const { resolve } = require("path");
const webpack = require("webpack");
const Version = new Date().getTime();

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // prependData: `@import "./src/assets/css/global.scss";`,
      },
    }
  },
  /* 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath */
  /* baseUrl: process.env.NODE_ENV === 'production' ? './' : '/' */
  // publicPath: process.env.NODE_ENV === "production" ? "/public/" : "./",
  publicPath: "./",
  /* 输出文件目录：在npm run build时，生成文件的目录名称 */
  outputDir: "dapp",
  /* 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录 */
  assetsDir: "./",
  /* 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度 */
  productionSourceMap: false,
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变) */
  filenameHashing: false,
  /* 代码保存时进行eslint检测 */
  lintOnSave: false,
  /* webpack-dev-server 相关配置 */
  devServer: {
    public: require('os').networkInterfaces()[Object.keys(require('os').networkInterfaces())[0]][1].address + ':8198',
    disableHostCheck: true,
    /* 自动打开浏览器 */
    open: false,
    /* 设置为0.0.0.0则所有的地址均能访问 */
    // host: "192.168.3.10",
    port: 8198,
    proxy: {
      '/api': {
        target: 'http://156.236.70.120/', // target表示代理的服务器url
        changeOrigin: true,
        pathRewrite: {     // pathRewrite表示路径重写，key表示一个正则，value表示别名
          '^/api': ''   // 即用 '/api'表示'http://localhost:3000/api'
        }
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        'books': resolve('public/books')
      }
    }
    // plugins: [
    //   new webpack.ProvidePlugin({})
    // ],
    // /* 打包配置版本号 */
    // output: { /* 模块名称+时间戳 */
    //   filename: `[name].${Version}.js`,
    //   chunkFilename: `[name].${Version}.js`
    // }
  }
}