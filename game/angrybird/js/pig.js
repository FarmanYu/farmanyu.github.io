/*
* pig类
*/
(function(){
     //从引擎的Sprite继承
     Pig = B2Sprite.extend({
     init:function(r)
     {
       this.r = r;
	   this.sCtx = new StateContext(this);     
	   this.regState();  
	   this._super();
	   this.score = 2000;
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
	 addToB2Word:function()
	 {
		var body = B2Util.createRoundBody(this.r,this.x,this.y,4,0.5,0.2);
		this.bindB2Obj(body);
	 },
      //复写死亡方法  
     dead:function()
	 {        		
		this._super();
        TGame.createBoom(this.x,this.y);
		//显示分数
		TGame.createScore(this.x,this.y,{"txt":this.score,"col":"green","f_size":34,"l_time":1000});
	 }
   })
   //注册pig到类工厂
   Pig.ClassName = "Pig";
   var IdleState = State.extend({
       change:function()
	   {
         var pig = this.ctx.owner;		 
	   },
       update:function()
       {
          var pig = this.ctx.owner;	
          pig.syncToB2();
	   }
   });
   ClassFactory.regClass(Pig.ClassName,Pig);
}())