#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const pkg = require("../package.json");
const { filterPkgs, resolveApp, installPkgs } = require("../utils");
const log = console.log;

function printHelp(code = 0) {
	const lines = [
		"",
		"  Usage:",
		"    npx init-commitlint",
		"",
		"  Options:",
		"    -v, -V, --version           print the version of commitlint-release",
		"    -h, -H, --help              display this message",
		"    --cover                     覆盖已有依赖，暂未生效",
		"",
	];
	log(chalk.yellow(lines.join("\n")));
	process.exit(code);
}

function printVersion() {
	log(chalk.magenta(`${pkg.name} ${pkg.version}`));
	process.exit();
}

/**
 * 程序主要任务
 * @param {boolean?} isCover 是否覆盖依赖，默认不覆盖
 */
function start(isCover) {
	const willInsPkgs = ["commitizen", "@commitlint/cli", "conventional-changelog-cli", "husky", "standard-version"];
	const pkgs = filterPkgs(willInsPkgs, isCover);
	// 执行依赖安装
	if (pkgs.length > 0) {
		installPkgs(pkgs).then(function () {
			log(chalk.green("依赖安装完成！"));
			log(
				chalk.greenBright(
					[
						"你可以尝试一次 commit 提交，来看看 husky 是否正常工作",
						"",
						"如果没有触发 husky,请运行命令 `rm -rf .git/hooks/ && npm i -D husky`",
						"",
						"你也可以运行 以下命令:",
						"",
						"`npm run changelog`: 生成 CHANGELOG.md 文件",
						"`npm run commit`: 用于代替`git add . & git commit` 提交",
						"更多命令请去项目 package.json 文件中查看 ✌️",
					].join("\n")
				)
			);
		});
	}

	// 读取工程中的 package.json
	const appPkg = require(resolveApp("./package.json")) || {};
	// 添加相关配置到项目package.json中
	// 添加config配置
	appPkg.config = {
		...(appPkg.config || {}),
		commitizen: {
			path: "./node_modules/commitlint-release/lib/cz",
		},
	};

	// 添加husky钩子
	if (appPkg.husky) {
		if (appPkg.husky.hooks) {
			appPkg.husky.hooks["pre-commit"] = "npm run format && git add .";
			appPkg.husky.hooks["commit-msg"] = "commitlint -E HUSKY_GIT_PARAMS";
		} else {
			appPkg.husky.hooks = {
				"pre-commit": "npm run format && git add .",
				"commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
			};
		}
	} else {
		appPkg.husky = {
			hooks: {
				"pre-commit": "npm run format && git add .",
				"commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
			},
		};
	}

	// 动态添加命令到package.json
	appPkg.scripts = {
		...(appPkg.scripts || {}),
		changelog: "conventional-changelog --config ./node_modules/commitlint-release/lib/log -i CHANGELOG.md -s -r 0",
		commit: "git add . && git-cz",
		lint: "eslint --ext .js --ext .jsx src/",
		release: "standard-version",
		publish: "node scripts/release.js",
		"push:dev": "node scripts/pushDev.js",
	};

	// 重新写入package.json
	fs.writeFileSync(resolveApp("./package.json"), JSON.stringify(appPkg, null, 2));
	// 添加commitlint.config.js到项目中
	fs.createReadStream(path.resolve(__dirname, "../template/commitlint.config.js")).pipe(
		fs.createWriteStream(resolveApp("./commitlint.config.js"))
	);
	/*
      添加release.js到项目中
      createWriteStream不会自己创建不存在的文件夹，所以在使用之前需要注意，保存文件的文件夹一定要提前创建。
  */
	!fs.existsSync("./scripts/") && fs.mkdirSync("./scripts/");
	fs.createReadStream(path.resolve(__dirname, "../template/release.js")).pipe(
		fs.createWriteStream(resolveApp("./scripts/release.js"))
	);
	fs.createReadStream(path.resolve(__dirname, "../template/pushDev.js")).pipe(
		fs.createWriteStream(resolveApp("./scripts/pushDev.js"))
	);
}

// 启动函数
function main(argv) {
	// 获取解析后的参数，获取一个就移出一个
	const getArg = function () {
		let args = argv.shift();
		args = args.split("=");
		return args;
	};

	while (argv.length) {
		// 获取合法命令，直到所有命令行参数都解析完毕或者程序退出
		const [key] = getArg();
		switch (key) {
			// 打印版本号
			case "-v":
			case "-V":
			case "--version":
				return printVersion();
			// 打印帮助信息
			case "-h":
			case "-H":
			case "--help":
				return printHelp();
			case "--cover":
				return start(true);
			default:
				break;
		}
	}
	start();
}

// 启动程序就开始执行主函数
main(process.argv.slice(2));

module.exports = main;
