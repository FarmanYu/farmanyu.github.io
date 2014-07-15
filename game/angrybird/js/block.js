/*
* Block类
*/
(function(){
     //从引擎的Sprite继承
     Block = B2Sprite.extend({
     init:function(bType)
     {
	   this.sCtx = new StateContext(this);     
	   this.regState();  
	   this.bType = bType;
	   this._super();
	   this.hp = 40;
	   this.score = 1000;
	   this.sCtx.changeState("idle");	   
	 }, 
	 //注册状态类
     regState:function()
     {
       this.sCtx.regState(new IdleState("idle",this.sCtx));
     },		     
	 //更新状态机器
     update:function()
	 {
	   this.sCtx.update();
	 },
     //获取当前状态
	 getState:function()
     {
		 return this.sCtx.currState.type;
	 },
     //添加到b2world世界中
	 addToB2Word:function(t)
	 {
        //定义材质数据,默认是木头
		var density = 1,
			friction = 0.8,
			restitution = 0.3;		
        switch(this.bType)
		{
          case "glass":
           density = 0.5;
           break ;
		  case "stone":
           density = 4;
           restitution = 0.01;
           break;
		}
  	    body=B2Util.createRectBody(this.x,this.y,this.w*0.5,this.h*0.5,this.deg,density,friction,restitution);
		this.bindB2Obj(body);
	 },
     //定义block碰撞效果
	 effColl:function()
	 {
       var boomName,mNum;
	   switch(this.bType)
	   {
         case "glass":
           boomName = "boom2";
		   mNum = 6;
           break ;
		 default:  
           boomName = "boom3";
		   mNum = 12;
	   }
	   var  emit = new Emit({  
						  "lifeRange":[200,600],
						  "sSize":1,
						  "eSize":0.2,				
						  "maxNum":mNum,                           
						  "pos":[this.x,this.y],
                          "angRange":180,
						  "v":[-1.2,1],
						  "vRange":[1,1], 
						  "a":[0.01,-0.01],
						  "aRange":[0.01,-0.01]
						},this.owner,BoomParticle.ClassName,[boomName]);	
        emit.jet();
	 },    
      //复写死亡方法  
     dead:function()
	 {        		
		this._super();			  
		this.effColl();	
		//显示分数
		TGame.createScore(this.x,this.y,{"txt":this.score});
	 }
   })
   //注册Block到类工厂
   Block.ClassName = "Block";
   var IdleState = State.extend({
       change:function()
	   {
         var bk = this.ctx.owner;		 
	   },
       update:function()
       {
          var bk = this.ctx.owner;	
          bk.syncToB2();
	   }
   });  
   ClassFactory.regClass(Block.ClassName,Block);
}())