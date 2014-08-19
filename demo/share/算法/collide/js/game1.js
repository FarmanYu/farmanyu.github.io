(function(win){
	var _Game = Game.extend({
		//当前被选中的物体
		selObj:null,
	    //后台canvas
		backBuf:null,
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-500)*0.5|0;
	      var sc = scm.createScene([{"x":x,"w":500,"h":400,"name":"main","color":"gray"}]);
		  //创建后台canvas
		  var bC = document.createElement("canvas");
          bC.width = sc.w;
		  bC.height = sc.h;
		  this.backBuf = bC.getContext("2d");		  
		  //加载资源
	      this.loadRes(sc);	
		},
	    //加载资源
	    loadRes:function(scene)
	    {
		  var self = this;
		  ResManager.loadRes("data/res.json",function(){
			//创建精灵
			self.initRenderObj(scene);
			//开始飞奔
			self.run(60); 
		  });      
	    },
	    initRenderObj:function()
	    {
           var sc = this.sceneManager.getScene("main");		 
		   var cm = sc.createRObj(PObj.ClassName),
               plane = sc.createRObj(PObj.ClassName);
           cm.setAnims(ResManager.getAnimationsByName("sprite","cm"));		  
           plane.setAnims(ResManager.getAnimationsByName("sprite","plane"));		   
		   cm.moveTo(100,100);
		   plane.moveTo(300,100);
		} 
	})
   //定义全局TGame
   win.TGame = new _Game();
   
   //定义鼠标事件 
   Mouse.sDLG("down",function(e){
	   //获取游戏窗口坐标
	   var sc = TGame.sceneManager.getScene("main");
	   var gx = sc.x,
           gy = sc.y,
		   mx = Mouse.gX(),
		   my = Mouse.gY();
	   TGame.selObj = null;
	   //转换鼠标坐标到游戏窗口坐标系
	   var cd = MathUtil.mapSToCoord(mx,my,gx,gy);
	   var cobj = sc.rObjs;
	   var o = null;
       for(var i=0;i<cobj.length;i++)
	   {
		  o = cobj[i];
		  if(MathUtil.pInRect(cd[0],cd[1],o.x-o.w*0.5,o.y-o.h*0.5,o.w,o.h))
		   {              
			  TGame.selObj = cobj[i];
              break;
		   }
	   }
	   if(TGame.selObj!=null)
	   {
		  TGame.selObj.ox = TGame.selObj.x;
		  TGame.selObj.oy = TGame.selObj.y;
          TGame.selObj.status = 1;
	   }
   })
   Mouse.sDLG("move",function(e){
	  var sc = TGame.sceneManager.getScene("main");
      if(TGame.selObj!=null&&TGame.selObj.status==1)
	  {  		 	
		  var so = TGame.selObj;
          so.moveTo(so.ox+Mouse.gXOff(),so.oy+Mouse.gYOff()); 
		  //检测是否和其他精灵相交
		  var cobj = sc.rObjs;
	      var o = null,
			  io = null;
		  var x1 = so.x-so.w*0.5,
			  y1 = so.y-so.h*0.5,
		      x2 = so.x+so.w*0.5,
			  y2 = so.y+so.h*0.5,
		      x3,y3,x4,y4;
          for(var i=0;i<cobj.length;i++)
	      {
		    o = cobj[i];		   
			if(o.name!=so.name)
			{
			  x3 = o.x-o.w*0.5;
			  y3 = o.y-o.h*0.5;
		      x4 = o.x+o.w*0.5;
			  y4 = o.y+o.h*0.5;
              if(MathUtil.isInRect(x1,y1,x2,y2,x3,y3,x4,y4))
			  {			  
				  io = o;
			  }
			}
			if(o!=so&&so.isCollide(o))
			{
               alert("发生碰撞")
			}			
 	      }
		  if(io!=null)
		  {
            //获取相交区域
			var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
            //绘制相交区域到另一个canvas中
            var ctx = dRect.getContext("2d");
			var sctx = sc.cvs[0];
			var w = rc[2]-rc[0],
				h = rc[3]-rc[1];
			if(w>0&&h>0)
			{
				ctx.clearRect(0,0,200,200);
				ctx.drawImage(sctx,rc[0],rc[1],w,h,(200-4*w)*0.5,(200-4*h)*0.5,4*w,4*h);
			}					
		  }
	  }
   }) 
   Mouse.sDLG("up",function(e){
      if(TGame.selObj!=null)
	  {
		  TGame.selObj.status = 0;
	  }
   }); 
}(window))