(function(){
	//定义客户端
  var Client = {
    //客户端socket
    so:null,
	isFirstConnect:true,
	//当前用户
	user:{"uname":null},
	//游戏信息
	gameInfo:{"user":null},
  };
  //连接服务器
  Client.connect = function(host,port){
     var p = port||80,
	     self = this;
	 if(this.so==null)
	 {
         this.so = io.connect("http://"+host+":"+p,{'reconnect':false});
		 if(this.so)
		 {		   
		   //绑定连接socket事件
		   this.so.on("connect",function(){self.doConnect();});
		   //绑定错误处理
		   this.so.on("error",function(data){this.so = null;alert("服务器连接失败!");});
		 }
	 }
	 else
	 {
	     this.so.socket.reconnect();
	 }
  }; 
  //当前用户是否正在操作的用户
  Client.isOperUser = function()
  {
    return this.user.uname == this.gameInfo.user.uname;
  }
  //登陆
  Client.login = function(callback)
  {
     //通知服务端login事件
	  this.so.emit("login",{"uname":this.user.uname},function(data){
         callback(data);
	  });
  };
  //连接事件 
  Client.doConnect = function()
  {   
	 //如果是第一次连接，注册事件
	 if(this.isFirstConnect)
	 {
		this.isFirstConnect = false;
		this.bindEvent();
	 }
	 else
	 {
		//重新连接
		this.so.socket.reconnect();
	 }
  };
   //绑定客户端socket事件
  Client.bindEvent = function()
  {
     var self = this;
	 //消息事件
	 this.so.on("message",function(msg){self.doMessage(msg);});
	 //注册开始画画事件
	 this.so.on("startDraw",function(data){self.startDraw(data)});
	 //注册画画事件
	 this.so.on("drawing",function(data){self.drawing(data)});
	 //处理画板更新事件		  
	 this.so.on("paintUpdate",function(data){self.paintUpdate(data);});
	 //处理游戏用户更新事件
	 this.so.on("updateUserInfo",function(data){self.doUpdateUserInfo(data);});
	 //处理游戏回合准备事件
	 this.so.on("questionReady",function(data){self.doQuestionReady(data);});
	 //处理游戏开始事件
	 this.so.on("startQuestion",function(data){self.doStartQuestion(data);});	
	 //处理游戏回答问题事件
	 this.so.on("processQuestion",function(data){self.doProcessQuestion(data);});		
	 //提示事件
     this.so.on("hint",function(data){self.doHint(data);});		
	 //获取奖励
     this.so.on("award",function(data){self.doAward(data);});		
	 //结束问题
	 this.so.on("endquestion",function(data){self.doEndquestion(data);});	 
	 //结束游戏
	 this.so.on("gameover",function(data){self.doGameOver(data);});
  }; 
  //收到消息事件,收到服务器消息触发
  Client.doMessage = function(msg)
  {
     $("#msgArea").append(msg).append("<br/>");
	 $("#msgArea").scrollTop($("#msgArea")[0].scrollHeight);
  };
  //根据用户信息更新单个用户的UI
  Client.updateUser = function(user,idx)
  {        
     var self = this;
     //如果是当前用户，更新当前用户信息
	 if(user.uname == this.user.uname)
	 {
	   this.user = user;
	 }
     //创建用户UI
	 var px = $("<div id='ulx' class='ulx'></div>");
	 var ud = $("<div id='u_"+user.uname+"' class='uready'><div id='aw_"+user.uname+"' class='award'></div></div>"),
	       glev = $("<div id='uc_"+user.uname+"' class='ugo'></div>");
      px.append("<div style='overflow:hidden'>"+user.uname+"</div>").append(ud).append(glev);
	  $("#userArea").append(px);		  	
	  glev.text(user.score);
	  //如果是第一个登陆的用户
	  if(user.uname==this.user.uname&&idx==0)
	  {
		glev.text("GO!");
		//绑定点击事件 
		glev.on("click",function(){
		  //设置回调函数处理用户准备好事件
		  self.so.emit("gameStart",null,function(data){
		    glev.off("click");		   				  
			glev.text(user.score);
		  });
		});          	  
	  }
  };    
  //更新用户信息
  Client.doUpdateUserInfo = function(data)
  {
     var self = this,
	     users = data;
     //更新用户区
     $("#userArea").empty(); 
	 //更新用户
	 for(var i=0;i<users.length;i++)
	 {
	   self.updateUser(users[i],i);
	 }
  };
  //发送消息
  Client.sendMsg = function(msg)
  {
     this.so.send(msg);
  };
  //发送开始画画事件
  Client.emitStartDraw = function(data)
  {
     this.so.emit("startDraw",data);
  };
  //发送画画事件
  Client.emitDrawing = function(data)
  {
    this.so.emit("drawing",data);
  }
  //发送画板更新事件
  Client.emitPaintUpdate = function(data)
  {
    this.so.emit("paintUpdate",data);
  } 
  //开始画画
  Client.startDraw = function(data)
  {
    Painter.fire("onStartDraw",data);
  };
  //画画事件
  Client.drawing = function(data)
  {
    Painter.fire("onDrawing",data);
  };
  //更新画板事件 
  Client.paintUpdate = function(data)
  {
    Painter.fire("onPaintUpdate",data);
  }; 
  //处理游戏回合准备事件
  Client.doQuestionReady = function(data)
  {
     this.ReadyEffect(data); 
  }
  //处理游戏开始事件
  Client.doStartQuestion = function(data)
  {
    var user = data[0].user,
	    msg = "现在由:"+user.uname+"开始画画";
    this.gameInfo = data[0];
	//清除画板
	Painter.clear();
    //恢复用户层样式
    $("#ulx div[id^=u_]").each(function(){
	  $(this).attr("class","uready");
	});
	$("#u_"+user.uname).attr("class","uoper");
    $("#operDiv").hide(); 	
	//显示效果层
	$("#effect").show();
    $("#qTime").show();
	$("#qTime").text(data[1]);
    //显示题目回合
    $("#dround").text("第"+this.gameInfo.round+"/"+data[2]+"轮");
	//如果是当前操作用户,修改信息栏
	if(this.user.uname == user.uname)
	{	 
	  var m = "请按照题目画图,题目是:<span style='color:red'>"+data[0].question.data+"</span>";
	  $("#question").html(m);     
	  //显示操作画图层
      $("#operDiv").show(); 	  
	}
	else
	{
	  $("#question").text(msg);
	}
    $("#msgArea").append(msg+"<br/>");   
	$("#msgArea").scrollTop($("#msgArea")[0].scrollHeight);
  }
  //显示信息
  Client.showMessage = function(msg)
  {
     var p = $("#hb");
     var ww = p.width(),
	     wh = p.height(),
		 ox = p.offset().left,
		 oy = p.offset().top;
     var dmsg = $("#msg");
	 dmsg.text(msg);
	 dmsg.css("left",ox+(ww-300)*0.5);
	 dmsg.css("top",oy+(wh-130)*0.5)
	 $("#msg").fadeIn(100,function(){
	    $(this).fadeOut(3000);    
	 });
  }
  //提示
  Client.doHint = function(data)
  {
    if(!this.isOperUser())
	{
	  $("#question").text("提示:"+data);
	}
    $("#msgArea").append("提示:"+data+"<br/>"); 
	$("#msgArea").scrollTop($("#msgArea")[0].scrollHeight);
  }
  //获取奖励
  Client.doAward = function(data)
  {
    //更新用户奖励
	for(var i=0;i<data.length;i++)
	{
	   var u = data[i].user,
	       awd = data[i].awd;
       //处理动画
       $("#ulx div[id=aw_"+u.uname+"]").text("+"+awd+"").attr("class","awardAnim").bind("webkitTransitionEnd",
	   function(){
	     $(this).text("").attr("class","award");
		})
       $("#ulx div[id=uc_"+u.uname+"]").text(u.score); 
	}
  }
  //结束问题
  Client.doEndquestion = function()
  {          
     Painter.clear();
	 //释放鼠标并隐藏
	 $("#paintArea").trigger("mouseup").hide();	 
	 //显示正确答案     
     Client.showMessage("正确答案是:"+this.gameInfo.question.data);
  }
  //结束游戏
  Client.doGameOver = function()
  {
     this.showMessage("Game Over!");
  }
  //处理游戏回答问题事件
  Client.doProcessQuestion = function(data)
  {
    $("#qTime").text(data.time);
  }
  //处理ready效果
  Client.ReadyEffect = function(data)
  {   
    $("#effect").text(data);
	if(data < 0)
	{	  
	  $("#effect").hide();
	   //显示画图层
	  $("#paintArea").show();
	}
  }
  window.Client = Client;
}())