/*
* GamingScene��
*/
(function(){
  //�������Scene�̳�
  GamingSC = Scene.extend({     
	  init:function(x,y,name)
	  {
		  this._super({"x":x,"y":y,"w":400,"h":600,"name":name});		  
		  this.player = null;
		  this.bg = null;
		  this.lifeTxt = null;
		  this.scoreTxt = null;
		  this.createPlayerFromCfg();
		  this.initBg();		  		  
		  this.initFn();		  
		  this.initUI();
		  this.initLtn();
	  },
	  //��ʼ��UI
	  initUI:function()
      {	   
		 this.lifeTxt = $("<div id='pLifeTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:10px'>Life:0</div>");
		 this.scoreTxt = $("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:260px'>Score:0</div>");
		 this.holder.append(this.lifeTxt);		
		 this.holder.append(this.scoreTxt);
	  },
	  //��ʼ������
	  createPlayerFromCfg:function()
      {		
         var pCfg = ShootGame.cfg.sDef.player;
		 this.player = this.createRObj(Player.ClassName,[pCfg]);		 				 
		 this.player.moveTo(200,550);
		 this.player.dx = this.player.dy = 3;
	  },
	  //��ʼ������
	  initBg:function()
	  {
		 var img = ResManager.getResByName("image","bg1");
		 this.bg = this.createRObj(Background.ClassName,[400,600,ShootGame.cfg.bgH,img.hEle]); 
		 this.bg.dy = ShootGame.cfg.bgScrollSpeed;
	  },
      //��ʼ��������
      initLtn:function()
      {
		 var ltn = new SceneEventListener();
		 this.currEneItem = null;
		 var self = this;
		 ltn.onAfterRender = function()
		 {
            //��ȡ��ǰ�ؿ����ô�������
			var lv = ShootGame.cfg.lev[ShootGame.cfg.level];
            if(!self.currEneItem&&lv.enemys.length>0)
			{
			   self.currEneItem = lv.enemys.shift();	
			}
			var e = self.currEneItem;
			if(e&&self.bg.scrollY>e.dist)
			{				
                var es = e.es;				
				for(var i=0;i<es.length;i++)
				{
					self.createEnemy(es[i][0],es[i][1],es[i][3],ShootGame.cfg.sDef[es[i][2]]);
				}
				self.currEneItem = null;
			}			
			//����UI
            self.lifeTxt.text("Life:"+self.player.life);
            self.scoreTxt.text("Score:"+ShootGame.cfg.score);
		 }
		 this.addListener(ltn);
	  },
	  initFn:function()
	  {
		  this.cbFn ={
			 "cb0":this.createBullet,
             "cb1":this.createCirBullet
		  };		  
      },  
      //�����ӵ�
	  createBullet:function(x,y,bClass,param)
      {
         var bul = this.createRObj(bClass,[param]);
         bul.moveTo(x,y);
		 bul.dx = param.dx;
		 bul.dy = param.dy;
	  },
      //���������ӵ�
	  createCirBullet:function(x,y,bClass,param)
      {
		var r = 3;
        for(var i=0;i<360;i+=30)
	    {
		  var dy = r*Math.sin(MathUtil.deg2rad(i)),
			  dx = r*Math.cos(MathUtil.deg2rad(i));
		  param.dx = dx;
		  param.dy = dy;
	      this.createBullet(x,y,bClass,param);
	    }
	  },
      //������ը����
	  createBoom:function(x,y,callBack)
	   {
		var obj =  this.createRObj(Sprite.ClassName);
		obj.setAnims(ResManager.getAnimationsByName("sprite","boom0"));
		obj.moveTo(x,y);
		//��дupdate����
        obj.update = function()
		 {          
          //���һ֡������Ϻ�����
		  if(this.animsCtrl.isLastFrame())
			{
			  this.owner.removeRObj(this);			  
			  callBack&&callBack();
		    }
		 }
	   },
	   //�����������ݴ�������
      createEnemy:function(x,y,eClass,cfgData)
      {
	    var ene = this.createRObj(eClass,[cfgData]);	        
        ene.moveTo(x,y);
		ene.dy = ShootGame.cfg.bgScrollSpeed+(cfgData.speed||0.1);
		return ene;
      }
   });
  GamingSC.ClassName = "GamingSC";
  //ע�����г�����
  ClassFactory.regClass(GamingSC.ClassName,GamingSC);
}()) 