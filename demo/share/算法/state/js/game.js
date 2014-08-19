(function(win){
	var _Game = Game.extend({
		map:null,
	    nest:[0,0],
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //��������
          var x = (document.body.clientWidth-800)*0.5;
	      var sc = scm.createScene([{"x":x,"w":800,"h":600,"name":"main"}]);
		  //���ó�������
          sc.setBGImg("../../imgs/bk2.png",2);
		  this.loadRes(sc);
		},
		//������Դ
	    loadRes:function(scene)
	    {
		  var self = this;
		  ResManager.loadRes("data/res.json",function(){
			//��������
			self.initSprite();
			//��ʼ�ɱ�
			self.run(10); 
		  });      
	    },        
		//�Ƴ���ͼ������ 
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
	    //���������������
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
		   //������ͼ
		   this.map = sc.createRObj(Map.ClassName,[r,c,"bar",32,32]);
           this.map.reset(); 		   
		   //����ˮ
		   this.createSprite(10,Map.SFlag.WATER,"water");
           //����ʳ��
		   this.createSprite(16,Map.SFlag.FOOD,"food");
		   //��������
           this.createSprite(6,Map.SFlag.POISON,"poison"); 
           //������Ѩ
		   this.createSprite(1,Map.SFlag.NEST,"nest"); 		  
		   //��������
		   this.createSprite(10,Map.SFlag.ANT,"ant");
		} 
	})
   //����ȫ��TGame
   win.TGame = new _Game();  
}(window))