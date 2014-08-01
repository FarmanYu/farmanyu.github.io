---
layout: post
title:  "Rss阅读器思考记录"
keywords: rss, reader
---

#Rss阅读器思考记录
> 想熟悉nodejs完成一个项目，但是对于MVC了解实在太少，于是想到做一个Rss阅读器。

自己想的实现原理是，将远程的Rss文章拉到本地缓存一份，定期更新本地的数据文件，本地查看之前的Rss文档。

> 第一个想到的就是experss，nodejs写的本地服务器，作为本地阅读的server。

找到一些Rss源，存成数据文件，提供使用。