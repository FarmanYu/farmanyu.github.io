/*
* 带包围盒的精灵
*/
(function(){
   //从引擎的RenderObj继承
   CObj = RenderObj.extend({   
   init:function()
   {
	   this.bBox = null;
	   this._super();
   },
   //设置包围盒
   setBBox:function(bBox)
   {
	   this.bBox = bBox;
   },
   //重写update
   update:function()
   {	  
	   var w = this.owner.w,
		   h = this.owner.h;
	   //到达边界改变速度方向
	   if(this.x<this.w||this.x>w)
	   {
		   this.dx = -this.dx;
	   };
	   if(this.y<this.h||this.y>h)
	   {
		   this.dy = -this.dy;
	   }
	   this.bBox.c = "red";
	   //调用父类方法
	   this._super();
	   //检测是否碰撞其他CObj
	   this.checkCollide();
   }, 
   checkCollide:function()
   {
      var cObjs = TGame.cObjs;
	  for(var i=0,len = cObjs.length;i<len;i++)
	  {
		  if(this.name!=cObjs[i].name&&this.bBox.c!='yellow'&&this.bBox.isCollide(cObjs[i].bBox))
		  {
   		     this.bBox.c = cObjs[i].bBox.c = "yellow";
		  }
	  }
   },
   render:function(ctx)
   {
	  var bType = this.bBox.getType();
      this.bBox.x = this.x;
	  this.bBox.y = this.y;	
	  this.bBox.show(ctx);
   }
  });
  CObj.ClassName = "CObj";
  //注册CObj类
  ClassFactory.regClass(CObj.ClassName,CObj);
}())