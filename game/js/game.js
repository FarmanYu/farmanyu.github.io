/*
* ball��Ϸ
*/
(function(){
	 var g = new Game();
	  //������Ϸ����
	 function initGame()
	 {
	   //��ȡ����������
	   var scm = g.sceneManager; 
	   //��������
	   var sc = scm.createScene([{"w":400,"h":300}]);
	   initRenderObj(sc);
	 }
	 //������Ϸ����
	 function initRenderObj(sc)
	 {
	   //�������20��С��
	   for(var i = 0;i<20;i++)
	   {
		 var obj = sc.createRObj(Ball.ClassName);
		 //�������λ��
		 obj.moveTo(MathUtil.randInt(20,380),MathUtil.randInt(20,280));
		 //��������ٶ�0~3
		 obj.dx = MathUtil.randInt(1,3);
		 obj.dy = MathUtil.randInt(1,3);
		 //���������ɫ
		 obj.color = ColorUtil.rgb(MathUtil.randInt(255),MathUtil.randInt(255),MathUtil.randInt(255));
	   }
	 }
	 //��ʼ��Ϸ
	 initGame();
	 //��ʼ�ɱ�
	 g.run(-1);

	 window.g = g;
}())