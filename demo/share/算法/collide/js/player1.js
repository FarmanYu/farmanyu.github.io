/*
* ���ؼ�⾫��
*/
(function(){
   //�������Sprite�̳�
   PObj = Sprite.extend({ 
   init:function()
   {   //״̬0:���� 1:ѡ��,׼���϶� 2:�϶�
	   this.status = -1;
	   this._super();
   },
   //����Ƿ������������ײ
   isCollide:function(pObj)
   {
      var backBuf = TGame.backBuf;
	  backBuf.clearRect(0,0,this.owner.w,this.owner.h);
	  var  x1 = this.x-this.w*0.5,
		   y1 = this.y-this.h*0.5,
		   x2 = this.x+this.w*0.5,
		   y2 = this.y+this.h*0.5,
		   x3 = pObj.x-pObj.w*0.5,
		   y3 = pObj.y-pObj.h*0.5,
		   x4 = pObj.x+pObj.w*0.5,
		   y4 = pObj.y+pObj.h*0.5;
	  //��ȡ�ཻ����
	  var rc = MathUtil.getInRect(x1,y1,x2,y2,x3,y3,x4,y4);
	  //���û���ཻ���˳�
      if(rc[0]>=rc[2]||rc[1]>=rc[3])
	  {
		  return false;
	  }
	  else
	  {
		  var gData1 = null,gData2 = null;
		  backBuf.save();	
		  //���Ƶ���̨������
          this.render(backBuf);           
  	      backBuf.restore();
		  //��ȡ�������ཻ������������
		  gData1 = backBuf.getImageData(rc[0],rc[1],rc[2],rc[3]).data;         
		  //����Ŀ�꾫��
		  backBuf.clearRect(0,0,this.owner.w,this.owner.h);
          backBuf.save();	
		  pObj.render(backBuf);
          backBuf.restore();
          //��ȡĿ�꾫�����ཻ������������
		  gData2 = backBuf.getImageData(rc[0],rc[1],rc[2],rc[3]).data;          		  
		  for(var i=3;i<gData1.length;i+=4)
		  {			 
			  if(gData1[i]>0&&gData2[i]>0)return true;
		  }
	  }
   },
   render:function(ctx)
   {	
	 //���ƾ���߿�
	 /*var c = "red";
	 if(this.status==1)
	 {
		 c ="yellow";
	 }
	 ctx.strokeStyle=c;
	 ctx.beginPath(); 
     ctx.strokeRect(this.x-this.w*0.5,this.y-this.h*0.5,this.w,this.h);*/
	  //�����鱾��
	 this._super(ctx);
   }
  });
  PObj.ClassName = "PObj";
  //ע��CObj��
  ClassFactory.regClass(PObj.ClassName,PObj);
}())