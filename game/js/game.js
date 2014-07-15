/*
* ball游戏
*/
(function(){
	 var g = new Game();
	  //创建游戏场景
	 function initGame()
	 {
	   //获取场景管理器
	   var scm = g.sceneManager; 
	   //创建场景
	   var sc = scm.createScene([{"w":400,"h":300}]);
	   initRenderObj(sc);
	 }
	 //创建游戏精灵
	 function initRenderObj(sc)
	 {
	   //随机创建20个小球
	   for(var i = 0;i<20;i++)
	   {
		 var obj = sc.createRObj(Ball.ClassName);
		 //设置随机位置
		 obj.moveTo(MathUtil.randInt(20,380),MathUtil.randInt(20,280));
		 //设置随机速度0~3
		 obj.dx = MathUtil.randInt(1,3);
		 obj.dy = MathUtil.randInt(1,3);
		 //设置随机颜色
		 obj.color = ColorUtil.rgb(MathUtil.randInt(255),MathUtil.randInt(255),MathUtil.randInt(255));
	   }
	 }
	 //初始游戏
	 initGame();
	 //开始飞奔
	 g.run(-1);

	 window.g = g;
}())