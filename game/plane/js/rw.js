/*
* Reward������
*/
(function(){
  //�������Sprite�̳�
   Reward = Sprite.extend({
   init:function(param)
   {
	   this._super();
	   this.setAnims(ResManager.getAnimationsByName("sprite",param.animName));	
	   this.groupID = 2;	
       var hw = (param.bBox&&param.bBox[0])||this.w*0.5,
           hh = (param.bBox&&param.bBox[1])||this.h*0.5; 
	   this.dx = this.dy = 1.5;
	   this.bBox = new ABBox(this.x,this.y,hw,hh);  
	   //�Ƿ������ײ���
	   this.isCalcCollide = true;
	   this.zIdx = 16;
   },
   //��дupdate
   update:function()
   {	  
	   var w = this.owner.w,
		   h = this.owner.h;	  
	   //����߽�ı��ٶȷ���
       if(this.x<this.w*0.5||this.x>w-this.w*0.5)
	   {
		   this.dx = -this.dx;		   
	   };
       if(this.y<this.h*0.5||this.y>h-this.h*0.5)
	   {
		   this.dy = -this.dy;
	   };	  
	   //���ø��෽��
	   this._super();
   }
  });
  Reward.ClassName = "Reward";
  //ע��Reward��
  ClassFactory.regClass(Reward.ClassName,Reward);
}())