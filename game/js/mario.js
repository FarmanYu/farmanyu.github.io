/*
* Mario类
*/
(function(){
  //从引擎的Sprite继承
     Mario = Sprite.extend({
     update:function()
	 {
	   var w = this.owner.w,
		   h = this.owner.h;
	   //到达边界改变x速度方向
       if(this.x<20||this.x>w-20)
	   {
		   this.dx = -this.dx;
		   this.isXFlip = (this.dx<0);
	   };
	   this._super();
	 }
   })
   //注册马力到类工厂
   Mario.ClassName = "Mario";
   ClassFactory.regClass(Mario.ClassName,Mario);
}())