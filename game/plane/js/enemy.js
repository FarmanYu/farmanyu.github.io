/*
* Enemy类
*/
(function(){
  //从引擎的Sprite继承
   Enemy = Shooter.extend({   
     init:function(param)
     {
	  this._super(param);	   	  
	  this.score = param.score;
      this.sCtx.regState(new FreeState1("free",this.sCtx));
	  this.sCtx.regState(new DieState1("die",this.sCtx));
	  this.sCtx.changeState("free");	 
     },	
     update:function()
	 {
        this._super();
       	if(this.getCurrentAnim().name=="hurt"){
			if(--this.hCount==0)
			{
			  this.setCAnim("def");
			  this.hCount = 5;
			}			
		 }        
	 },
	 //被子弹击中事件 
     onCollide:function(bullet)
     {
       if(this.getAnim("hurt")!=null)
	   {
		 this.setCAnim("hurt");
		 this.hCount = 5;
	   }	        
	   this._super(bullet);
     } 	
   });
  //Boss类
  Boss = Enemy.extend({
   init:function(param)
	{
      this._super(param);  
	  this.name = "Boss";
	  this.sCtx.regState(new FreeState2("free1",this.sCtx));
	  this.sCtx.regState(new DieState2("die",this.sCtx));
	  var freeState = this.sCtx.getState("free");
	  freeState.change = function()
	   {
		  var e = this.ctx.owner;
		  if(e.y>180)
		   {
			  this.ctx.changeState("free1");
		   }
	   }
      freeState.update = function()
	   {
            var e = this.ctx.owner;
   		    e.moveStep();
	   } 
	  this.sCtx.changeState("free");
	}
  });
  //定义自由状态类1
  var FreeState1 = State.extend({  
	 update:function()
	  {
        var e = this.ctx.owner;
		//发射子弹
        e.createBullet();
		//移动
 	    e.moveStep();
	  }
  });
  //定义死亡状态1
  var DieState1 = DieState.extend({
	  enter:function()
      {
		  var o = this.ctx.owner;
          //加分
		  if(o.groupID == 1)
		  {
			  ShootGame.cfg.score+=o.score;
		  }		  
		  var ox = o.x,oy = o.y;
		   //创建爆破效果
		  o.owner.createBoom(o.x,o.y,function(){
		   //死亡后奖励
             if(o.gCfg.rw!=null)
			 {
                var rw = o.owner.createRObj(Reward.ClassName,[ShootGame.cfg.sDef[o.gCfg.rw]]);
				rw.moveTo(ox,oy);
			 }
		  });
		  o.owner.removeRObj(o);
	  } 
  });
  //定义自由状态类2
  var FreeState2 = FreeState1.extend({
	 enter:function()
	  {
        var e = this.ctx.owner;
		e.dy = 0;
		e.dx = -1;
		this._super();
	  },	  
	 update:function()
	  {
        var e = this.ctx.owner;   		
		this._super();
		var hw = e.w*0.5;
		//左右移动
		if(e.x<=hw||e.x>e.owner.w-hw)
		{
		  e.dx = -e.dx;
		}		
	  }
  }); 
  //定义死亡状态2
  var DieState2 = DieState1.extend({
	  enter:function()
      {
          var o = this.ctx.owner;		  
          this._super();		
	      o.owner.isOver = true;		  
	  } 
  });
  Enemy.ClassName = "Enemy";
  Boss.ClassName = "Boss";
  //注册Enemy类
  ClassFactory.regClass(Enemy.ClassName,Enemy);
  ClassFactory.regClass(Boss.ClassName,Boss); 
}())