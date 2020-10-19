/** @format */

const inquirer = require("inquirer"); //命令行交互模块
const shell = require("shelljs");
const chalk = require("chalk");

if (!shell.which("git")) {
	shell.echo("Sorry, this script requires git");
	shell.exit(1);
}

const main = async () => {
	const { addType } = await inquirer.prompt([
		{
			type: "list",
			name: "addType",
			default: "-u",
			choices: ["-u", ".", "-A"],
			message: "please choose add option : [ . | -A |-u ]: ",
		},
	]);

	shell.echo(chalk.yellowBright`\n git add option value is 「${addType}」 \n`);
	let commitMess = "";
	while (!commitMess.length) {
		const inputValue = await inquirer.prompt([
			{
				type: "input",
				name: "commitMess",
				message: "please input commit message:<type>(<scope>): <subject> ",
			},
		]);
		commitMess = inputValue.commitMess;
	}
	await shell.exec(`git add ${addType}`);
	await shell.exec(`git commit -m ${commitMess}`);
	await shell.exec("git pull origin dev --rebase");
	await shell.exec("git push origin HEAD:refs/for/dev");
	shell.echo(chalk.cyanBright`\n success 👍 \n`);
};

main();
