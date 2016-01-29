/*
* ����Χ�еľ���
*/
(function(){
   //�������RenderObj�̳�
   CObj = RenderObj.extend({   
   init:function()
   {
	   this.bBox = null;
	   this._super();
   },
   //���ð�Χ��
   setBBox:function(bBox)
   {
	   this.bBox = bBox;
   },
   //��дupdate
   update:function()
   {	  
	   var w = this.owner.w,
		   h = this.owner.h;
	   //����߽�ı��ٶȷ���
	   if(this.x<this.w||this.x>w)
	   {
		   this.dx = -this.dx;
	   };
	   if(this.y<this.h||this.y>h)
	   {
		   this.dy = -this.dy;
	   }
	   this.bBox.c = "red";
	   //���ø��෽��
	   this._super();
	   //����Ƿ���ײ����CObj
	   this.checkCollide();
   }, 
   checkCollide:function()
   {
      var cObjs = TGame.cObjs;
	  for(var i=0,len = cObjs.length;i<len;i++)
	  {
		  if(this.name!=cObjs[i].name&&this.bBox.c!='yellow'&&this.bBox.isCollide(cObjs[i].bBox))
		  {
   		     this.bBox.c = cObjs[i].bBox.c = "yellow";
		  }
	  }
   },
   render:function(ctx)
   {
	  var bType = this.bBox.getType();
      this.bBox.x = this.x;
	  this.bBox.y = this.y;	
	  this.bBox.show(ctx);
   }
  });
  CObj.ClassName = "CObj";
  //ע��CObj��
  ClassFactory.regClass(CObj.ClassName,CObj);
}())