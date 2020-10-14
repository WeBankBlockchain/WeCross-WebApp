# WeCross-WebApp

## Project Structure

```shell
.
├── README.md
├── babel.config.js
├── build               # 构建脚本
├── mock                # 调试用mock服务器
├── node_modules        # 包
├── package-lock.json   # npm包指定版本配置
├── package.json        # npm配置
├── plop-templates      # plop构建文件模板
├── plopfile.js         # plop构建脚本
├── public
├── src                 # 源代码
└── vue.config.js       # vue+webpack 配置文件
```

```shell
$ tree ./src -L 1
./src
├── App.vue         # vue主入口
├── api             # 根据服务端API发送请求
├── assets
├── components      # 主要组件目录
├── icons           # 图标组件
├── layout          # 整体布局
├── main.js         # 主入口
├── permission.js   # 权限管理
├── router          # 布局路由
├── settings.js     # 全局配置
├── store           # vueX状态目录
├── styles          # scss目录
├── utils           # 工具包
└── views           # 主要视图
```

## Project setup

```shell
npm install
```

### Compiles and hot-reloads for development

```shell
npm run serve
```

### Compiles and minifies for production

```shell
npm run build
```

### Lints and fixes files

```shell
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
