/*
* Background类
*/
(function(){
  //从引擎的RenderObj继承
   Background = RenderObj.extend({     
   init:function(vW,vH,sH,img)
   {
	 this._super();	
	 this.zIdx = -99;
	 this.sH = sH;
	 this.vH = vH;
	 this.vW = vW;
	 this.scrollY = 0;
     this.img = img;	 
	 this.iHeight = img.height;
   },   
   update:function()
   {
	 //滚动y坐标,相对于整个背景     
	 if(this.sH-this.scrollY>this.vH)
	 {
		 this.y += this.dy;
		 this.scrollY += this.dy;
	 }	 	 
	 if(this.y>= this.iHeight)
	 {
		 this.y = 0;
	 }
   },	   
   //重写render 
   render:function(ctx)
   {
     var  h = this.iHeight-this.y;
	 h = (h>=this.vH)?this.vH:h;
	 var h1 = this.iHeight-this.y-this.vH;
	 h1 = (h1>0)?h1:0;
	 ctx.drawImage(this.img,0,h1,this.vW,h,0,this.vH-h,this.vW,h);
	 if(h<this.vH)
	 {
		 h1 = this.vH-h;
		 ctx.drawImage(this.img,0,this.iHeight-h1,this.vW,h1,0,0,this.vW,h1);
	 }    
   }
  });
  Background.ClassName = "Background";
  //注册背景类
  ClassFactory.regClass(Background.ClassName,Background);
}())