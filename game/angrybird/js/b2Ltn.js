/*
* box2d监听器类
*/
(function(){
    B2Ltn =function()
	{       
		this.ltn = new b2ContactListener();
		this.initLtn();
	}
    B2Ltn.prototype.initLtn = function()
	{
	     var self = this;
		 this.ltn.BeginContact = function(con){           
		  };		
		  //碰撞后处理
		 this.ltn.PostSolve = function(con,imp)
		  {			  			 			  			  			 
			  //第一只鸟发射前不计
			  if(TGame.avaBirdIdx == 0&&TGame.currBird.getState()!="fly")
              {
				  return;
			  }
			  var v = imp.normalImpulses;
			  var ba = con.GetFixtureA().GetBody().GetUserData(),
				  bb = con.GetFixtureB().GetBody().GetUserData();
			  if(bb==null||ba==null||v[0]<1.0)
			  {
				  return;
			  }
			  var tmpSprite = ba;
			  //减少血量 
			  for(var i=0;i<2;i++)
			  {
				  //地板不参与计算
				  if(tmpSprite=="floor")
				  {
					tmpSprite = bb;
					continue;
				  }				  
				  //小鸟不参与计算,小鸟停止运动后死亡 
				  if(tmpSprite.constructor.ClassName==="Bird")
			      {
					//力量大于4显示碰撞效果  
                    if(v[0]>4)
					{
                       tmpSprite.effColl();
					}
					tmpSprite.isColled = true;
                    tmpSprite = bb;
					continue;				  
			      }
				  if(tmpSprite.isRemovable())
				  {
					  TGame.removableSprite[tmpSprite.name] = tmpSprite;
				  }
				  else
				  {
					  tmpSprite.reduceHP(v[0]);					 
				  }
				  tmpSprite = bb;
			  }			
		  }
	}
}())