/*导入path模块*/
const path = require('path');

module.exports = {
  /*入口*/
  entry: './js/main.js',
  /*出口*/
  output: {
    /*绝对路径，动态获取,第一个参数获取当前文件所在路径，我们要放到dist文件夹下*/
    path: path.resolve('__dirname' , 'dist'),
    filename: 'main.js'
  },
}
