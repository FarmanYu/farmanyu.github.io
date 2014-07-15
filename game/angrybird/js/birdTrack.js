/*
* birdTrack类
*/
(function(){
     //从引擎的Sprite继承
     BirdTrack = Sprite.extend({
     init:function()
     {   	   
	   //轨迹点集
	   this.tracks = [];
	   this._super();
	   this.setAnims(ResManager.getAnimationsByName("sprite","cd"));
	 },
     render:function(ctx)
	 {
		var sc;
		var f = this.getNextFrame();
		for(var i=0;i<this.tracks.length;i+=2)
		 {
           sc = 0.3-(i%3)*0.1;
           ctx.save(); 
           ctx.translate(this.tracks[i],this.tracks[i+1]);
		   var hw = 0.5*this.w;
		   var hh = 0.5*this.h;				 
		   ctx.scale(sc,sc);		  
		   ctx.drawImage(f[0],f[1],f[2],f[3],f[4],-hw,-hh,this.w,this.h);
		   ctx.restore();
		 }
	 }
   })
   //注册Bird到类工厂
   BirdTrack.ClassName = "BirdTrack";    
   ClassFactory.regClass(BirdTrack.ClassName,BirdTrack);
}())