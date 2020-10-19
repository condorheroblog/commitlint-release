// 关闭当前文件的ESLint校验
/* eslint-disable */

// 关闭当前行的ESLint校验
// let a = 1; // eslint-disable-line

// 关闭下一行的ESLint校验
// eslint-disable-next-line
// let b = 2;
module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	extends: ["plugin:prettier/recommended"],
	globals: {
		$: true,
	},
	rules: {
		/*
			注意注释的规则——要么是和prettier规则冲突的或重复的
		 	保留的这几个规则是作为prettier的补充
		*/
		// 注释位置
		"line-comment-position": ["error", { position: "above" }],
		// 不允许注释与代码同一行
		"no-inline-comments": "error",
		// 注释符号前后加空格
		"spaced-comment": ["error", "always", { exceptions: ["*"] }],
		// 变量驼峰命名
		"camelcase": "off",
		// 代码不省略花括号
		"curly": "error",
		// 禁止出现未使用过的变量
		"no-unused-vars": [
			"error",
			// we are only using this rule to check for unused arguments since TS
			// catches unused variables but not args.
			{ varsIgnorePattern: '.*', args: 'none' }
		],
		// 缩进
		// indent: [
		//     'error',
		//     "tab",
		//     {
		//         SwitchCase: 1,
		//         VariableDeclarator: 1,
		//         ArrayExpression: 1,
		//         ObjectExpression: 1,
		//         ImportDeclaration: 1,
		//         ignoredNodes: ['ConditionalExpression'],
		//     },
		// ],
		// 箭头函数间距样式
		// 'arrow-spacing': 'error',
		// 在箭头函数体之前不允许换行
		// 'implicit-arrow-linebreak': 'error',
		// 块内部间隔
		// 'block-spacing': 'error',
		// 大括号风格
		// 'brace-style': ['error', '1tbs', { allowSingleLine: true }],
		// 逗号空格
		// 'comma-spacing': ['error', { before: false, after: true }],
		// 逗号样式
		// 'comma-style': ['error', 'last'],
		// 生成器
		// 'generator-star-spacing': ['error', { before: true, after: false }],
		// 对象字面量属性中强制在冒号周围放置空格
		// 'key-spacing': ['error', { beforeColon: false, afterColon: true }],
		// 关键字前后加空格
		// 'keyword-spacing': 'error',
		// 函数调用不加空格
		// 'func-call-spacing': ['error', 'never'],
		// 属性前无空格
		// 'no-whitespace-before-property': 'error',
		// 格式化函数
		// 'space-before-function-paren': ['error', 'never'],
		// 扩展运算符
		// "rest-spread-spacing": ["error"],
		// 要求操作符周围有空格
		// 'space-infix-ops': ['error', { int32Hint: false }],
		// 数组空格
		// 'array-bracket-spacing': ['error', 'always', {
		//   "singleValue": false,
		//   "objectsInArrays": false,
		//   "arraysInArrays": false
		// }],
		// 当最后一个元素或属性与闭括号 ] 或 } 在 不同的行时，允许（但不要求）使用拖尾逗号；当在 同一行时，禁止使用拖尾逗号
		// 'comma-dangle': ['error', 'only-multiline'],
	},
};
