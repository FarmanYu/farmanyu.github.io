---
layout: post
title:  "如何利用子进程开启关闭服务"
keywords: node, nodejs
---

nodejs有child_process(子进程) API，如果利用child_process开启关闭server呢，先来贴代码:

		var spawn = require('child_process').spawn;

		var singleServer = {
				server : null,
				start : function(){
					 if(this.server){
					 		this.stop();
					 }
					 this.server = spawn('node', ['child_server.js']);
					 console.log("server start!");
				},
				stop : function(){
						if(this.server){
							 this.server.kill('SIGTERM');
							 console.log("server stop!");
						}
					 
				}

		};
		singleServer.start();

		var i = 0;
		setInterval(function(){
			if(i % 2 == 0){
				singleServer.stop();
			} else{
				singleServer.start();
			}
			i++;
		}, 5000);

singleServer的start方法启动了一个child_server进程，server由自身引用保存. stop方法为给server发送STGTERM信号，关闭server子进程，实现关闭服务的目的，学习nodejs child_process的学习文章，欢迎拍砖。