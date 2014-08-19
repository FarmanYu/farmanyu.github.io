(function(win){
	var _Game = Game.extend({
		map:null,
	    nest:[0,0],
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-800)*0.5;
	      var sc = scm.createScene([{"x":x,"w":800,"h":600,"name":"main"}]);
		  //设置场景背景
          sc.setBGImg("../../imgs/bk2.png",2);
		  this.loadRes(sc);
		},
		//加载资源
	    loadRes:function(scene)
	    {
		  var self = this;
		  ResManager.loadRes("data/res.json",function(){
			//创建精灵
			self.initSprite();
			//开始飞奔
			self.run(10); 
		  });      
	    },        
		//移出地图上物体 
        removeMSprite:function(r,c)
        {
	      var sc = this.sceneManager.getScene("main");		 
		  var obj = this.map.getMObj(r,c);
		  if(obj)
		  {
			this.map.clearMObj(r,c);
	        sc.removeRObj(obj.mObj);
		  }		  
        },
	    //随机产生几个对象
		createSprite:function(num,mFlag,animName)
		{
           var sc = this.sceneManager.getScene("main");			   
           for(var i =0;i<num;i++)
		   {
			  var sprite = null;
			  if(mFlag==Map.SFlag.ANT)
			  {
				sprite = sc.createRObj(Ant.ClassName);
			  }
			  else
			  {
				sprite = sc.createRObj(Sprite.ClassName);
			  }			  
              sprite.setAnims(ResManager.getAnimationsByName("sprite",animName));
			  var p = this.map.getRandNull();
              var p1 = this.map.mapPosToSC(p[0],p[1]); 
			  sprite.moveTo(p1[0],p1[1]);
			  if(mFlag==Map.SFlag.NEST)
			  {
				  this.nest = p1;
			  }
              this.map.setMObj(p[0],p[1],{"mFlag":mFlag,"mObj":sprite}); 
		   }
		},
	    initSprite:function()
	    {
           var sc = this.sceneManager.getScene("main");	
		   var r = 9,c=11;		  
		   //创建地图
		   this.map = sc.createRObj(Map.ClassName,[r,c,"bar",32,32]);
           this.map.reset(); 		   
		   //创建水
		   this.createSprite(10,Map.SFlag.WATER,"water");
           //创建食物
		   this.createSprite(16,Map.SFlag.FOOD,"food");
		   //创建毒物
           this.createSprite(6,Map.SFlag.POISON,"poison"); 
           //创建巢穴
		   this.createSprite(1,Map.SFlag.NEST,"nest"); 		  
		   //创建蚂蚁
		   this.createSprite(10,Map.SFlag.ANT,"ant");
		} 
	})
   //定义全局TGame
   win.TGame = new _Game();  
}(window))