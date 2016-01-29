---
title: 'Node.js中的child_process及进程通信'
date: 2014-05-16 00:00:00
tags: [node,child_process]
---

child_process是Node.js的一個十分重要的模塊，通過它可以實現創建多進程，以利用多核計算資源。  

Node.js 0.8的child_process模塊提供了四個創建子進程的函數，分別是spawn，exec，execFile和fork。其中spawn是最原始的創建子進程的函數，其他三個都是對spawn不同程度的封裝。spawn只能運行指定的程序，參數需要在列表中給出，相當於execvp系統函數，而exec可以直接運行複雜的命令。  

例如要運行ls -lh /usr，使用spawn需要寫成spawn('ls', ['-lh', '/usr'])，而exec只需exec('ls -lh /usr')。exec的實現原理是啓動了一個系統shell來解析參數，因此可以是非常複雜的命令，包括管道和重定向。此外，exec還可以直接接受一個回調函數作爲參數，回調函數有三個參數，分別是err, stdout, stderr，非常方便直接使用，例如：  

``` javascript
		child_process.exec('ls -lh /usr', function(err, stdout, stderr) {
		  console.log(stdout);
		});
```

如果使用spawn，則必須寫成：  

``` javascript
	  child = child_process.spawn('ls', ['-lh', '/usr']);
		child.stdout.setEncoding('utf8');
		child.stdout.on('data', function(data) {
		  console.log(data);
		});
```

execFile與spawn的參數相似，也需要分別指定執行的命令和參數，但可以接受一個回調函數，與exec的回調函數相同。它與exec的區別在於不啓動獨立的shell，因此相比更加輕量級。  

fork函數用於直接運行Node.js模塊，例如fork('./child.js')，相當於spawn('node', ['./child.js'])。與默認的spawn不同的是，fork會在父進程與子進程直接建立一個IPC管道，用於父子進程之間的通信。例如：  

``` javascript
		var n = child_process.fork('./child.js');
		n.on('message', function(m) {
		  console.log('PARENT got message:', m);
		});
		n.send({ hello: 'world' });
```

child.js的內容  

``` javascript
		process.on('message', function(m) {
		  console.log('CHILD got message:', m);
		});
		process.send({ foo: 'bar' });
```

其中父進程調用fork函數獲取一個返回值，作爲子進程的句柄，通過send函數發送信息，on('message')監聽返回的信息，子進程通過內置的process對象相同的方法與父進程通信。   

fork函數有一個問題，就是它只能運行JavaScript代碼，如果你喜歡用CoffeeScript（或者其他任何編譯到js的語言），是無法通過fork調用的。一個簡單的方法是把代碼編譯到JavaScript再運行，但是很不方便，有沒有什麼辦法呢？   

答案是可以的，還是得回到spawn函數。spawn函數除了接受command, args外，還接受一個options參數。通過把options參數的stdio設爲['ipc']，即可在父子進程之間建立IPC管道。例如子進程使用CoffeeScript：  

``` javascript
		child_process = require('child_process')
		options =
		  stdio: ['ipc']
		child = child_process.spawn 'coffee', ['./child.coffee'], options
```

其中只要把spawn的第一個參數設置爲運行對應腳本的解釋器，即可運行，例如使用Continuation.js，只需child = child_process.spawn('continuation', ['./child.coffee'], options)。