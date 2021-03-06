#!/usr/bin/env node
const { join } = require("path");
const fs = require("fs");
const { createReadStream, createWriteStream, existsSync } = require("fs");
const chalk = require("chalk");
const { log, warn } = console;
const { installPkgs, filterPkgs, resolveApp } = require("../utils");

const addFilePath = [".prettierrc", ".eslintrc.js", ".eslintignore", ".editorconfig"];
let createFiles = [];

addFilePath.forEach((filePath) => {
	if (existsSync(filePath)) {
		warn(chalk.red.bold(`\n 项目中 「${filePath}」 文件已存在，不能重复创建 🤪 \n`));
	} else {
		createFiles.push(`${filePath} ❤️`);
		createReadStream(join(__dirname, `../${filePath}`)).pipe(createWriteStream(resolveApp(filePath)));
	}
});

if (createFiles.includes(".eslintrc.js ❤️")) {
	const willInsPkgs = ["prettier", "eslint", "eslint-config-prettier", "eslint-plugin-prettier"];
	const pkgs = filterPkgs(willInsPkgs);
	if (pkgs.length > 0) {
		installPkgs(pkgs).then(function () {
			log(chalk.green("依赖安装完成！"));
			log(
				chalk.greenBright(
					[
						".editorconfig 和 .prettierrc 文件可直接使用",
						"",
						"eslint 要想结合 prettier 使用，需要复制 .eslintrc.js 文件的 extends 字段到你的 eslint 配置文件中，至于 .eslintrc.js 的 rules 字段自己酌情使用即可",
						"",
					].join("\n")
				)
			);
		});
	}
}

// 读取工程中的 package.json
const appPkg = require(resolveApp("./package.json")) || {};
// 动态添加命令到package.json
appPkg.scripts = {
	...(appPkg.scripts || {}),
	format: "prettier --write 'src/**/*.{ts,tsx,json,md,yml,js,jsx,scss,less,stylus,vue}'",
};
// 添加husky钩子
if (appPkg.husky) {
	if (appPkg.husky.hooks) {
		appPkg.husky.hooks["pre-commit"] = "npm run format && git add .";
	} else {
		appPkg.husky.hooks = {
			"pre-commit": "npm run format && git add .",
		};
	}
} else {
	appPkg.husky = {
		hooks: {
			"pre-commit": "npm run format && git add .",
		},
	};
}
// 重新写入package.json
fs.writeFileSync(resolveApp("./package.json"), JSON.stringify(appPkg, null, 4));

let feedbackInfo = [];
if (createFiles.length) {
	feedbackInfo = [
		`命令执行完成 ✅，创建了 ${createFiles.length} 个文件`,
		"",
		`创建的文件分别为： ${createFiles.join("")}`,
		"",
		"快去看看你项目根目录新增了那些文件吧！👍",
		"",
	];
} else {
	feedbackInfo = [`命令执行完成 ✅，创建了 ${createFiles.length} 个文件 👎`, ""];
}

log(chalk.green.bold(feedbackInfo.join("\n")));
