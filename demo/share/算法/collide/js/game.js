(function(win){
	var _Game = Game.extend({
		//记录碰撞物体
		cObjs:[],
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-500)*0.5;
	      scm.createScene([{"x":x,"w":500,"h":400,"name":"main"}]);
		  this.initSprite();
		  this.setBBox(0);
		  this.run(60);
		},
        //给精灵设置包围盒，0:圆形，1:矩形,2:凸多边形
		setBBox:function(type)
		{
		   var bbox = null;
           for(var i=0,len = this.cObjs.length;i<len;i++)
		   {
			  var b = this.cObjs[i];
              switch(type)
			  {
				  case 0:
					  bbox = new RBBox(b.x,b.y,b.w*0.5);
					  break;
                  case 1:
					  bbox = new ABBox(b.x,b.y,b.w*0.5,b.h*0.5);
					  break;
				  case 2:
					  var pArr = [-15,15,0,19,15,15,10,-10,-25,-15];
					  bbox = new PBBox(b.x,b.y,pArr);
					  break;
			  }
			  //设置包围盒			
			  b.setBBox(bbox);
		   }
		},
	    initSprite:function()
	    {
           var sc = this.sceneManager.getScene("main");		 
		   //创建碰撞物体
		   for(var i=0;i<20;i++)
		   {
			 var b = sc.createRObj(CObj.ClassName);
			 b.w = b.h = MathUtil.randInt(25,45);		
			 b.moveTo(MathUtil.randInt(50,500),MathUtil.randInt(50,400));
			 b.dx = MathUtil.randInt(2,5);
			 b.dy = MathUtil.randInt(2,5);
			 this.cObjs.push(b);
		   }		   
		} 
	})
   //定义全局TGame
   win.TGame = new _Game();
}(window))