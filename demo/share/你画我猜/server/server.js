(function(){ 
  //导入客户端模块
  var cli = require("./client"),
      data = require("./data");
  var http=require("http");
  //定义服务端
  var Server = function(){
	  //绑定的io对象
	  this.io = null;
      //记录所有的客户端
	  this.clients =[];
	  //定时器句柄
	  this.tHand = null;
	  //当前游戏信息
	  this.info = null;
	  //当前游戏配置信息
	  this.cfg = null;
  };
  Server.prototype = {
	  listen:function(port)
	  {
		 var srv = http.createServer(function(req,rep){});
		 this.io = require("socket.io").listen(srv);
		 //设置日志级别
		 this.io.set('log level', 1);
		 srv.listen(port);
		 this.bindEvent();		 
		 //获取游戏信息
		 this.info = data.gameData().info;
		 this.cfg = data.gameData().cfg;
	  },
      //绑定事件
      bindEvent:function()
      {
		 var self = this;
         //注册连接事件 
         this.io.sockets.on("connection",function(socket){self.doConnect(socket)});	
	  },
	  doConnect:function(socket)
	  {		  	
		  this.addClient(socket);
	  },      
	  //添加一个socket客户端
	  addClient:function(socket)
      {
		  console.log("add new client:"+socket.id);
		  this.clients.push(cli.newClient(this,socket));
	  },
      //移出一个socket客户端
	  removeClientByID:function(sID)
      {
		var idx = -1;
		for(var i =0;i<this.clients.length;i++)
		{
			if(this.clients[i].so.id == sID)
			{
				idx = i;
				break;
			}
		}
        if(idx!=-1){
           this.clients.splice(idx,1);
		}
		//如果所有客户端都退出，则游戏复位
		if(this.info.status!=0&&this.clients.length == 0)
		  {
			clearInterval(this.tHand); 
		    this.resetGameInfo();
		  }
	  },
      //判断用户是否存在
      isUserExists:function(client)
	  {
		  for(var i = 0 ;i<this.clients.length;i++)
		  {
			 if(client!=this.clients[i]&&this.clients[i].user.uname == client.user.uname)
			  {
				 return true;
			  }
		  }
		  return false;
	  },
      //获取所有用户姓名
	  getAllUser:function()
	  {
		  var p = [];
		  for(var i = 0 ;i<this.clients.length;i++)
		  {
			  p.push(this.clients[i].user);
		  }  
		  return p;
	  },     	 
	  //广播消息
	  broadcastMsg:function(msg)
      {
        this.io.sockets.send(msg);
	  },
	  //广播事件
	  broadcastEvent:function(eventName,data)
	  {
		this.io.sockets.emit(eventName,data);
	  },
	  //通知客户端更新客户信息
	  updateUserInfo:function()
	  {
		//如果没有一个客户端
		var users = this.getAllUser();
		if(users.length != 0)
		{
		  this.broadcastEvent("updateUserInfo",users);
		};	
	  },    
      //答案是否正确
	  isRightAnswer:function(ans)
      {
		  return ans == this.info.question.data;
	  },
	  //随机产生题目
	  getRandQuestion:function()
      {
	    var tidx = Math.random()*this.cfg.qtype.length|0,
		    didx = Math.random()*this.cfg.qdata[tidx].length|0,
		    type = this.cfg.qtype[tidx],
			ques = this.cfg.qdata[tidx][didx];
        return {"type":type,"data":ques};
	  }, 
      //获取下一个可用用户
	  getNextUser:function()
      {
		 if(this.clients.length!=0)
		 {
		   var idx = (++this.info.uIdx)%this.clients.length;
		   this.info.uIdx = idx;
		   return this.clients[idx].user;
		 }
         else
		 {
		   return null;
		 }
	  },
      //复位游戏数据
	  resetGameInfo:function()
	  {
         var info = this.info;
		 info.time = 0;
		 info.round = 0;
		 info.uIdx = -1;
		 info.user = null;
		 info.question = {"type":null,"data":null};
		 info.status = 0;
		 info.rUserCount = 0;
		 info.rUser = null;
	  },
      //处理一个问题,开始一个问题时，每秒钟发送
      processQuestion:function()
	  {		        
	   if(this.isQuestionOver())
	   {
		  //结束问题
		  this.endQuestion();
	   }
	   else
	   {
		  this.broadcastEvent("processQuestion",{"time":this.cfg.time-this.info.time});
	   }
	   //发出提示信息
	   if(this.info.time ==8)
	   {
          this.broadcastEvent("hint",this.info.question.data.length+"个字");
	   }
	   else if(this.info.time ==16)
	   {
          this.broadcastEvent("hint","类型:"+this.info.question.type);
	   }
	  },	  
      //开始游戏回合
	  startGameRound:function()
      {
       var self = this;
       if(this.info.round==this.cfg.round)
		  {
			this.endGameRound();
			return;
		  }		     
		this.info.status = 1;  
		this.info.round++;
		this.broadcastMsg("--第"+(this.info.round)+"回合开始--");	
		this.startQuestion();
	  },
	  //开始问题
      startQuestion:function()
      {
         var self = this,
			 info = this.info;
         info.time = 0;    
		 info.status = 1;
		 info.question = this.getRandQuestion();
		 info.user = this.getNextUser();		 
		 info.rUserCount = 0;
		 info.rUser = null;		 
		 this.broadcastEvent("startQuestion",[info,this.cfg.time,this.cfg.round]);
		 this.doQuestionReady();
	  },
      //游戏回合前准备
      doQuestionReady:function()
      {
		 var time = 5,
			 self = this;
		 this.io.sockets.emit("questionReady",time);
		 this.tHand = setInterval(function(){
		 if(time < 0)
			{
              clearInterval(self.tHand);
			  //开始一个问题
              self.tHand = setInterval(function(){
                 self.info.time++;
				 self.processQuestion();
			  },1000);
		    }
		 else
			{
			  self.io.sockets.emit("questionReady",--time);
		    }           		   
		 },1000)
	  },
      //检查是否可以结束一个问题
	  isQuestionOver:function()
      {
        return this.info.status==1&&(this.isAllRight()||this.info.time==this.cfg.time);
	  }, 
	  endQuestion:function()
      {
		  var self = this;
		  clearInterval(this.tHand);
          this.info.status = 2;
          //运行3秒后重新开始一个问题
		  var t = 3;
		  this.broadcastEvent("endquestion");
		  self.tHand = setInterval(function(){  
			  t--;
			  if(t==0)
			  {
				 if(self.info.uIdx!=self.clients.length-1)
				  {
					 self.startQuestion();
				  }
				 else
				  {
					 self.startGameRound();
				  }					 
			  }
		  },1000);	  		  
	  },
      //终止游戏回合
	  endGameRound:function()
	  {       
        clearInterval(this.tHand); 
		this.resetGameInfo();
		this.broadcastEvent("gameover",this.getAllUser());
	  },
      //检测是否所有用户都已经答对
	  isAllRight:function()
      {
		  return this.clients.length-1 == this.info.rUserCount;
	  },    
	  //获取奖励,第一个用户得2分其他的得1分，如果是当前用户则不用，否则，只要有一个用户答对，
	  //该操作用户得3分
	  getAward:function(user)
	  {
		 var result = 0;
		 //得分用户不是当前用户
		 if(user.uname !=this.info.user.uname)
		 {
			 this.info.rUserCount++;
             if(this.info.rUserCount==1)
			 {
				 result = 2;
			 }
             else
             {
				 result = 1;
			 }
		 }
		 return result;
	  }
  }
  //启动服务
  new Server().listen(9000);
}())
