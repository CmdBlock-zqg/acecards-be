# AceCards

卡片式记忆APP

## 部署指南

### 后端

后端服务器所需环境

```
MongoDB 4+
Node.js 12+
```

1. 获取源代码并安装依赖

```
git clone https://github.com/CmdBlock-zqg/acecards-be.git
cd acecards
npm i
```

2. 修改配置文件

```
cp config.example.js config.js
vi config.js
```

```js
module.exports = {
  port: 3001, // 服务器运行的端口
  aauth: { // Aauth第四方登录 参见 aauth.link
    id: '',
    secret: ''
  },
  salt: 'AceCards', // token加密盐 可改任意字符串
  db: 'mongodb://127.0.0.1:27017/' // MongoDB连接URL
}
```

3. 运行

```
node index.js
```

### 前端

参见[前端仓库](https://github.com/CmdBlock-zqg/acecards-fe) 

### 代理

AceCards 必须**前后端同源**且**在域名根目录**，并且**必须**使用 **SSL**。建议使用 Nginx 等软件进行代理。

参考 Nginx 配置：

```nginx
server {
    listen 443 ssl;
    server_name acecards.xxx.xxx;

    ssl_certificate  /etc/nginx/cert/acecards.pem; # 证书路径
    ssl_certificate_key /etc/nginx/cert/acecards.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        root /opt/acecards/acecards-fe/; # 前端路径
        client_max_body_size 1024m;
   }
   
   location /api/ {
        proxy_pass  http://127.0.0.1:3001/api/; # 后端地址
        client_max_body_size 1024m;
    }
}

server {
    listen 80;
    server_name acecards.xxx.xxx;
    rewrite ^(.*)$ https://acecards.xxx.xxx$1 permanent;
}
```

