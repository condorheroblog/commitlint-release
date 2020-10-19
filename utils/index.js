/** @format */

const { resolve } = require("path");
const chalk = require("chalk");
const fs = require("fs");
const { spawn } = require("child_process");

// 用于resolve使用工程中的文件路径
const resolveApp = (relativePath) => resolve(process.cwd(), relativePath);

/* 过滤已经安装的依赖 */
function filterPkgs(willInsPkgs, isCover) {
	const appPkgPath = resolveApp("./package.json");

	// 判断 package.json 文件是否存在
	if (!fs.existsSync(appPkgPath) || fs.statSync(appPkgPath).isDirectory()) {
		throw new Error(chalk.red("error: 项目 package.json 文件不存在 \n 请使用 npm init 来创建文件后在执行命令！"));
		return;
	}

	// 读取工程中的 package.json
	const appPkg = require(appPkgPath) || {};

	// 读取依赖列表
	const dependencies = {
		...(appPkg.devDependencies || {}),
		...(appPkg.dependencies || {}),
	};

	// 过滤已安装的依赖
	/*
      @commitlint/cli: commitlint 的命令行工具
      @commitlint/config-conventional: commitlint 的规则集，也可以自定义
      husky: 阻止不符合提交规则的 git 记录
      conventional-changelog-cli: 生产 CHANGELOG.md 文件
      standard-version: 版本升级管理
  */
	const pkgs = willInsPkgs
		.filter((p) => {
			if (isCover) {
				return true;
			}
			return !dependencies[p];
		})
		.map((pkg) => {
			/* 指定死大版本号 */
			// 读取依赖列表
			const pinPkg = require(resolve(__dirname, "../package.json"));
			const pinDependencies = {
				...(pinPkg.devDependencies || {}),
				...(pinPkg.dependencies || {}),
			};
			const editionNum = pinDependencies[pkg];
			const subscript = editionNum.indexOf(".");
			return `${pkg}@${editionNum.slice(1, subscript)}`;
		});

	return pkgs;
}

/* 安装依赖 */
function installPkgs(pkgs) {
	return new Promise((resolve, reject) => {
		const childProcess = spawn("npm", ["install", ...pkgs, "-D"], {
			cwd: process.cwd(),
			stdio: "inherit",
		});
		childProcess.on("error", (err) => {
			console.error(chalk.red(err));
			reject(err);
		});
		childProcess.on("exit", (exitCode) => {
			if (exitCode === 0) {
				resolve();
			}
		});
	});
}

module.exports = {
	filterPkgs,
	resolveApp,
	installPkgs,
};
