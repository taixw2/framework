# README.md
这是一套没跟上潮流的MVP框架，与其它框架相比，它缺少的功能太多了，甚至许多功能都是镶上去的，例如路由模块与模版引擎都是使用比较出名的开源项目:`director.js`和`handlebars.js`,由于近期已经很少拿它来构建新项目，所以在很大程度上它就恢复了自由之身

### 介绍
它是在我参考上家公司的两套框架之后在重新写的一套全新的框架，在很多地方都受到这两套框架的影响，并且那时候并没有接触过mvvm框架与数据双向绑定等功能，所以它会看起来很土。

### 内部构造
>它的内部由核心部分、路由、加载依赖项、模版引擎组成,并且它必须依赖jquery

* 路由模块依赖`director.js`,它的配置文件在`public/options/router.json`中，这里可以配置默认路由地址，以及加载路由时所引入的配置文件,
* 模版引擎依赖`handlebars.js`,它能使View层具备模版引擎的能力，但是必须遵循handlebars的语法
* 加载依赖处理器会对`public/options/deps.json`中  `defaultRunDeps`进行遍历，会对所有查找到的第三方依赖库进行引用，它能够同时引入css与js，并且在只需要引入js的时候可以省略.js后缀
* 核心模块的关键在`baseClass`，所有的组件都将继承这个类，并且它上面的方法全部共享到各个子组件中，

![](https://raw.githubusercontent.com/taixw2/framework/master/images/framework.png)

### 组件关系
* 每一个组件都必须继承`baseClass` 或者 `baseClass`的子集
* 每个子组件都拥有父组件的方法/属性

![](https://raw.githubusercontent.com/taixw2/framework/master/images/baseClass.png)

### 目录结构
* `modules` 中存放这所有的组件，每一个组件的文件结构必须按要求存放
* `public` 中存放这一些公共文件
  * `options`中存放这配置文件，`router.json/deps.json`
* `layout`中存放着一些图片以及样式文件等等
* `extends`中存放着所有的第三方依赖项目，通过在`deps.json`中配置可以自动引入这些文件

![](https://github.com/taixw2/framework/blob/master/images/structure.png?raw=true)


>除了我，不建议任何人把它用在开发环境中...
