/*
* Ant类
*/
(function(){
  //从引擎的RenderObj继承
   Ant = Sprite.extend({  
   init:function()
   {
	 this.sCtx = new StateContext(this);     
	 this.regState();
	 this.sCtx.changeState("goFood");
     this._super();
   },
   //注册蚂蚁状态类
   regState:function()
   {
	   this.sCtx.regState(new FFoodState("goFood",this.sCtx));
       this.sCtx.regState(new FHomeState("goHome",this.sCtx));
	   this.sCtx.regState(new FWaterState("goWater",this.sCtx));
       this.sCtx.regState(new FDeadState("goDead",this.sCtx));
   },
   //下个位置是否可移动
   testMove:function(nx,ny)
   {   	   
	   var p = TGame.map.mapSCPos(nx,ny);
	   return !TGame.map.isBar(p[0],p[1]);
   }, 
   //是否找到目标
   isFindTarget:function(mFlag)
   {
      //获取当前位置
	   var p = TGame.map.mapSCPos(this.x,this.y);
	   var o = null;
	   if((o=TGame.map.getMObj(p[0],p[1]))!=null)
	   {
		   if(o.mFlag==mFlag)
		   {
			   TGame.removeMSprite(p[0],p[1]);
			   return true;
		   }		   		   
	   }               
	   return false; 
   },
   //是否碰到食物
   isFindFood:function()
   {
	  return this.isFindTarget(Map.SFlag.FOOD);
   },
   isFindHome:function()
   {
      return this.x==TGame.nest[0]&& this.y==TGame.nest[1] 
   },
   isFindWater:function()
   {
      return this.isFindTarget(Map.SFlag.WATER);
   },
   isFindPoison:function()
   {
      return this.isFindTarget(Map.SFlag.POISON);
   },
   //随机移动
   randMove:function()
   { 
	   var dy = [-32,32,0,0],dx=[0,0,-32,32];
	   var o = MathUtil.randInt(4);
	   var nx = this.x+dx[o];
	   var ny = this.y+dy[o];
       if(this.testMove(nx,ny))
	   {
		   this.moveTo(nx,ny);
	   }	   
   },
   //重写update
   update:function()
   {
	   this.sCtx.update();
   }
  });
  Ant.ClassName = "Ant";
  //定义蚂蚁各种状态类
  var FFoodState = State.extend({
      change:function()
	  {
	    if(this.ctx.owner.isFindFood())
	    {
		  //回家
		  this.ctx.changeState("goHome");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //中毒死亡
          this.ctx.changeState("goDead");
		}
	  },
	  update:function()
	  {
         this.ctx.owner.randMove();
	  }
   });
   var FHomeState = State.extend({
      change:function()
	  {
	    if(this.ctx.owner.isFindHome())
	    {
		  //产生新蚂蚁
          TGame.createSprite(1,Map.SFlag.ANT,"ant");
		  //找水
		  this.ctx.changeState("goWater");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //中毒死亡
          this.ctx.changeState("goDead");
		}
	  },
	  update:function()
	  {		
         if(this.ctx.owner.x!=TGame.nest[0])
			this.ctx.owner.x+=(this.ctx.owner.x<TGame.nest[0])?32:-32;
		 if(this.ctx.owner.y!=TGame.nest[1])
            this.ctx.owner.y+=(this.ctx.owner.y<TGame.nest[1])?32:-32;
	  }
   });
   var FWaterState = State.extend({
      change:function()
	  {
	    if(this.ctx.owner.isFindWater())
		{
		  //找食物
		this.ctx.changeState("goFood");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //中毒死亡
          this.ctx.changeState("goDead");
		}
	  },
	  update:function()
	  {
        this.ctx.owner.randMove();
	  }
   });
   var FDeadState = State.extend({
      change:function()
	  {
	   	return;
	  },
	  update:function()
	  {
		var s = this.ctx.owner;
        s.owner.removeRObj(s);
	  }
   });
  //注册蚂蚁类
  ClassFactory.regClass(Ant.ClassName,Ant);
}())