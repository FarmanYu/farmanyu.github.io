(function(win){
	var _Game = Game.extend({
		player:null,
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-500)*0.5;
	      scm.createScene([{"x":x,"w":500,"h":400,"name":"main"}]);
		  this.loadRes();
		},
		loadRes:function()
	    {
		  var self = this;
	      ResManager.loadRes("data/res.json",function(){
		  self.initSprite();
          self.run(60); 
	      });  
		},
	    initSprite:function()
	    {
           var sc = this.sceneManager.getScene("main");
		   //创建飞机
		   var p = sc.createRObj(Player.ClassName);
           p.setAnims(ResManager.getAnimationsByName("sprite","player"));
		   p.w = p.h = 60;
		   p.moveTo(100,100);
		   this.player = p;
		   //创建子弹
		   for(var i=0;i<30;i++)
		   {
			 var b = sc.createRObj(Bullet.ClassName);
             b.setAnims(ResManager.getAnimationsByName("sprite","b1"));
		     b.w = b.h =10;
			 b.dx = b.dy = 3;
			 b.moveTo(MathUtil.randInt(500),MathUtil.randInt(400));
		   }		   
		} 
	})
   //定义全局TGame
   win.TGame = new _Game();
}(window))