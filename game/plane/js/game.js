/*
* 游戏主体框架
*/
(function(win){
   var GW = 400,
	   GH=600,
	   GxOff = (document.body.clientWidth-GW)*0.5;
   //定义状态类   
   var TitleState = State.extend({      
       enter:function()
	   {
		 var game = this.ctx.owner;
         //创建开始场景
		 var scm = game.sceneManager; 	 
	     var sc = scm.createScene(TitleSC.ClassName,[GxOff,10,"Title"]);		
		 this.sc = sc;
         ResManager.loadRes("data/res.json",function(){
		   game.cfg = ResManager.getResByName("gCfg","gf0").data;
		   sc.hideProgressUI();
		   sc.holder.find("#sDiv").fadeIn(1000);
	     },
		 function(total,cur){			
           //渲染进度条
		   var pro = (cur/total)*100|0;	
           sc.holder.find("#pBar").width(pro*3);
		 });      
	   },
       change:function()
       {
		  var game = this.ctx.owner;
		  if(this.sc.isStart)
		  {
			 game.sCtx.changeState("Gaming");
		  }           
	   },
	   exit:function()
	   {
		 var scm = this.ctx.owner.sceneManager; 	 
		 scm.remove("Title");
	   }
    });
   //定义状态类
   var GamingState = State.extend({
	   enter:function()
	   {
         var game = this.ctx.owner;
         //创建运行场景
		 var scm = game.sceneManager; 	 
	     this.sc = scm.createScene(GamingSC.ClassName,[GxOff,10,"Gaming"]);
	   },
	   change:function()
       {
		   var game = this.ctx.owner;
		   if(this.sc.isOver)
		   {
			   game.sCtx.changeState("GameEnd");
		   }		   
	   },
	   exit:function()
	   {
		 var scm = this.ctx.owner.sceneManager; 	 
		 scm.remove("Gaming");
	   }	
   });
  //定义状态类
   var GameEndState = State.extend({
	   enter:function()
	   {
		 var game = this.ctx.owner;
         //创建结束场景
		 var scm = game.sceneManager; 	 
	     this.sc = scm.createScene(EndSC.ClassName,[GxOff,10,"GameEnd"]);
	   }, 
       change:function()
       {
		   var game = this.ctx.owner;
		   if(this.sc.isRetry)
		   {			   
			   game.sCtx.changeState("Title");
		   }		   
	   },
       exit:function()
	   {
		 var scm = this.ctx.owner.sceneManager; 	 
		 scm.remove("GameEnd");
	   }	
   }); 
   var _shootGame = Game.extend({	 
	   //初始化游戏	  
       init:function()
	   {
        //获取场景管理器
		this._super();	    
		this.cfg = null;
		this.sCtx = new StateContext(this);  
		this.regState();
		this.sCtx.changeState("Title");		
		this.initListener();
		this.run(60);
	   },
       //注册状态类
       regState:function()
       {		   
        this.sCtx.regState(new TitleState("Title",this.sCtx));
	    this.sCtx.regState(new GamingState("Gaming",this.sCtx));
        this.sCtx.regState(new GameEndState("GameEnd",this.sCtx));
       },
	   //初始化游戏监听器
	   initListener:function()
	   {
		 var self = this;
         //增加监听器
         var ltn = new AppEventListener({
	      "beforeRender":function(){		   		  
			 self.sCtx.update();
	      }
 	     });
	     this.addListener(ltn);
	   }    
   });
   //定义全局StickGame
    win.ShootGame = new _shootGame();  
}(window))