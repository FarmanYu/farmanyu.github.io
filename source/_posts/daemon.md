---
title: 'nodejs写自己的守护进程'
date: 2014-05-18 00:00:00
tags: [node]
---

起初我也是使用网上流行的forever来尝试，发现控制forever挺麻烦的，特别是多个nodejs节点的时候，总是提示.forever文件已经存在，需要使用-a或者--append来处理，然后实际上有时候进程死了它并不知晓  

后来就写了个简单的守护进程，用主进程来启动子进程，如果子进程死了就重启子进程，还有优化的余地，比如如何停止所有的节点的问题，这个用别的shell来处理了，这里只是贴出守护进程的代码  

也说说写这个守护进程的目的，起来正常来说，如果容错写的够好是不需要守护进程的，但是我之前发现有个问题，mysql在运行一定时间之后，会断开所有的连接，导致nodejs读取mysql的连接中断，这时候nodejs就会挂掉，使用连接池连接mysql的话，虽然nodejs不会挂掉，但是连接池实际上属于无用状态，也读取不到mysql的数据，导致请求会阻塞，浏览器一直无法响应  

``` javascript
		var spawn = require('child_process').spawn,
    	server = null;

		function startServer(){
		    console.log('start server');
		    server = spawn('node',['app.js']);
		    console.log('node js pid is '+server.pid);
		    server.on('close',function(code,signal){
		        server.kill(signal);
		        server = startServer();
		    });
		    server.on('error',function(code,signal){
		        server.kill(signal);
		        server = startServer();
		    });
		    return server;
		};

		startServer();
```