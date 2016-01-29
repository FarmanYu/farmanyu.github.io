---
title: 'jsdoc使用说明文档'
date: 2014-12-16 00:00:00
tags: [tools]
---

JsDoc Toolkit 是一个把js描述格式化成文档的工具。开发者只需按JsDoc的规范写好注释就可以很方便导出文档。它是google 推荐的 JsDoc生成工具。 基于java的注释规则来生成文档。后来有人开发出来了nodejs版本。  

### 注释规范
完整规范参考地址:<http://usejsdoc.org/>  

``` javascript
	/***
		@abstract (synonyms: @virtual)
		This member must be implemented (or overridden) by the inheritor.
		@access
		Specify the access level of this member (private, public, or protected).
		@alias
		Treat a member as if it had a different name.
		@augments (synonyms: @extends)
		This object adds onto a parent object.
		@author
		Identify the author of an item.
		@borrows
		This object uses something from another object.
		@callback
		Document a callback function.
		@class (synonyms: @constructor)
		This function is intended to be called with the "new" keyword.
		@classdesc
		Use the following text to describe the entire class.
		@constant (synonyms: @const)
		Document an object as a constant.
		@constructs
		This function member will be the constructor for the previous class.
		@copyright
		Document some copyright information.
		@default (synonyms: @defaultvalue)
		Document the default value.
		@deprecated
		Document that this is no longer the preferred way.
		@description (synonyms: @desc)
		Describe a symbol.
		@enum
		Document a collection of related properties.
		@event
		Document an event.
		@example
		Provide an example of how to use a documented item.
		@exports
		Identify the member that is exported by a JavaScript module.
		@external (synonyms: @host)
		Document an external class/namespace/module.
		@file (synonyms: @fileoverview, @overview)
		Describe a file.
		@fires (synonyms: @emits)
		Describe the events this method may fire.
		@function (synonyms: @func, @method)
		Describe a function or method.
		@global
		Document a global object.
		@ignore
		Omit a symbol from the documentation.
		@inner
		Document an inner object.
		@instance
		Document an instance member.
		@kind
		What kind of symbol is this?
		@lends
		Document properties on an object literal as if they belonged to a symbol with a given name.
		@license
		Identify the license that applies to this code.
		@link
		Inline tag - create a link.
		@member (synonyms: @var)
		Document a member.
		@memberof
		This symbol belongs to a parent symbol.
		@mixes
		This object mixes in all the members from another object.
		@mixin
		Document a mixin object.
		@module
		Document a JavaScript module.
		@name
		Document the name of an object.
		@namespace
		Document a namespace object.
		@param (synonyms: @arg, @argument)
		Document the parameter to a function.
		@private
		This symbol is meant to be private.
		@property (synonyms: @prop)
		Document a property of an object.
		@protected
		This member is meant to be protected.
		@public
		This symbol is meant to be public.
		@readonly
		This symbol is meant to be read-only.
		@requires
		This file requires a JavaScript module.
		@returns (synonyms: @return)
		Document the return value of a function.
		@see
		Refer to some other documentation for more information.
		@since
		When was this feature added?
		@static
		Document a static member.
		@summary
		A shorter version of the full description.
		@this
		What does the 'this' keyword refer to here?
		@throws (synonyms: @exception)
		Describe what errors could be thrown.
		@todo
		Document tasks to be completed.
		@tutorial
		Insert a link to an included tutorial file.
		@type
		Document the type of an object.
		@typedef
		Document a custom type.
		@variation
		Distinguish different objects with the same name.
		@version
		Documents the version number of an item.	 
	 **/
```

### 示例js

``` javascript
	//示例一
	/** 
	 * @namespace 简单的方法标注示例 
	 * @author <llying@javaeye.com>
	 * @version 0.1 
	 */ 
	
	/** 
	 * @description 加法运算 
	 * @param {number} num1 加数 
	 * @param {number} num2 被加数 
	 * @return {number} result 结果 
	 */ 
	function add(num1,num2){ 
		return num1 + num2; 
	} 

	/** 
	 * @description 减法运算 
	 * @param {Num} num1 减数 
	 * @param {Num} num2 被减数 
	 * @return {Num} result 结果 
	 */ 
	function minus(num1,num2){ 
	  return num1 - num2; 
	} 
	
	//示例二
	/** 
	 * @class 简单的类对象标注示例 
	 * @author <llying@javaeye.com> 
	 * @version 0.1 
	 */ 
	/** 
	 * @author <llying@javaeye.com> 
	 * @constructor Person 
	 * @description 一个Person类 
	 * @see The <a href="#">llying</a >. 
	 * @example new Parent(“张三”,15); 
	 * @since version 0.1 
	 * @param {String} username 姓名 
	 * @param {Num} age 年龄 
	 */ 
	function Person(username,age) 
	{ 
	/** 
	 * @description {Sting} 姓名 
 	 * @field 
	 */ 
		this.username = username; 
	/** 
	 * @description {Num} 年龄 
	 * @field 
	 */ 
		this.age = age 
	/** 
	 * @description 弹出say内容 
	 * @param {String} content 内容 
	 */ 
		this.say = function(content) 
		{ 
			alert(this.username+" say :"+content); 
		} 
	/** 
	 * @description 返回json格式的对象 
	 * @return {String} json格式 
	 * @see Person#say 
	 */ 
		this.getJson = function(){ 
			return "{name:"+this.username+",age"+this.age+"}"; 
		} 
	} 
```

### 下载安装

``` bash
	npm install -g jsdoc
```

github项目地址:<https://github.com/jsdoc3/jsdoc>  
jsdoc官网: <http://usejsdoc.org/>     
google项目地址:<http://code.google.com/p/jsdoc-toolkit-ant-task/> (经常被墙，无法访问，也是没办法，只好用这个nodejs版了)
