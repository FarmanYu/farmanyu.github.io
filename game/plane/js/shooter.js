/*
* Shooter��
*/
(function(){
  //�������Sprite�̳�
   Shooter = Sprite.extend({   
   init:function(param)
   {
	   this._super(name);
	   param = PubUtil.merge(param,{"animName":"em0","hp":100,"bSpeed":4});
	   //�������ò���������Ϸ�����ļ��ж�ȡ
	   this.gCfg = param;
	   //hp,��֪����ʲô
	   this.hp = param.hp;	    
	   //�ӵ��ٶ�
 	   this.bSpeed = param.bSpeed;
	   //�󶨵������
	   this.tags = param.tags;	   	   
	   this.tagCurCount = new Array(this.tags.length);
	   //����groupID = 1��ʾ���� 0:��ʾ���
	   this.groupID = 1;	
	   //�з�Ŀ�����
	   this.targetID = 0;
	   this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));		        
	   this.bClassName = Bullet.ClassName;	  
	   this.sCtx = new StateContext(this);  
	   this.regState();
	   this.sCtx.changeState("free");	   
	   var hw = (param.bBox&&param.bBox[0])||this.w*0.5,
           hh = (param.bBox&&param.bBox[1])||this.h*0.5; 
	   this.bBox = new ABBox(this.x,this.y,hw,hh);  
	   //�Ƿ������ײ���
	   this.isCalcCollide = true;
	   this.zIdx = 10;
   },
   //ע��״̬��
   regState:function()
   {		   
	this.sCtx.regState(new FreeState("free",this.sCtx));
	this.sCtx.regState(new DieState("die",this.sCtx));
   },   
   //�����ӵ�
   createBullet:function(tagIdx)
   {
	  //����game���ô����ӵ�  
      var tags = (tagIdx==null)?this.tags:this.tags[tagIdx];
	  for(var i = 0;i<tags.length;i++)
	   {
		  var tag = tags[i],
		      bcfg = ShootGame.cfg.sDef[tag[2]],
			  param = {"os":this,"animName":bcfg.animName,"attack":bcfg.attack,"targetID":this.targetID,"dx":0,"dy":this.dy+this.bSpeed};
          this.tagCurCount[i] = this.tagCurCount[i]||0;
		  //������Է���
		  if(this.tagCurCount[i]++==tag[4])
		  {
			  this.tagCurCount[i]=0;
			  //���ó����ഴ���ӵ��ķ���
			  this.owner.cbFn[tag[3]].call(this.owner,this.x+tag[0],this.y+tag[1],this.bClassName,param); 
		  }		  
	   }
   },
   //��дupdate
   update:function()
   {	
     //���°�Χ������
     this.bBox.x = this.x;
	 this.bBox.y = this.y; 
	 this.sCtx.update();  
	 //������Ļ�¶���ɾ��
	 if(this.y>0)
	 {
	   this.offScreenRemove();
	 }
   },
   //���ӵ����лᴥ���¼� 
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
  //ע��Shooter��
  ClassFactory.regClass(Shooter.ClassName,Shooter);
  //����״̬��,������ʵ��
  FreeState = State.extend({   	 
    }); 
  //��������״̬��   
  DieState = State.extend({
	   enter:function()
       {
          var o = this.ctx.owner;		
		  //��������Ч��
		  o.owner.createBoom(o.x,o.y);
		  o.owner.removeRObj(o);
	   }		    
   });
}())