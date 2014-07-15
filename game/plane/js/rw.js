/*
* Reward奖励类
*/
(function(){
  //从引擎的Sprite继承
   Reward = Sprite.extend({
   init:function(param)
   {
	   this._super();
	   this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));	
	   this.groupID = 2;	
       var hw = (param.bBox&&param.bBox[0])||this.w*0.5,
           hh = (param.bBox&&param.bBox[1])||this.h*0.5; 
	   this.dx = this.dy = 1.5;
	   this.bBox = new ABBox(this.x,this.y,hw,hh);  
	   //是否进行碰撞检测
	   this.isCalcCollide = true;
	   this.zIdx = 16;
   },
   //重写update
   update:function()
   {	  
	   var w = this.owner.w,
		   h = this.owner.h;	  
	   //到达边界改变速度方向
       if(this.x<this.w*0.5||this.x>w-this.w*0.5)
	   {
		   this.dx = -this.dx;		   
	   };
       if(this.y<this.h*0.5||this.y>h-this.h*0.5)
	   {
		   this.dy = -this.dy;
	   };	  
	   //调用父类方法
	   this._super();
   }
  });
  Reward.ClassName = "Reward";
  //注册Reward类
  ClassFactory.regClass(Reward.ClassName,Reward);
}())