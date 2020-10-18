// 关闭当前文件
/* eslint-disable */

// 关闭当前行校验
let a = 1; // eslint-disable-line

// 关闭下一行校验
// eslint-disable-next-line
let b = 2;
module.exports = {
  "env": {
      "browser": true,
      "es2021": true
  },
  "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
  },
  "extends": [
    "plugin:prettier/recommended"
  ],
  "globals": {
      $: true
  },
  "rules": {
      // 缩进
      "indent": [ "error", 4, {
          "SwitchCase": 1,
          "VariableDeclarator": 1,
          "ArrayExpression": 1,
          "ObjectExpression": 1,
          "ImportDeclaration": 1,
          "ignoredNodes": [ "ConditionalExpression" ]
      }],
      // 不允许尾随逗号
      "comma-dangle": [ "error", "never" ],
      // 数组空格
      "array-bracket-spacing": [ "error", "always" ],
      // 对象空格
      "object-curly-spacing": [ "error", "always" ],
      // 箭头函数间距样式
      "arrow-spacing": "error",
      // 在箭头函数体之前不允许换行
      "implicit-arrow-linebreak": "error",
      // 块内部间隔
      "block-spacing": "error",
      // 大括号风格
      "brace-style": [ "error", "1tbs", { "allowSingleLine": true } ],
      "camelcase": "off",
      // 逗号空格
      "comma-spacing": [ "error", { "before": false, "after": true } ],
      // 逗号样式
      "comma-style": [ "error", "last" ],
      // 不省略花括号
      "curly": "error",
      // 生成器
      "generator-star-spacing": [ "error", { "before": true, "after": false } ],
      // 对象字面量属性中强制在冒号周围放置空格
      "key-spacing": [ "error", { "beforeColon": false, "afterColon": true } ],
      // 关键字前后加空格
      "keyword-spacing": "error",
      // 函数调用不加空格
      "func-call-spacing": [ "error", "never" ],
      // 属性前无空格
      "no-whitespace-before-property": "error",
      // semi分号
      "semi": "error",
      // 格式化函数
      "space-before-function-paren": [ "error", "never" ],
      // 扩展运算符
      "rest-spread-spacing": [ "error" ],
      // 注释位置
      "line-comment-position": [ "error", { "position": "above" } ],
      // 不允许与代码同一行
      "no-inline-comments": "error",
      // 注释符号前后加空格
      "spaced-comment": [ "error", "always", { "exceptions": [ "*" ] } ],
      // 要求操作符周围有空格
      "space-infix-ops": [ "error", { "int32Hint": false } ]
  }
};
