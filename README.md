<!-- @format -->

# commitlint-release

![NPM version](https://img.shields.io/npm/v/commitlint-release)
![Downloads](https://img.shields.io/npm/dw/commitlint-release)
![License](https://img.shields.io/npm/l/commitlint-release)

> 这是一个集成了 [commitizen](https://www.npmjs.com/package/commitizen)、[commitlint 又叫@commitlint/cli](https://github.com/conventional-changelog/commitlint)、[standard-version](https://www.npmjs.com/package/standard-version)、[conventional-changelog](https://www.npmjs.com/package/conventional-changelog) 、[conventional-changelog-cli](https://www.npmjs.com/package/conventional-changelog-cli)、[editorconfig](https://editorconfig.org)、[prettier](https://prettier.io/)、[ESLint](https://eslint.org/) 基础配置的插件。

## 前言

如果是自己开发项目，自己对于代码风格要求不那么高的话，自己可以怎么爽怎么来，但是一旦项目涉及到多人协作或有外包同事进入，这时候代码规范和风格是一件特别重要的事情，重要性丝毫不亚于业务逻辑的实现。

社区对这方面给出了很多插件，但是需要一个一个的集成，换个项目又的动手自己复制，多麻烦呀。对于这种类似 CLI 脚手架的工具，最好是做成 npm 包，非常便于携带呦。

## commitlint-release 介绍

代码灵感来源：[vue-cli-plugin-commitlint-release](https://github.com/wangjiaojiao77/vue-cli-plugin-commitlint-release#readme)

这是个小姐姐写的插件，真是厉害呢，就是可惜只支持 Vue 环境，所以如果我要是开发 React 或 Node 的就尴尬了 😅。不过这个插件源代码也很简单，你可以照着 [插件开发指南](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html) 来学习下 @vue/cli 插件的开发技巧。

## commitlint-release 的功能：

1. 自动检测 `commit message` 是否符合规范，不规范不允许提交
2. 自动提示 `commit message` 填写格式，不怕忘记规范怎么写。
3. 自动更新 `package.json` 里的版本号。
4. 自动生成 `changelog`，更好的维护版本迭代。
5. 集成 `git add . && git commit` 不需要在执行两个命令，配合 `shelljs` 这个 npm 包能更强大。
6. 自动格式化代码。

## 使用

首先安装 `commitlint-release`

```bash
npm i commitlint-release -D
```

执行 `npx init-commitlint` 命令来初始化配置

```bash
npx init-commitlint
```

这时会自动在 package.json 中添加相关配置和命令

```json
"scripts": {
  "changelog": "conventional-changelog --config ./node_modules/commitlint-release/lib/log -i CHANGELOG.md -s -r 0",
  "commit": "git add . && git-cz",
  "lint": "eslint --ext .js --ext .jsx src/",
  "release": "standard-version",
  "publish": "node scripts/release.js",
  "format": "prettier --write 'src/**/*.{ts,tsx,json,md,yml,js,jsx,scss,less,stylus,vue}'",
  "push:dev": "node scripts/pushDev.js"
},
"config": {
  "commitizen": {
    "path": "./node_modules/commitlint-release/lib/cz"
  }
},
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
  }
}
```

同时也会在项目根目录即 package.json 所在目录，自动增加 `commitlint.config.js` 文件，其内容为：

```js
module.exports = {
	extends: ["./node_modules/commitlint-release/lib/lint"],
};
```

除了之外，你还可以运行命令：

```js
npx commitlint-mk
```

来生成 `.prettierrc、.eslintrc.js、.eslintignore、.editorconfig` 这四个文件。文件夹内有各自的官网链接和使用方法。

## 命令介绍

```bash
npm run commit      # 自动化 commit message
npm run release     # 自动更新 package.json 里的版本号
npm run changelog   # 自动生成 changelog 更好的维护版本迭代
npm run publish     # 先选择升级的版本类型在生成changelog日志，然后推送到远程
npm run lint        # 使用 eslint 检查代码
npm run format      # 使用 prettier 格式化指定目录的代码
npm run push:dev    # 自己写的脚本命令
```

## 自动更新版本号并生成 `changelog`

```
npm run publish
```

输入命令后，提示输入 [ major | minor | patch ]，以当前版本 1.0.0 为例：

-   major：主版本号，当你做了不兼容的 API 修改。这时候的 version 应该为 2.0.0。
-   minor：次版本号，当你做了向下兼容的功能性新增。这时候的 version 应该为 1.1.0。
-   patch：修订号，当你做了向下兼容的问题修正。这时候的 version 应该为 1.0.1。

具体参考：[semver 语义化版本控制规范](https://semver.org/lang/zh-CN/)

## 格式化代码

格式化命令：`npm run format`

主要是使用 prettier 插件来格式化指定目录的代码，prettier 有一套固定的格式话代码规则，但是这些规则大部分都不可以给我们自定义，只有灰常少的一小部分可以自己配置，可以配置的规则在此 [Options](https://prettier.io/docs/en/options.html) ，虽然 prettier 格式化规则较为霸道，但是格式化完还是很好看的，所以多人协作牺牲一点个人写代码的风格还是可以接受的，既然 prettier 负责代码风格，那么 ESlint，就主要用来检查代码质量（例如变量未定义不允许使用等），和补充 prettier 没有照顾到的代码风格（补充的千万不能和 prettier 规则冲突）（例如：注释和代码不能在同一行）。

## commit 规范

commit type 规则简单说明

-   **feat**: 新增一个新特性
-   **fix**: 默默修了一个 Bug
-   **docs**: 更新了文档（比如改了 Readme）
-   **style**: 代码的样式美化，不涉及到功能修改（比如改了缩进）
-   **refactor**: 一些代码结构上优化，既不是新特性也不是修 Bug（比如函数改个名字）
-   **perf**: 优化了性能的代码改动
-   **test**: 新增或者修改已有的测试代码
-   **chore**: 跟仓库主要业务无关的构建/工程依赖/工具等功能改动（比如新增一个文档生成工具）

关于 commit 规范和相关配置可以去看一下阮一峰老师的文章: [Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

## 配合 shelljs

平时在开发中会需要频繁的合代码合提交代码，这就出现了两个痛点：

-   频繁操作，会使用相同的命令，麻烦。。。
-   提交或合代码的时候，可能会出错，一旦出错还的回归版本，一不小心就挺麻烦。。。

这时就可以根据自己的提交步骤结合 shelljs 来简化提交步骤。`npm run push:dev` 命令就是用 shelljs 来写的。

## 常见问题

我有时候会发现 husky 在 commit 阶段没有起作用，可能时 husky 还没有和 git 关联，删除下重新安装就行了。

```bash
rm -rf .git/hooks/ && npm i -D husky
```
