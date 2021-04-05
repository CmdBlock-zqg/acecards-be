module.exports = {
  port: 3001, // 服务器运行的端口
  aauth: { // Aauth第四方登录 参见 aauth.link
    id: '',
    secret: ''
  },
  salt: 'AceCards', // token加密盐 可改任意字符串
  db: 'mongodb://127.0.0.1:27017/' // MongoDB连接URL
}