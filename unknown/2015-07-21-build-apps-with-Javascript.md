---
layout: post
title: [翻译]react-native教程：使用Javascript构建app
description: react-native, app, javascript
author: FHY
---

几个月之前facebook发布了[React Native](http://facebook.github.io/react-native/), 这个框架允许你使用 JavaScript 开发原生的 iOS 应用——就在今天，Beta 版的仓库释出了！

基于 PhoneGap 使用 JavaScript 和 HTML5 开发 iOS 应用已经有好几年了，那 React Native 有什么牛的？

React Native 真的很牛，让大家兴奋异常的主要原因有两点：

1. 可以基于 React Native使用 JavaScript 编写应用逻辑，UI 则可以保持全是原生的。这样的话就没有必要就 HTML5 的 UI 做出常见的妥协；

2. React 引入了一种与众不同的、略显激进但具备高可用性的方案来构建用户界面。长话短说，应用的 UI 简单通过一个基于应用目前状态的函数来表达。

React Native 的关键就是把[React](http://facebook.github.io/react/)编程模式的能力带到移动开发来作为主要目标，它的目标不是跨平台一次编写到处执行，而是一次学习跨平台开发。这个是一个非常大的区别。这篇教程只介绍 iOS 平台，不过你一旦掌握了相关的概念，就可以应用到 Android 平台，快速构建 Android 应用。

如果之前只用过 Objective-C 或者 Swift 写应用的话，你很可能不会对使用 JavaScript 来编写应用的愿景感到兴奋。尽管如此，作为一个 Swift 开发者来说，上面提到的第二点应该可以激起你的兴趣！

你通过 Swift，毫无疑问学习到了新的更多有效的编码方法和技巧，鼓励转换和不变性。然而，构建 UI 的方式还是和使用 Objective-C 的方式一致。仍然以 UIKit 为基础，独断专横。

通过像 virtual DOM 和 reconciliation 这些有趣的概念，React 将函数式编程直接带到了 UI 层。

这篇教程将带着你一路构建一个 UK 房产搜索应用：

!(http://farmanyu.github.io/static/post/img/PropertyFinder-700x360.png)

如果你之前一点 JavaScript 都没写过，别担心。这篇教程带着你进行一步一步进行编码。React 使用 CSS 属性来定义样式，一般比较容易读也比较容易理解。但是如果你想了解更多的话，可以去看看  [Mozilla Developer Network reference](https://developer.mozilla.org/en-US/docs/Web/CSS)，很不错的。

还想学到更多吗？阅读下面的内容吧!

## 准备工作

[React Native](https://github.com/facebook/react-native) 框架托管在 GitHub 上。你可以通过两种方式获取到它：使用 git 克隆仓库，或者下载一个 zip 压缩包文件。如果你的机器上已经安装了 React Native，在着手编码前还有其他几个因素需要考虑。

React Native 借助 [Node.js](https://nodejs.org/)，即 JavaScript 运行时来创建 JavaScript 代码。如果你已经安装了 Node.js，那就可以上手了。

首先，使用 [Homebrew](http://brew.sh/) 官网提供的指引安装 Homebrew，然后在终端执行以下命令：

> brew install node

接下来，使用 homebrew 安装 [watchman](https://facebook.github.io/watchman/)，一个来自Facebook 的观察程序：

> brew install watchman

通过配置 watchman，React 实现了在代码发生变化时，完成相关的重建的功能。就像在使用 Xcode 时，每次保存文件都会进行一次创建。

接下来使用npm安装React Native的命令行工具:  

	npm install -g react-native-cli

我们使用node的包管理器安装全局命令行工具，功能上和 CocoaPods 或者 Carthage 类似。

转到指定文件夹，如果你想创建本地的应用程序，可以使用如下的命令行来构建项目：

	react-native init PropertyFinder

这将创建一个初始化的React启动项目，包含所有你需要构建和运行的应用程序的本地包依赖。

如果你看看创建好的文件和文件夹，你会发现一个node_modules文件夹，其中包含React native框架。你也会找到一个**index.ios.js**文件，这是由命令行工具创建的默认APP。最后，还有一个Xcode项目文件和一个iOS文件夹，包含少量程序代码。

打开Xcode项目文件编译并运行。模拟器将开始和显示以下信息：

!(http://farmanyu.github.io/static/post/img/ReactNative-Starter-281x500.png)

你可能还会看到一个弹出的终端界面，上面显示：

	 ===============================================================
	 |  Running packager on port 8081.       
	 |  Keep this packager running while developing on any JS         
	 |  projects. Feel free to close this tab and run your own      
	 |  packager instance if you prefer.                              
	 |                                                              
	 |     https://github.com/facebook/react-native                 
	 |                                                              
	 ===============================================================
	 
	Looking for JS files in
	   /Users/colineberhardt/Temp/TestProject
	 
	React packager ready.

这是React的包管理器，运行在node上，你会发现它运行的速度非常快。

不要关闭终端窗口，让它在后台运行。如果你发现它在报错，通过Xcode停止并重新运行该项目。

> 注意：在进入编码工作之前，还有最后一件事 —— 在这个教程中，你需要编写大量的 JavaScript 代码，Xcode 并非是最好的工具！我使用 Sublime Text，一个价格合理且应用广泛的编辑器。不过，atom，brackets 或者其他轻量的编辑器都能胜任这份工作。

## React Native 你好

在开始“搜房App”之前，先来个简单的 Hello World App 热热身。在这一节里，你将会使用到一些组件。  

下载起始项目，解压缩到react-native/Examples目录中。解压完成后，在Xcode中打开 PropertyFinder 项目，不要直接运行这个项目，还需要加上一些JS！  

在编辑器中打开 PropertyFinderApp.js，将下面这行代码加到文件的开头位置：

> 'use strict';

这行代码是用于开启 **Strict Mode**，Strict mode的错误处理可以有所提高，JavaScript的一些语言缺陷也可以避免。简而言之就是，JavaScript在这种模式下工作地更好！

注意：想要研究一下 Strict Mode 的朋友，我会推荐你阅读 [Jon Resig 的文章](http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/):“ECMAScript 5 Strict Mode, JSON, and More”  

然后，加上这一行：

> var React = require('react-native');

这句代码是将 react-native 模块加载进来，并将它赋值给变量 React 的。React Native 使用同 Node.js 相同的模块加载方式：require，这个概念可以等同于 Swift 中的“链接库”或者“导入库”。  

> 注意：想要了解更多关于 JavaScript 模块的知识，我推荐阅读 [Addy Osmani](http://addyosmani.com/writing-modular-js/) 写的这篇文章。

在 require 语句的下面，加上这一段：

	var styles = React.StyleSheet.create({
		text: {
			color: 'black',
			backgroundColor: 'white',
			fontSize: 30,
			margin: 80
		}
	});

以上代码定义了一段应用在 “Hello World” 文本上的样式。如果你曾接触过Web开发，那你很可能已经发现了：React Native 使用的是 [CSS](http://www.w3schools.com/css/) 来定义应用界面的样式。

现在我们来关注应用本身吧！依然是在相同的文件下，将以下代码添加到样式代码的下面：

	class PropertyFinderApp extends React.Component {
		render() {
			return React.createElement(React.Text, {style: styles.text}, "Hello World!");
		}
	}

是的，这就是 JavaScript的class！

类 (class) 是在ES6中被引入的，纵然JavaScript一直在进步，但Web开发者受困于兼容浏览器的状况中，不能怎么使用JS的新特性。React Native运行在JavaScriptCore中是，也就是说，你可以使用JS的新特性啦，完全不用担心兼容什么的呢。  

> 注意：如果你是一名 Web 开发者，我百分百鼓励你要使用现代的JavaScript，然后使用像 [Babel](https://babeljs.io/) 这样的工具生成兼容性的 JavaScript，用于支持兼容性不好的老浏览器。

**PropertyFinderApp** 继承了 **React.Component**（React UI的基础模块）。组件包含着不可变的属性，可变的状态变量以及暴露给渲染用的方法。这会你做的应用比较简单，只用一个渲染方法就可以啦。  

React Native 组件并不是 UIKit 类，它们只能说是在某种程度上等同。框架只是将 React 组件树转化成为原生的UI。  

最后一步啦，将这一行加在文件末尾：

	React.AppRegistry.registerComponent('PropertyFinderApp', function() { return PropertyFinderApp });

**AppRegistry** 定义了App的入口，并提供了根组件。  

保存 **index.ios.js**，回到Xcode中。确保 **PropertyFinder** 规划（scheme）已经勾选了，并设置了相应的 iPhone 模拟器，然后生成并运行你的项目。几秒之后，你应该就可以看到 “Hello World” 应用正在运行了： 

!(http://farmanyu.github.io/static/post/img/react-helloworld-281x500.png)

这个JavaScript应用运行在模拟器上，使用的是原生UI，没有任何内嵌的浏览器哦！

还不相信这是真的？:] 那打开你的 Xcode，选择 **Debug\View Debugging\Capture View Hierarchy**，你看 native view hierarchy 中都没有 **UIWebView**，就只有一个原生的view！:]  

!(http://farmanyu.github.io/static/post/img/ViewDebugging-480x227.png)

你一定很好奇其中的原理吧，那就在 Xcode 中打开 **AppDelegate.m**，接着找到 *application:didFinishLaunchingWithOptions*：这个方法构建了 **RCTRootView** 用于加载 JavaScript 应用以及渲染最后的视图的。

当应用开始运行的时候，**RCTRootView** 将会从以下的URL中加载应用：  

> http://localhost:8081/Examples/PropertyFinder/PropertyFinderApp.includeRequire.runModule.bundle

重新调用了你在运行这个App时打开的终端窗口，它开启了一个 packager 和 server 来处理上面的请求。  

在 Safari 中打开那个 URL；你将会看到这个 App 的 JavaScript 代码。你也可以在 React Native 框架中找到你的 “Hello World” 代码。  

当你的App开始运行了以后，这段代码将会被加载进来，然后 JavaScriptCore 框架将会执行它。在 Hello World 的例子里，它将会加载 **PropertyFinderApp** 组件，然后构建出原生的 UIKit 视图。关于这部分的内容，后文里会再详细解释的。

## 你好 JSX 的世界

你当前的应用程序会使用 **React.createElement** 来构建应用 UI ,React会将其转换到原生环境中。在当前情况下，你的JavaScript代码是完全可读的,但一个更复杂的 UI 与嵌套的元素将迅速使代码变成一大坨。  

确保应用程序仍在运行,然后回到你的文本编辑器中，编辑 **index.ios.js** 。修改组件 render 方法的返回语句如下:  

	return <React.Text style={styles.text}>Hello World (Again)</React.Text>;

这是 [JSX](http://facebook.github.io/react/docs/jsx-in-depth.html) ，或 JavaScript 语法扩展,它直接在你的 JavaScript 代码中混合了类似 HTML 的语法;如果你是一个 web 开发人员,应该对此不陌生。在本篇文章中你将一直使用 JSX 。  

把你的改动保存到 **index.ios.js** 中，并返回到模拟器。按下 *Cmd + R* ,你将看到你的应用程序刷新,并显示更新的消息 “Hello World(again)”。   

重新运行一个 React Native 应用程序像刷新 web 浏览器一样简单!:]  

因为你会使用相同的一系列 JavaScript 文件,您可以让应用程序一直运行,只在更改和保存 **index.ios.js**  后刷新即可.

> 注意:如果你感到好奇,可以看看你的“包”在浏览器中，JSX被转换成什么。

这个 “Hello World” 已经够大家玩耍了,是时候构建实际的应用程序了!  

## 添加导航

我们的房产查找应用使用标准的栈式导航，基于 UIKit 的 navigation controller。现在正是添加的时候。  

在 **index.ios.js** 文件中，把 PropertyFinderApp 重命名为HelloWorld：

	class HelloWorld extends React.Component {

“Hello World” 这几个字你还需要让它显示一会儿，但它不再是应用的根组件了。

接下来，在 **HelloWorld** 这个组件下面添加如下这个类：  

	class PropertyFinderApp extends React.Component {
	  render() {
	    return (
	      <React.NavigatorIOS
	        style={styles.container}
	        initialRoute={{
	          title: 'Property Finder',
	          component: HelloWorld,
	        }}/>
	    );
	  }
	}

构造一个 navigation controller，应用一个样式，并把初始路由设为 Hello World 组件。在 Web 开发中，路由就是一种定义应用导航的一种技术，即定义页面——或者说是路由——与 URL 的对应关系。  

在同一个文件中，更新样式定义，包含如下 container 的样式：  

	var styles = React.StyleSheet.create({
	  text: {
	    color: 'black',
	    backgroundColor: 'white',
	    fontSize: 30,
	    margin: 80
	  },
	  container: {
	    flex: 1
	  }
	});

在随后的教程中会告诉你 flex: 1 是什么意思。  

回到模拟器，*Cmd+R*，看看新 UI 的样子：

!(http://farmanyu.github.io/static/post/img/react-helloworldagain-281x500.png)

这就是包含了 root view 的 navigation controller，目前 root view 就是 “Hello World”。很棒——应用已经有了基础的导航结构，到添加真实 UI 的时候了。  

## 创建搜索页

在项目中添加一个新文件，命名为 **SearchPage.js**，然后将其放在index.ios.js 所在目录下。在文件中添加下面代码：  

	'use strict';
 
	var React = require('react-native');
	var {
	  StyleSheet,
	  Text,
	  TextInput,
	  View,
	  TouchableHighlight,
	  ActivityIndicatorIOS,
	  Image,
	  Component
	} = React;

你会注意到，位于引入 react-native 所在位置的前面有一个严格模式标识，紧接着的声明语句是新知识。

这是一种解构赋值，准许你获取对象的多个属性并且使用一条语句将它们赋给多个变量。结果是，后面的代码中可以省略掉 React 前缀；比如，你可以直接引用 StyleSheet ，而不再需要 React.StyleSheet。解构同样适用于操作数组，更多细节请戳[这里](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)。  

继续在 SearchPage.js 文件中添加下面的样式： 

	var styles = StyleSheet.create({
	  description: {
	    marginBottom: 20,
	    fontSize: 18,
	    textAlign: 'center',
	    color: '#656565'
	  },
	  container: {
	    padding: 30,
	    marginTop: 65,
	    alignItems: 'center'
	  }
	});

同样，以上都是标准的 CSS 属性。和 Interface Builder 相比，这样设置样式缺少了可视化，但是比起在 *viewDidLoad()* 中逐个设置视图属性的做法更友好！

只需要把组件添加到样式声明的前面：  

	class SearchPage extends Component {
	  render() {
	    return (
	      <View style={styles.container}>
	        <Text style={styles.description}>
	          Search for houses to buy!
	        </Text>
	        <Text style={styles.description}>
	          Search by place-name, postcode or search near your location.
	        </Text>
	      </View>
	    );
	  }
	}

render 很好地展示出 JSX 以及它表示的结构。通过这个样式，你可以轻易地描绘出组件 UI 的结构：一个容器，包含两个 text 标签。  

最后，将下面的代码添加到文件末尾：

	module.exports = SearchPage;

这可以 export SearchPage 类，方便在其他文件中使用它。

下一步是更新应用的路由，以初始化路由。

打开 index.ios.js，在文件顶部紧接着上一个 require 语句的位置添加下面代码：  

	var SearchPage = require('./SearchPage');

在 PropertyFinderApp 类的 render 函数内部，通过更新 initialRoute 来引用最新添加的页面，如下：

	component: SearchPage

此时，如果你愿意则可以移除 *HelloWorld* 类以及与它相关联的样式。你不在需要那段代码了。  

切换到模拟器，按下 *Cmd+R* 查看新的 UI：  

!(http://farmanyu.github.io/static/post/img/react-searchstarter-281x500.png)

使用 Flexbox 定义外观  

现在，你已经看到了用基本的 CSS 属性来控制外间距（margin），内间距（padding）还有颜色（color）。不过，可能你还不太了解要如何使用伸缩盒（flexbox），flexbox 是最近新加入 CSS 规范，用它就能很便利地布局界面。  

React Native 用 [css-layout](https://github.com/facebook/css-layout)（这是一个用 JavaScript 实现flexbox标准然后编译成 C（iOS平台）或者Java（Android平台）的库)。  
Facebook把这个项目单独出来实在太正确了，这样可以编译成多种语言，促进更多新颖的应用的发展，比如[flexbox layout to SVG](http://blog.scottlogic.com/2015/02/02/svg-layout-flexbox.html)。  

在你的App中，容器（container）默认地是纵向布局，也就是说在它的子元素将会竖直地排列，像这样：  

这被称为主轴 (main axis)，它的方向可以是竖直的也可以是水平的。
每一个子元素在竖直方向上的位置是由它的margin，height和padding共同决定的。容器的 alignItems 属性也要设置成 center，这个属性可以控制子元素在十字轴上的位置。在这里，它实现了居中对齐的文本。  

好啦，现在我们把输入框和按钮加上去吧。打开 **SearchPage.js**，将下面的代码插入第二个 Text 元素的后面：  

	<View style={styles.flowRight}>
	  <TextInput
	    style={styles.searchInput}
	    placeholder='Search via name or postcode'/>
	  <TouchableHighlight style={styles.button}
	      underlayColor='#99d9f4'>
	    <Text style={styles.buttonText}>Go</Text>
	  </TouchableHighlight>
	</View>
	<TouchableHighlight style={styles.button}
	    underlayColor='#99d9f4'>
	  <Text style={styles.buttonText}>Location</Text>
	</TouchableHighlight>

现在你已经加上了两个最高等级的视图（top-level view），一个视图包含了文本输入框和一个按钮，还有一个视图内只有一个按钮。在后文中你会看到，它们的样式是什么样的。  

接着，添加上对应的样式：  

	flowRight: {
	  flexDirection: 'row',
	  alignItems: 'center',
	  alignSelf: 'stretch'
	},
	buttonText: {
	  fontSize: 18,
	  color: 'white',
	  alignSelf: 'center'
	},
	button: {
	  height: 36,
	  flex: 1,
	  flexDirection: 'row',
	  backgroundColor: '#48BBEC',
	  borderColor: '#48BBEC',
	  borderWidth: 1,
	  borderRadius: 8,
	  marginBottom: 10,
	  alignSelf: 'stretch',
	  justifyContent: 'center'
	},
	searchInput: {
	  height: 36,
	  padding: 4,
	  marginRight: 5,
	  flex: 4,
	  fontSize: 18,
	  borderWidth: 1,
	  borderColor: '#48BBEC',
	  borderRadius: 8,
	  color: '#48BBEC'
	}

要注意格式问题：每一个样式都是用逗号分隔开的，所以别忘了在container 选择器后面还要加上一个逗号。  

以上的样式将会应用在你刚刚加上的输入框和按钮上。  

现在返回到模拟器，然后按下 *Cmd+R* 刷新界面：  

!(http://farmanyu.github.io/static/post/img/FlexStack.png)

文本区域和 ’Go’ 按钮在同一行，不需要显式地定义两个组件的宽度，你只需要将它们放在同一个容器中，加上 *flexDirection:'row'* 样式，再定义好它们的 flex 值。文本区域是 *flex:4*，按钮则是 *flex:1*，这说明两者的宽度比是4:1。
大概你也发现了，你的“按钮”其实并不是按钮！:] 使用了 UIKit 后，按钮更倾向于是可以轻碰（tap）的标签（label），所以 React Native 团队决定直接在 JavaScript 中构建按钮了。所以你在 App 中使用的按钮是 TouchableHighlight，这是一个 React Native 组件，当轻碰 TouchableHighlight 时，它会变得透明从而显示出衬底的颜色（也就是按钮下层的组件颜色）。   

搜索界面的最后一步就是加上一张图片.你可以从[这里下载](http://cdn2.raywenderlich.com/wp-content/uploads/2015/03/ReactNative-HouseImage.zip)我们用的图片素材并解压。  

在Xcode中打开**Images.xcassets**文件，点击加号添加一个新的图片集。然后将图片素材拖进正确的“区间”：  

你需要重启应用才能让图片生效。  

将以下代码添加到 TouchableHighlight 组件后面，它将用于“获取位置”按钮：  

	<Image source={require('image!house')} style={styles.image}/>

现在再样式表的最后加上图片对应的样式，别忘了给原样式中最后一个加上逗号哦：

	image: {
	  width: 217,
	  height: 138
	}

require('image!house') 语句用于确定在你应用的asset目录下的图片资源，在 Xcode 中，如果你的打开了 Images.xcassets，你会看到一个“房屋”的图标，正是上面代码中引用到的。

返回到模拟器，*Cmd+R* 刷新UI： 

!(http://farmanyu.github.io/static/post/img/react-searchpagehouse-281x500.png)

> 注意：如果你这会没有看到“房屋”图片，取而代之的是一张“找不到资源”的图片，尝试重启packager（也就是在终端里输入 npm start 命令）。

现在你的应用看起来挺不错的啦，不过它还少了点功能。接下来你的任务就是给它加上点状态，让它执行一些操作。

## 增加组件状态
每个React组件都有它自己的状态对象，它被用作一个键值存储。在组件被渲染之前，必须设置初始状态。

将以下代码添加到SearchPage.js中，放在render()方法前面  

	constructor(props) {
  		super(props);
  		this.state = {
    		searchString: 'london'
  		};
	}

你的组件现在有一个状态变量，默认将伦敦设置为初始值。  

在初始化渲染的时候，将searchString的值赋给TextInput:

	<TextInput
  	style={styles.searchInput}
  	value={this.state.searchString}
  	placeholder='Search via name or postcode'/>
  	
这里只是设置TextInput的属性，展示出来，TextInput的当前的值正是searchString这个状态变量，这只是初始状态，当用户编辑该该值的时候会发生什么呢？

第一步是创建一个事件处理的方法。在searchpage类中添加如下方法：

	onSearchTextChanged(event) {
  		console.log('onSearchTextChanged');
  		this.setState({ searchString: event.nativeEvent.text });
  		console.log(this.state.searchString);
	}

方法从事件的文本属性中获得它的值，并用它来更新组件的状态值。还增加了一些记录代码，帮助观察状态变化。

监听TextInput的值变化，在TextInput的内容修改时调用这个方法，代码修改如下:

	<TextInput
  		style={styles.searchInput}
  		value={this.state.searchString}
  		onChange={this.onSearchTextChanged.bind(this)}
  		placeholder='Search via name or postcode'/>

当用户修改内容时，会调用onChange方法，在这里，会触发onSearchTextChanged方法。

> 你可能会想知道bind（this）的含义。这个关键词是JavaScript不同于其他语言的地方；如Swift中的是self。这里是确保onSearchTextChanged方法可以访问组件实例。如果想要了解更多信息，请前往[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)。

在你再次刷新之前，还需要添加一句记录语句，代码添加在render()方法前：

	console.log('SearchPage.render');

你将在日志中了解到一些有趣的事情 :]。

返回你的模拟器，然后按*CMD + R*。你现在应该看到，TextInput初始值为“伦敦”，Xcode控制台记录了打印的语句：

!(http://farmanyu.github.io/static/post/img/react-renderconsole.png)

看看上面的截图，记录的语句的打印顺序似乎有点奇怪。

1. view的**render()**方法开始记录。
2. 当文本变化的时候，调用 onSearchTextChanged() 。
3. 然后，输入文本触发组件的状态更新，又触发另一个渲染。
4. onSearchTextChanged()更新组件状态，记录新的searchString。

每当app中任何React组件状态更新，都会触发一个完整的用户界面重新渲染，在所有的组件调用渲染。这是一个非常好的想法，渲染逻辑从状态变化，直接影响用户界面。

很多其他的UI框架，程序逻辑状态变化了，需要手动更新UI，或者使用某种绑定框架，该框架在应用程序和他的UI界面之间创建一个隐式链接；例如，看我之前写的[ReactiveCocoa MVVM模式](http://www.raywenderlich.com/74106/mvvm-tutorial-with-reactivecocoa-part-1).

对于React，你就不必担心UI哪个部分受什么状态影响; 整个UI界面可以简单看成你应用程序的状态.

在这点上，你可能发现了这个概念可能存在的缺陷，正是性能。

当然你可能以为会没发生一次变化，都会重新重绘整个用户UI界面。其实这正是React的聪明之处，每次UI的呈现，都会以树视图的渲染方法返回，获得与当前UI有差异的UI列表，React需要更新视图的时候，意味着只有那些真正改变的东西才会被重新绘制。

你还想ReactJS这些独特的概念，virtual-DOM(文档对象模型，一个web文档的可视化树)和reconciliation 是怎么运行在ios app中。

你可以把这些抛在脑后，你还有一些事情要做，删掉刚才添加的日志代码，因为他们不是必要的，只会让别人更困惑。

## 开始搜索功能

为了实现搜索功能，需要处理“GO”按钮，创建一个合适的接口请求，并向用户提供一个可视化界面，告诉用户查询正在进行中。

在 **SearchPage.js**中，更新构造函数的初始状态:

	this.state = {
	  searchString: 'london',
	  isLoading: false
	};

新的isLoading属性表示查询是否正在进行。  

在渲染的开始时添加以下逻辑：

	var spinner = this.state.isLoading ?
	  ( <ActivityIndicatorIOS
	      hidden='true'
	      size='large'/> ) :
	  ( <View/>);

这是一个三元表达式，根据isLoading的值，自由选择JSX和JavaScript的逻辑。  

在JSX的返回中定义搜索界面，添加下面的图片

	{spinner}

现在添加TouchableHighlight内“GO”按钮的文本属性：

	onPress={this.onSearchPressed.bind(this)}

接下来，为Search类添加如下方法：

	_executeQuery(query) {
	  console.log(query);
	  this.setState({ isLoading: true });
	}
	 
	onSearchPressed() {
	  var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
	  this._executeQuery(query);
	}

_executeQuery方法最终将运行查询调用，现在只是记录一条日志在控制台，设置新的isLoading的值，可以更新UI状态。

> JavaScript类没有访问修饰符，所以他们没有“私有”的概念。因此你经常会看到开发者使用 前缀为下划线表示的 变量，他们认为这样是私有的。

在你点击“GO”按钮的时候，会调用onSearchPressed方法。  

最后，我们在SearchPage类上添加下面的函数声明：

	function urlForQueryAndPage(key, value, pageNumber) {
	  var data = {
	      country: 'uk',
	      pretty: '1',
	      encoding: 'json',
	      listing_type: 'buy',
	      action: 'search_listings',
	      page: pageNumber
	  };
	  data[key] = value;
	 
	  var querystring = Object.keys(data)
	    .map(key => key + '=' + encodeURIComponent(data[key]))
	    .join('&');
	 
	  return 'http://api.nestoria.co.uk/api?' + querystring;
	};

这个函数不依赖于**SearchPage**类，它是一个自由的函数，而不是类的一个方法。该函数根据数据的参数拼接查询字符串。之后，它将数据转换成所需要的字符串格式，拼接成**name=value**键值对的字符串。=>语法是为了JavaScript创建匿名函数提供的一个简洁的语法。  

回到模拟器，按**CMD + R**来重新加载应用程序，点击“Go”按钮。你会看到活动指示器开始旋转；在Xcode控制台会打印一些东西：

!(http://farmanyu.github.io/static/post/img/SearchAcitivityIndicator-700x169.png)

日志中出现活动指示的呈现和所需查询的网址。复制粘贴到浏览器的网址看结果。你会看到一个巨大的JSON对象。不要担心-你不需要理解！现在来添加解析代码。  

> 这个应用程序使用[nestoria搜索房源信息的API](http://www.nestoria.co.uk/help/api)。API响应回来的JSON非常简单，你可以在文档中寻找到所有的细节，以及预期的URL请求和响应格式。

下一步是在你的应用程序中发出请求。

## 实现一个API请求

在**SearchPage.js**中，更新的初始状态，在类的构造函数中添加*message*变量：

	this.state = {
	  searchString: 'london',
	  isLoading: false,
	  message: ''
	};

渲染需要添加下面的用户UI：

	<Text style={styles.description}>{this.state.message}</Text>

用这个Text来向用户显示一系列的消息。

在**SearchPage**类中，将下面的代码添加到最后的方法_executeQuery()中：

	fetch(query)
	  .then(response => response.json())
	  .then(json => this._handleResponse(json.response))
	  .catch(error => 
	     this.setState({
	      isLoading: false,
	      message: 'Something bad happened ' + error
	   }));

这里使用了fetch函数，这是[Web组件的API](https://fetch.spec.whatwg.org/)，是基于XMLHttpRequest的改进的API。异步响应基于[promise](http://www.html5rocks.com/en/tutorials/es6/promises/)实现，解析JSON后调用会调用回调.  

最后是在**SearchPage**类添加以下函数

	_handleResponse(response) {
	  this.setState({ isLoading: false , message: '' });
	  if (response.application_response_code.substr(0, 1) === '1') {
	    console.log('Properties found: ' + response.listings.length);
	  } else {
	    this.setState({ message: 'Location not recognized; please try again.'});
	  }
	}

如果查询成功了，将清除加载和日志。

> Nestoria返回有一些[状态代码](http://www.nestoria.co.uk/help/api-return-codes)是有用的。例如，202和200返回一个最可能的位置列表。当你完成了应用程序，可以尝试处理向用户呈现一个选项列表。

保存您的代码，然后在模拟器按**CMD + R**，尝试寻找“london”；你会看到一个消息说20条结果的列表。输入一个不存在的位置，如“narnia”，然后你会看到以下信息：

!(http://farmanyu.github.io/static/post/img/react-narnia.png)

是时候去看看输入像“london”返回的20个结果是什么了。

## 列表展示
创建一个新文件**SearchResults.js**，添加如下代码：

	'use strict';
 
	var React = require('react-native');
	var {
	  StyleSheet,
	  Image, 
	  View,
	  TouchableHighlight,
	  ListView,
	  Text,
	  Component
	} = React;

没错，这是一个文件模块声明，包括react-native模块，和React的需要的依赖。你一直都在看吗？:]

下一步添加组件本身代码：  

	class SearchResults extends Component {
 
	  constructor(props) {
	    super(props);
	    var dataSource = new ListView.DataSource(
	      {rowHasChanged: (r1, r2) => r1.guid !== r2.guid});
	    this.state = {
	      dataSource: dataSource.cloneWithRows(this.props.listings)
	    };
	  }
	 
	  renderRow(rowData, sectionID, rowID) {
	    return (
	      <TouchableHighlight
	          underlayColor='#dddddd'>
	        <View>
	          <Text>{rowData.title}</Text>
	        </View>
	      </TouchableHighlight>
	    );
	  }
	 
	  render() {
	    return (
	      <ListView
	        dataSource={this.state.dataSource}
	        renderRow={this.renderRow.bind(this)}/>
	    );
	  }
	 
	}

上面的代码使用了一个更专业的组件**ListView**，用于展示滚动容器的数据，类似**UITableView**。数据视图通过**Listview.dataSource**控制展示UI。

在构建数据源时，提供了一个函数，该函数将逐一对每行的标识进行比较。而**ListView**的视图随着数据的变化而变化。在这种情况下，利用Nestoria API返回的GUID属性，检查返回的结果是否发生变化。

现在在文件的结尾添加模块导出：

	module.exports = SearchResults;

将以下内容添加到**SearchResults.js**中顶部：

	var SearchResults = require('./SearchResults');

这样就代表我们可以在**SearchPage**类中使用**SearchResults**类.  
用下面的语句替换**_handleresponse**中**console.log**方法：

	this.props.navigator.push({
	  title: 'Results',
	  component: SearchResults,
	  passProps: {listings: response.listings}
	});

上面的代码是通过搜索结果列表的API请求，在导航中添加新的组件。使用**push**方法确保搜索结果被推到导航堆栈上，意味着你可以使用“Back”按钮返回到“root视图”。

回到模拟器，按**CMD + R**并且发起快速搜索。你会得到以下的结果列表：

!(http://farmanyu.github.io/static/post/img/react-searchresults1-281x500.png)

很高兴可以看到房地产列表，只是界面有点单调。是时候让他更有趣一些了。

## 触摸样式
这个React Native的代码现在应该是看起来很熟悉了，所以这个教程将要加快速度。

在**SearchResults.js**添加以下样式定义：

	var styles = StyleSheet.create({
	  thumb: {
	    width: 80,
	    height: 80,
	    marginRight: 10
	  },
	  textContainer: {
	    flex: 1
	  },
	  separator: {
	    height: 1,
	    backgroundColor: '#dddddd'
	  },
	  price: {
	    fontSize: 25,
	    fontWeight: 'bold',
	    color: '#48BBEC'
	  },
	  title: {
	    fontSize: 20,
	    color: '#656565'
	  },
	  rowContainer: {
	    flexDirection: 'row',
	    padding: 10
	  }
	});

这里定义了你将要渲染的每一行的样式。

替换**renderRow()**方法实现:

	renderRow(rowData, sectionID, rowID) {
	  var price = rowData.price_formatted.split(' ')[0];
	 
	  return (
	    <TouchableHighlight onPress={() => this.rowPressed(rowData.guid)}
	        underlayColor='#dddddd'>
	      <View>
	        <View style={styles.rowContainer}>
	          <Image style={styles.thumb} source={{ uri: rowData.img_url }} />
	          <View  style={styles.textContainer}>
	            <Text style={styles.price}>£{price}</Text>
	            <Text style={styles.title} 
	                  numberOfLines={1}>{rowData.title}</Text>
	          </View>
	        </View>
	        <View style={styles.separator}/>
	      </View>
	    </TouchableHighlight>
	  );
	}

将接口返回的价格字段“300,000 GBP”，除去GBP后缀。然后使用技巧渲染用户界面。在主线程外，渲染接口提供的缩略图的地址。

同时，注意**TouchableHighlight**的**onPress**方法；每次点击都会传入该行的GUID。

最后一步是将此方法添加到类中：

	rowPressed(propertyGuid) {
	  var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];
	}  

此方法用于来确认用户点击位置。它目前还没有任何实现，之后会很快修复这个问题。现在，花点时间来欣赏你的杰作。

返回模拟器，按下**Cmd+R**并到达你的列表页:

!(http://farmanyu.github.io/static/post/img/react-searchresults2-281x500.png)

看起来很好--住在伦敦真不是一般人能负担的起！

现在应该添加应用程序的最后一个视图了。

## 详细页面展示

添加一个新的文件**PropertyView.js**到项目中来，然后在文件的顶部添加如下代码：

	'use strict';
 
	var React = require('react-native');
	var {
	  StyleSheet,
	  Image, 
	  View,
	  Text,
	  Component
	} = React;

当然，现在你可以在闭着眼睛做这件事了！:]

接下来新增一些样式：

	var styles = StyleSheet.create({
	  container: {
	    marginTop: 65
	  },
	  heading: {
	    backgroundColor: '#F8F8F8',
	  },
	  separator: {
	    height: 1,
	    backgroundColor: '#DDDDDD'
	  },
	  image: {
	    width: 400,
	    height: 300
	  },
	  price: {
	    fontSize: 25,
	    fontWeight: 'bold',
	    margin: 5,
	    color: '#48BBEC'
	  },
	  title: {
	    fontSize: 20,
	    margin: 5,
	    color: '#656565'
	  },
	  description: {
	    fontSize: 18,
	    margin: 5,
	    color: '#656565'
	  }
	});

添加组件代码：

	class PropertyView extends Component {
 
	  render() {
	    var property = this.props.property;
	    var stats = property.bedroom_number + ' bed ' + property.property_type;
	    if (property.bathroom_number) {
	      stats += ', ' + property.bathroom_number + ' ' + (property.bathroom_number > 1
	        ? 'bathrooms' : 'bathroom');
	    }
	 
	    var price = property.price_formatted.split(' ')[0];
	 
	    return (
	      <View style={styles.container}>
	        <Image style={styles.image} 
	            source={{uri: property.img_url}} />
	        <View style={styles.heading}>
	          <Text style={styles.price}>£{price}</Text>
	          <Text style={styles.title}>{property.title}</Text>
	          <View style={styles.separator}/>
	        </View>
	        <Text style={styles.description}>{stats}</Text>
	        <Text style={styles.description}>{property.summary}</Text>
	      </View>
	    );
	  }
	}

首页在渲染前，对数据执行一些操作。通常情况下，由API返回的数据是混合在一起的，往往有缺失的值。这里的代码会使数据更规范。

接下来的渲染是非常简单的，一个简单的函数实现，这个组件没有变化的状态。

在文件结尾将模块导出：

	module.exports = PropertyView;

接下来更新**rowPressed()**方法，在导航器中添加**PropertyView**：

	rowPressed(propertyGuid) {
	  var property = this.props.listings.filter(prop => prop.guid === propertyGuid)[0];
	 
	  this.props.navigator.push({
	    title: "Property",
	    component: PropertyView,
	    passProps: {property: property}
	  });
	}

你知道怎么测试：回到模拟器，按**CMD+R**，运行模拟器，搜索列表，点击一个物业，进入物业详情：

!(http://farmanyu.github.io/static/post/img/react-property-281x500.png)

生活中可以负担的起最好的住所 - 这是一个非常华丽的寻租物业平台！  

你的应用程序几乎已经完成了，最后一步是让用户搜索附近的物业。

## 定位搜索

在Xcode中，打开**Info.plist**，添加新的键值，使用鼠标右键单击并选择添加,并进行行内编辑。使用*NSLocationWhenInUseUsageDescription*作为key值，并可以看到下列值：

	PropertyFinder would like to use your location to find nearby properties

在这里，你将看到plist文件已经添加了新的key：

!(http://farmanyu.github.io/static/post/img/Screen-Shot-2015-03-20-at-21.49.06-480x162.png)

这个key的功能是app会给用户的提示，请求访问他们的当前位置。

打开**SearchPage.js**，定位在**TouchableHighlight**中“Localtion”按钮上，添加以下属性值：

	onPress={this.onLocationPressed.bind(this)}

当你按下这个按钮，就会调用**onLocationPressed**方法，接下来需要你添加这个方法。

添加下面的代码到**SearchPage**类中：

	onLocationPressed() {
	  navigator.geolocation.getCurrentPosition(
	    location => {
	      var search = location.coords.latitude + ',' + location.coords.longitude;
	      this.setState({ searchString: search });
	      var query = urlForQueryAndPage('centre_point', search, 1);
	      this._executeQuery(query);
	    },
	    error => {
	      this.setState({
	        message: 'There was a problem with obtaining your location: ' + error
	      });
	    });
	}

当前位置将通过navigator.geolocation来定位；这是一个Web API的接口，任何人在浏览器中使用了定位服务都应该熟悉这个API。React Native框架实现并提供这个API，使用的是原生的iOS定位服务。

如果成功获得当前位置，会调用location方法，搜索当前位置。如果出错了，会显示一个基本的错误信息。

既然你已经改变了的**plist**，就需要重新启动应用程序看到你的变化。停止在Xcode应用程序，并编译和运行你的项目在，这次没法使用**Cmd+R**了。

在你使用了基于位置的搜索，你需要指定一个Nestoria返回位置。模拟器菜单，选择Debug\Location\Custom Location。输入纬度55.02和经度1.42的坐标，一个相当不错的海边小镇，在英格兰北部。

!(http://farmanyu.github.io/static/post/img/WhitleyBaySearch-647x500.png)

> 注意：有些人无法基于位置搜索（访问会提示报告拒绝访问错误）–我们现在不确定是为什么，也许是React Native的一个问题？如果任何人有同样的问题出现，请告诉我们。

生活在伦敦并不辛苦，但却有很大的负担！:]

## 接下来去哪里

祝贺你的第一个React Native 应用完成了，你可以在[GitHub](https://github.com/ColinEberhardt/ReactNative-PropertyFinder)找到完整的项目，当你不知道怎么做的时候:]，本教程针对每一步的练习非常有用。

如果你做过web开发，你可以看到它是多么容易通过JavaScript定义你的界面和导航，从而得到一个完整的原生界面。如果你的工作主要是在Native app的开发，我希望对有React Native有个好的认识：可以使用JavaScript和CSS样式规则，快速迭代开发app。

也许你可以使用React Native框架开发下一个应用程序？又或者，也许你会坚持Swift或者Objective-C？不管你走哪条路，我都希望你在这篇文章里学到了一些新的、有趣的东西，并且能把一些原理带进你的下一个项目中去。

如果您对本教程有任何疑问或评论，可以自由地参加以下的讨论！

原文地址: <http://www.raywenderlich.com/99473/introducing-react-native-building-apps-javascript>


