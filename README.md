### 介绍
 这是一套MVP框架，内部由一个基类展开，拥有一个模块加载器，以及使用`director.js`作为路由，使用`handlebars.js`作为模版引擎。
它是在我参考上家公司的两套框架之后造的一个轮子，在很多地方都受到这两套框架的影响，并且那时候并没有接触过mvvm框架与数据双向绑定等功能，所以在接下来可能会加上对应功能。

### 内部构造
>它的内部由核心部分、路由、加载依赖项、模版引擎组成,并且它必须依赖jquery

* 路由模块依赖`director.js`,它的配置文件在`public/options/router.json`中，这里可以配置默认路由地址，以及加载路由时所引入的配置文件
* 模版引擎依赖`handlebars.js`,它能使View层具备模版引擎的能力，但是必须遵循handlebars的语法
* 加载依赖处理器会对`public/options/deps.json`中  `defaultRunDeps`进行遍历，会对所有查找到的第三方依赖库进行引用，它能够同时引入css与js，并且在只需要引入js的时候可以省略.js后缀
* 所有的组件都必须继承`BaseClass`，否则它将无法正常工作

![](https://raw.githubusercontent.com/taixw2/framework/master/images/framework.png)

### 模块关系
* 每一个模块都必须继承`BaseClass` 或者 `BaseClass`的子类
* 每个子模块都拥有父模块的方法/属性

![](https://raw.githubusercontent.com/taixw2/framework/master/images/baseClass.png)

### 目录结构
* `modules` 中存放这所有的模块，每一个模块的文件结构必须按要求存放
* `public` 中存放这一些公共文件
  * `options`中存放这配置文件，`router.json/deps.json`
* `layout`中存放着一些图片以及样式文件等等
* `extends`中存放着所有的第三方依赖项目，通过在`deps.json`中配置可以自动引入这些文件

![](https://github.com/taixw2/framework/blob/master/images/structure.png?raw=true)
