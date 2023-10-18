# wxapp_calculatorWin10
微信小程序 毛玻璃风格科学计算器

[知乎](https://zhuanlan.zhihu.com/p/146367900)

# 计算功能说明

核心功能实现在`pages\index\calculatorDep\calculator_compiler.js`中

## 提取token

`tokenizer`函数将算式字符串转换成`token list`，以下为其功能演示

`token`有函数（Function）、运算符（Operator）、数字（Number）以及括号（paren），函数以及数字通过正则匹配提取。运算符具有优先级

```js
var exp = 'cos(90)*e+√(ln(e)*9+4^2)';
var tokens=tokenizer(exp);
console.log(tokens);
// [
//   { type: 'Function', value: 'cos' },
//   { type: 'paren', value: '(' },
//   { type: 'Number', value: 90 },
//   { type: 'paren', value: ')' },
//   { type: 'Operator', value: '*', grade: 2 },
//   { type: 'Number', value: 2.718281828459045 },
//   { type: 'Operator', value: '+', grade: 1 },
//   { type: 'Operator', value: '√', grade: 3 },
//   { type: 'paren', value: '(' },
//   { type: 'Function', value: 'ln' },
//   { type: 'paren', value: '(' },
//   { type: 'Number', value: 2.718281828459045 },
//   { type: 'paren', value: ')' },
//   { type: 'Operator', value: '*', grade: 2 },
//   { type: 'Number', value: 9 },
//   { type: 'Operator', value: '+', grade: 1 },
//   { type: 'Number', value: 4 },
//   { type: 'Operator', value: '^', grade: 3 },
//   { type: 'Number', value: 2 },
//   { type: 'paren', value: ')' }
// ]
```

## 生成语法树

### 符号语法树

`parser`会从tokens中以递归的方式生成符号语法树（ast）

生成的结果如下所示，遇到括号会将括号（paren）中的内容生成子树。其他内容则是添加到节点（params）

```
{
  "type": "CallExpression",
  "params": [
    {
      "type": "Function",
      "value": "cos",
      "expression": {
        "type": "CallExpression",
        "params": [
          {
            "type": "Number",
            "value": 90
          }
        ]
      }
    },
    {
      "type": "Operator",
      "value": "*",
      "grade": 2
    },
    {
      "type": "Number",
      "value": 2.718281828459045
    },
    {
      "type": "Operator",
      "value": "+",
      "grade": 1
    },
    {
      "type": "Operator",
      "value": "√",
      "grade": 3
    },
    {
      "type": "CallExpression",
      "params": [
        {
          "type": "Function",
          "value": "ln",
          "expression": {
            "type": "CallExpression",
            "params": [
              {
                "type": "Number",
                "value": 2.718281828459045
              }
            ]
          }
        },
        {
          "type": "Operator",
          "value": "*",
          "grade": 2
        },
        {
          "type": "Number",
          "value": 9
        },
        {
          "type": "Operator",
          "value": "+",
          "grade": 1
        },
        {
          "type": "Number",
          "value": 4
        },
        {
          "type": "Operator",
          "value": "^",
          "grade": 3
        },
        {
          "type": "Number",
          "value": 2
        }
      ]
    }
  ]
}
```

### 计算语法树

从tokens转换的得到符号语法树仍然不方便进行计算，需要将其转换成另一种结构的语法树

`traverser`函数会将符号语法树转换成叶子结点为Number或Function，其他节点为Operator的计算语法树，该函数通过递归的方式对树的结构进行重构。构建原理如下：

其会搜索`CallExpression`的符号节点list中优先级最低的运算符，以该符号作为树的节点，将左右侧的符号节点list通过递归的方式构建子节点。最终得到如下二叉计算语法树。这种情况下就能方便的通过递归的方式进行数值计算了。

```
{
  "type": "BinaryOperator",
  "params": [
    {
      "type": "BinaryOperator",
      "params": [
        {
          "type": "Function",
          "value": "cos",
          "expression": {
            "type": "Number",
            "value": 90
          }
        },
        {
          "type": "Number",
          "value": 2.718281828459045
        }
      ],
      "value": "*"
    },
    {
      "type": "BinaryOperator",
      "params": [
        {
          "type": "BinaryOperator",
          "params": [
            {
              "type": "BinaryOperator",
              "params": [
                {
                  "type": "Function",
                  "value": "ln",
                  "expression": {
                    "type": "Number",
                    "value": 2.718281828459045
                  }
                },
                {
                  "type": "Number",
                  "value": 9
                }
              ],
              "value": "*"
            },
            {
              "type": "BinaryOperator",
              "params": [
                {
                  "type": "Number",
                  "value": 4
                },
                {
                  "type": "Number",
                  "value": 2
                }
              ],
              "value": "^"
            }
          ],
          "value": "+"
        }
      ],
      "value": "√"
    }
  ],
  "value": "+"
}
```

## 编译计算

计算的过程就很简单了，叶子结点直接返回对象的值或者函数计算之后的至。其他节点根据运算符对两个子节点进行计算。

# 动态语法检查

功能实现在`pages\index\calculatorDep\BtnCheck.js`文件中，检查的功能基于状态机。以下是大致的检查过程，细节和不一致处详见代码

检查器有几个成员变量

- states：每次输入对应的状态
  - bracket：未匹配的左括号数目
  - btn：当前输入btn属性{value, type}，详见`"pages/index/calculatorDep/util.js"`
  - value：状态值（字符串），`error`状态check函数返回false，表示非法输入
  - chars：当前按键包含的字符串数组。注：数组中会包含一些自动填充的内容，比如按下按钮`sin`，`chars`为`["sin", "("]`，自动添加左括号

- cursorIdx：当前输入光标索引值

  默认状态都是在之前输入尾部进行操作，但是为了能够方便修改之前的内容，添加改变输入光标位置的功能。如果光标不处于尾部则会尝试在光标处插入操作。中间插入的过程就是分离光标之后的操作，尝试添加当前操作，当前操作添加成功之后尝试依次添加分离之后的操作。若任一过程不合法则回退之前状态。

  当前除了从中间插入之外还能在中间DEL（删除前一个操作），其插入过程类似。如果在尾部删除则更加简单。

### 输入状态机

![状态机.drawio](http://picbed-tanchenwei.oss-cn-beijing.aliyuncs.com/typora_aef9a0cd-a4ae-46ca-8d77-b2e85310f0d4.png)
