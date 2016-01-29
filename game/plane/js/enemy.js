/*
* Enemy��
*/
(function(){
  //�������Sprite�̳�
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
	 //���ӵ������¼� 
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
  //Boss��
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
  //��������״̬��1
  var FreeState1 = State.extend({  
	 update:function()
	  {
        var e = this.ctx.owner;
		//�����ӵ�
        e.createBullet();
		//�ƶ�
 	    e.moveStep();
	  }
  });
  //��������״̬1
  var DieState1 = DieState.extend({
	  enter:function()
      {
		  var o = this.ctx.owner;
          //�ӷ�
		  if(o.groupID == 1)
		  {
			  ShootGame.cfg.score+=o.score;
		  }		  
		  var ox = o.x,oy = o.y;
		   //��������Ч��
		  o.owner.createBoom(o.x,o.y,function(){
		   //��������
             if(o.gCfg.rw!=null)
			 {
                var rw = o.owner.createRObj(Reward.ClassName,[ShootGame.cfg.sDef[o.gCfg.rw]]);
				rw.moveTo(ox,oy);
			 }
		  });
		  o.owner.removeRObj(o);
	  } 
  });
  //��������״̬��2
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
		//�����ƶ�
		if(e.x<=hw||e.x>e.owner.w-hw)
		{
		  e.dx = -e.dx;
		}		
	  }
  }); 
  //��������״̬2
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
  //ע��Enemy��
  ClassFactory.regClass(Enemy.ClassName,Enemy);
  ClassFactory.regClass(Boss.ClassName,Boss); 
}())