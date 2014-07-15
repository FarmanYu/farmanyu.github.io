/*
* Player类
*/
(function(){
   //从引擎的Sprite继承
   Player = Shooter.extend({   
   init:function(param)
   {	   
	   this._super(param);	   		
	   this.life = param.life;
	   this.groupID = 0;	  
	   this.targetID = 1;
       this.updateState();
	   //防护层
	   this.shield = null;
	   this.sCtx.changeState("free");
	   this.zIdx = 18;
   },
   //更新自由移动状态
   updateState:function()
   {
	   var freeState = this.sCtx.getState("free");
	   var dState = this.sCtx.getState("die");
	   freeState.update = function()
		 { 
		   var player  = this.ctx.owner;
		   var isKeyPress = false;
		   if(Key.pressed(Key.W))
		    {
			  player.up();        	
			  isKeyPress = true;
		    }
		   if(Key.pressed(Key.S))
		    {
			  player.down(); 
			  isKeyPress = true;
		    }  
		   if(Key.pressed(Key.A))
		   {
			 player.left();    
			 isKeyPress = true;
		   }
		   if(Key.pressed(Key.D))
		   {
			 player.right(); 
			 isKeyPress = true;
		   }   
           if(Key.pressed(Key.J))
		   {
			 player.createBullet();
		   }
		   if(!Key.pressed(Key.J))
		   {
			 player.tagCurCount[0] = player.tags[0][4];
		   }
		   if(!isKeyPress)
		   {
			 player.setCAnim("def");
			 player.animsCtrl.isCycle = true;			
		   } 
		   //检测是否碰撞到敌机
		   var robj = player.owner.rObjs;
	       for(var i=0;i<robj.length;i++)
	       {
		     if(player.isCalcCollide&&robj[i].isCalcCollide&&(robj[i].targetID==player.groupID||robj[i].groupID==2))
		     {	
			   //检测是否碰撞
			  if(player.bBox.isCollide(robj[i].bBox))
			  {
				 player.onCollide(robj[i]);
				 break;
			  }
		    }
	       }
		 }
		//修改死亡状态
		dState.enter = function()
	    {
		  var o = this.ctx.owner;	
		  if(--o.life>0)
		  {
		    o.isVisible = false;
            o.owner.createBoom(o.x,o.y,function(){
              //创建防护层
			  o.createShield();			  
              o.sCtx.changeState("free");
		    });			
          }	
		  else
	      {
			  o.owner.isOver = true;
		  } 
		} 
   },
   left:function()
   {	   
	   if(this.getCurrentAnim().name!=="left")this.setCAnim("left");
	   this.animsCtrl.isCycle = false;
	   if(this.x>this.w*0.5)
	   {
		   this.move(-this.dx,0);
	   }
   },
   right:function()
   {
       if(this.getCurrentAnim().name!=="right")this.setCAnim("right");
	   this.animsCtrl.isCycle = false;
	   if(this.x<(this.owner.w-this.w*0.5))
	   {
		   this.move(this.dx,0);
	   } 
   },
   up:function()
   {
	   if(this.y>this.h*0.5)
	   {
		   this.move(0,-this.dy);
	   } 
   },
   down:function()
   {    
	   if(this.y<(this.owner.h-this.h*0.5))
	   {
		   this.move(0,this.dy);
	   } 
   },
   createShield:function(param)
   {
	  param = PubUtil.merge(param,{"os":this,"bBox":[60,60]});
      if(this.shield==null)
	   {
		 this.shield = this.owner.createRObj(Shield.ClassName,[param]);
	   }
   },
   onCollide:function(obj)
   {
      //如果是奖励 
	  if(obj.groupID==2)
	  {
		this.owner.removeRObj(obj);
		this.createShield({"autoClear":false});	
	  }
	  else
	  {
		this.sCtx.changeState("die");
	  }
   }
  });
  Player.ClassName = "Player"; 
  //注册Player类
  ClassFactory.regClass(Player.ClassName,Player);
}())