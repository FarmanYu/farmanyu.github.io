(function(){
   //定义客户端操作对象
   var Client = function(server,socket){
     //绑定服务器
     this.srv = server;
     //绑定的socket
     this.so = socket;
	 //用户信息
	 this.user = {"uname":null,"level":0,"score":0};
	 //绑定事件
	 this.bindEvent();
   };
   //定义客户端各操作函数
   Client.prototype = {
     toString:function()
	 {
		 return "[uname:"+this.user.uname+",sid:"+this.so.id+"]";
	 },
     //绑定事件
     bindEvent:function()
	 {
       if(this.so)
		 {
		   var self = this;
		   //注册断开连接事件
		   this.so.on("disconnect",function(){self.doDisconnect();});
		   //注册登陆事件
		   this.so.on("login",function(data,fn){self.doLogin(data,fn);});
		   //注册准备游戏开始事件
           this.so.on("gameStart",function(data,fn){self.doGameStart(data,fn);});
		   //绑定处理消息事件
		   this.so.on("message",function(msg){self.doMsg(msg);});		   
		   //绑定开始画图事件
		   this.so.on("startDraw",function(data){self.broadcastStartDraw(data);});	
		   //绑定画图事件
		   this.so.on("drawing",function(data){self.broadcastDrawing(data);});
		   //处理画板更新事件		  
	       this.so.on("paintUpdate",function(data){self.broadcastPaintUpdate(data);});
		   //绑定退出房间事件
		   this.so.on("exit",function(){self.doExit();});
	     }
	 },
     //处理断开连接
	 doDisconnect:function()
	 {
		 this.srv.removeClientByID(this.so.id);
         //通知客户端;
         this.srv.updateUserInfo();
	 },
	 //处理已经准备好游戏事件
     doGameStart:function(data,fn)
	 {
         this.srv.startGameRound();
		 fn();
	 },
	 //处理用户登录
	 doLogin:function(data,fn)
	 {
		if(data)
		{
			this.user.uname = data.uname;
			var isExists = this.srv.isUserExists(this);		
			//通知客户端;
			if(!isExists)
			{
                fn(0);
				this.srv.updateUserInfo();			
			} 
			else 
            {
				var result = 1;
				if(this.srv.info.status!=0)
				{
					result = 2;
				}
				fn(result);
                this.so.disconnect("unauthorized");	
				this.srv.removeClientByID(this.so.id);
			}
		}        
	 },
     //处理消息
	 doMsg:function(msg)
	 {
        var gInfo = this.srv.info,
			m = msg;		
		if(gInfo.status==1&&this.srv.isRightAnswer(m))
		{
		   m = "*"; 
		   //获取用户奖励得分
           var award = this.srv.getAward(this.user);
		   if(award>0)
		   {			   
			   var awd = [];
			   this.user.score+=award;
			   awd.push({"user":this.user,"awd":award});			   
			   if(this.srv.info.rUserCount == 1)
			   {
				   this.srv.info.user.score += 3;
				   awd.push({"user":this.srv.info.user,"awd":3});
			   }
			   this.srv.broadcastEvent("award",awd);   
		   }		   		   
		}
		this.srv.broadcastMsg("用户"+this.user.uname+"说:"+m);
	 },
     //广播开始画图事件
	 broadcastStartDraw:function(data)
	 {
		 this.so.broadcast.emit("startDraw",data);
	 },
	 //广播画图事件
	 broadcastDrawing:function(data)
	 {
		 this.so.broadcast.emit("drawing",data);
	 }, 
     //广播画板更新事件		  
	 broadcastPaintUpdate:function(data)
	 {
		 this.so.broadcast.emit("paintUpdate",data);
	 },
     //处理离开事件
	 doExit:function()
	 {		 
	 }
   }
   //输出模块
   exports.newClient = function(server,socket)
   {
	   return new Client(server,socket);
   }
}())