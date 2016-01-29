/*
* Ball������
*/
(function(){
  //�������RenderObj�̳�
   Ball = RenderObj.extend({
   init:function(name,r)
   {
	   //����뾶
	   this.r = r||10;
	   this.color = "white";
	   this._super(name);	  
   },
   //��дupdate
   update:function()
   {
	   var w = this.owner.w,
		   h = this.owner.h;
	   //����߽�ı��ٶȷ���
       if(this.x<this.r||this.x>w-this.r)
	   {
		   this.dx = -this.dx;
	   };
       if(this.y<this.r||this.y>h-this.r)
	   {
		   this.dy = -this.dy;
	   }
	   //���ø��෽��
	   this._super();
   },
   //��дrender����
   render:function(ctx)
   {
     //�����������
	 ctx.beginPath();	 
	 ctx.fillStyle = this.color;
	 ctx.arc(this.x,this.y,this.r-3,0,Math.PI*2);
	 ctx.fill();
     ctx.lineWidth = 2;
     //���
	 ctx.beginPath();
	 ctx.strokeStyle ="white";
	 ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
	 ctx.stroke();
   }
  });
  Ball.ClassName = "Ball";
  //ע��Ball��
  ClassFactory.regClass(Ball.ClassName,Ball);
}())