/*
* Shooter类
*/
(function(){
  //从引擎的Sprite继承
   Shooter = Sprite.extend({   
   init:function(param)
   {
	   this._super(name);
	   param = PubUtil.merge(param,{"animName":"em0","hp":100,"bSpeed":4});
	   //基本配置参数，从游戏配置文件中读取
	   this.gCfg = param;
	   //hp,都知道是什么
	   this.hp = param.hp;	    
	   //子弹速度
 	   this.bSpeed = param.bSpeed;
	   //绑定的射击点
	   this.tags = param.tags;	   	   
	   this.tagCurCount = new Array(this.tags.length);
	   //分组groupID = 1表示敌人 0:表示玩家
	   this.groupID = 1;	
	   //敌方目标组号
	   this.targetID = 0;
	   this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));		        
	   this.bClassName = Bullet.ClassName;	  
	   this.sCtx = new StateContext(this);  
	   this.regState();
	   this.sCtx.changeState("free");	   
	   var hw = (param.bBox&&param.bBox[0])||this.w*0.5,
           hh = (param.bBox&&param.bBox[1])||this.h*0.5; 
	   this.bBox = new ABBox(this.x,this.y,hw,hh);  
	   //是否进行碰撞检测
	   this.isCalcCollide = true;
	   this.zIdx = 10;
   },
   //注册状态类
   regState:function()
   {		   
	this.sCtx.regState(new FreeState("free",this.sCtx));
	this.sCtx.regState(new DieState("die",this.sCtx));
   },   
   //创建子弹
   createBullet:function(tagIdx)
   {
	  //根据game配置创建子弹  
      var tags = (tagIdx==null)?this.tags:this.tags[tagIdx];
	  for(var i = 0;i<tags.length;i++)
	   {
		  var tag = tags[i],
		      bcfg = ShootGame.cfg.sDef[tag[2]],
			  param = {"os":this,"animName":bcfg.animName,"attack":bcfg.attack,"targetID":this.targetID,"dx":0,"dy":this.dy+this.bSpeed};
          this.tagCurCount[i] = this.tagCurCount[i]||0;
		  //如果可以发射
		  if(this.tagCurCount[i]++==tag[4])
		  {
			  this.tagCurCount[i]=0;
			  //调用场景类创建子弹的方法
			  this.owner.cbFn[tag[3]].call(this.owner,this.x+tag[0],this.y+tag[1],this.bClassName,param); 
		  }		  
	   }
   },
   //重写update
   update:function()
   {	
     //更新包围盒坐标
     this.bBox.x = this.x;
	 this.bBox.y = this.y; 
	 this.sCtx.update();  
	 //超出屏幕下端则删除
	 if(this.y>0)
	 {
	   this.offScreenRemove();
	 }
   },
   //被子弹击中会触发事件 
   onCollide:function(bullet)
   {
	   this.hp -= bullet.attack;
	   if(this.hp<=0)
	   {
		   this.sCtx.changeState("die");
	   }
   }
  });   
  Shooter.ClassName = "Shooter";
  //注册Shooter类
  ClassFactory.regClass(Shooter.ClassName,Shooter);
  //定义状态类,由子类实现
  FreeState = State.extend({   	 
    }); 
  //定义死亡状态类   
  DieState = State.extend({
	   enter:function()
       {
          var o = this.ctx.owner;		
		  //创建爆破效果
		  o.owner.createBoom(o.x,o.y);
		  o.owner.removeRObj(o);
	   }		    
   });
}())