/*
* Shield��
*/
(function(){
  //�������Sprite�̳�
   Shield = Sprite.extend({   
   init:function(param)
   {	  
      this._super();
  	  param = PubUtil.merge(param,{"autoClear":true,"lifeTime":1000,"os":null,"animName":"shield","hp":100});	  	  
	  this.targetID = param.os.targetID;
	  this.groupID = param.os.groupID;
	  this.hp = param.hp;
	  this.os = param.os;
	  this.autoClear = param.autoClear;
	  this.lifeTime = param.lifeTime;	 
	  this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));
	  this.animsCtrl.isCycle = false;
	  this.os.isCalcCollide = false;
	  var hw = (param.bBox&&param.bBox[0])||this.w*0.5,
          hh = (param.bBox&&param.bBox[1])||this.h*0.5; 
	  this.bBox = new ABBox(this.x,this.y,hw,hh);  
	  this.zIdx = this.os.zIdx-1;
	  this.isCalcCollide = true;
   }, 
   //��дupdate
   update:function()
   {
     this.moveTo(this.os.x,this.os.y);
	 this.bBox.x = this.x;
	 this.bBox.y = this.y; 
	 //���һ֡��ʼ����
	 if(this.animsCtrl.isLastFrame()&&!this.isStartClear)
	   {
		 this.isStartClear = true;
         this.sTime = FrameState.currTime; 
	     this.sHp = this.hp;
		 this.os.isVisible = true;
	   }
     if(this.isStartClear)
	   {
		
		 //����ahpha
	     this.rAlpha = (this.autoClear)?(1-(FrameState.currTime-this.sTime)/this.lifeTime):this.sHp/this.hp;
		 if((!this.autoClear&&this.sHp<0)||(this.autoClear&&(FrameState.currTime-this.sTime>this.lifeTime)))
	      {            
			this.owner.removeRObj(this);
			this.os.isCalcCollide = true;
			this.os.shield = null;
	      }
	   }
   },
   //��дrender
   render:function(ctx)
   {
	 ctx.globalCompositeOperation = "lighter";
	 ctx.globalAlpha = this.rAlpha;
	 this._super(ctx);
   },
   onCollide:function(bullet)
   {
	 if(!this.autoClear&&this.isStartClear)
	   {
		 this.sHp -= bullet.attack;
       }
   }
  });
  Shield.ClassName = "Shield";  
  //ע��Shield��
  ClassFactory.regClass(Shield.ClassName,Shield); 
}())