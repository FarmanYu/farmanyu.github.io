/*
* Mario��
*/
(function(){
  //�������Sprite�̳�
     Mario = Sprite.extend({
     update:function()
	 {
	   var w = this.owner.w,
		   h = this.owner.h;
	   //����߽�ı�x�ٶȷ���
       if(this.x<20||this.x>w-20)
	   {
		   this.dx = -this.dx;
		   this.isXFlip = (this.dx<0);
	   };
	   this._super();
	 }
   })
   //ע���������๤��
   Mario.ClassName = "Mario";
   ClassFactory.regClass(Mario.ClassName,Mario);
}())