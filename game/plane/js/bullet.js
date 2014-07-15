/*
* Bullet类
*/
(function(){
  //从引擎的Sprite继承
   Bullet = Sprite.extend({   
   init:function(param)
   {	  
      this._super();
  	  param = PubUtil.merge(param,{"os":null,"animName":"b3","attack":100,"targetID":1});	  	  
	  this.attack = param.attack;
	  this.targetID = param.targetID;
	  this.os = param.os;
	  this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));
	  this.bBox = new ABBox(this.x,this.y,this.w*0.5,this.h*0.5);
	  this.zIdx = 20;
   }, 
   //重写update
   update:function()
   {	
	 this._super();	
	 //targets
	 var robj = this.owner.rObjs;
	 for(var i=0;i<robj.length;i++)
	  {
		 if(this!==robj[i]&&this.os!==robj[i]&&robj[i].isCalcCollide&&robj[i].groupID==this.targetID)
		  {	
			 //检测是否碰撞
			 if(this.bBox.isCollide(robj[i].bBox))
			  {
				 robj[i].onCollide(this);
				 this.owner.removeRObj(this);
				 return;
			  }
		  }
	  }
   }
  });  
  Bullet.ClassName = "Bullet";  
  //注册Bullet类
  ClassFactory.regClass(Bullet.ClassName,Bullet); 
}())