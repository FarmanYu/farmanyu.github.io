/*
* Ant��
*/
(function(){
  //�������RenderObj�̳�
   Ant = Sprite.extend({  
   init:function()
   {
	 this.sCtx = new StateContext(this);     
	 this.regState();
	 this.sCtx.changeState("goFood");
     this._super();
   },
   //ע������״̬��
   regState:function()
   {
	   this.sCtx.regState(new FFoodState("goFood",this.sCtx));
       this.sCtx.regState(new FHomeState("goHome",this.sCtx));
	   this.sCtx.regState(new FWaterState("goWater",this.sCtx));
       this.sCtx.regState(new FDeadState("goDead",this.sCtx));
   },
   //�¸�λ���Ƿ���ƶ�
   testMove:function(nx,ny)
   {   	   
	   var p = TGame.map.mapSCPos(nx,ny);
	   return !TGame.map.isBar(p[0],p[1]);
   }, 
   //�Ƿ��ҵ�Ŀ��
   isFindTarget:function(mFlag)
   {
      //��ȡ��ǰλ��
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
   //�Ƿ�����ʳ��
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
   //����ƶ�
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
   //��дupdate
   update:function()
   {
	   this.sCtx.update();
   }
  });
  Ant.ClassName = "Ant";
  //�������ϸ���״̬��
  var FFoodState = State.extend({
      change:function()
	  {
	    if(this.ctx.owner.isFindFood())
	    {
		  //�ؼ�
		  this.ctx.changeState("goHome");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //�ж�����
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
		  //����������
          TGame.createSprite(1,Map.SFlag.ANT,"ant");
		  //��ˮ
		  this.ctx.changeState("goWater");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //�ж�����
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
		  //��ʳ��
		this.ctx.changeState("goFood");
		}
		else if(this.ctx.owner.isFindPoison())
		{
          //�ж�����
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
  //ע��������
  ClassFactory.regClass(Ant.ClassName,Ant);
}())