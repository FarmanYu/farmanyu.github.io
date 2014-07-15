/*
* box2d��������
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
		  //��ײ����
		 this.ltn.PostSolve = function(con,imp)
		  {			  			 			  			  			 
			  //��һֻ����ǰ����
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
			  //����Ѫ�� 
			  for(var i=0;i<2;i++)
			  {
				  //�ذ岻�������
				  if(tmpSprite=="floor")
				  {
					tmpSprite = bb;
					continue;
				  }				  
				  //С�񲻲������,С��ֹͣ�˶������� 
				  if(tmpSprite.constructor.ClassName==="Bird")
			      {
					//��������4��ʾ��ײЧ��  
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