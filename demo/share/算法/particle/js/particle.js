/*
* Particle��
*/
(function(){
  //�������Sprite�̳�
   Particle = Sprite.extend({  
   init:function()
   {
     //��������
	 this.life = 500;
	 //����
	 this.age = 0 ;
	 //��ʼʱ��
	 this.sTime = 0 ;
	 //��ʼ��С
	 this.sSize = 1;
	 //������С
	 this.eSize = 1;	
	 //�Ƿ񼤻�
	 this.active = false;
     this._super();
	 this.isVisible = this.active;
   },
   start:function()
   {
	   this.sTime = FrameState.currTime;
	   this.active = this.isVisible = true;
   },
   stop:function()
   {
	   this.active = this.isVisible = false;
	   this.age = 0;
   },
   update:function()
   {	         	  	  	  
      if(this.active)
	  {
        this.age = FrameState.currTime - this.sTime;
		if(this.age>=this.life){
		  this.owner.removeRObj(this);	
		  return ;
		}        
		this._super();
	  }	  
   }
  });
  CirParticle = Particle.extend({
     init:function(r,c)
	 {
		 this.r = r;
         this.color = c||[255,255,255,1];	
		 this._super();
	 },     
     render:function(ctx)
	 {
		//��ȡ��������
        var lratio = this.age/this.life;		
		var sc = this.sSize+(this.eSize-this.sSize)*lratio;
		this.scaleX = this.scaleY = sc;
		//������ɫ  
		var r = MathUtil.lerp(this.color[0],0,lratio)|0,
		    g = MathUtil.lerp(this.color[1],0,lratio)|0,
		    b = MathUtil.lerp(this.color[2],0,lratio)|0;
		this.color[3] = (1-lratio)*0.5;  
        ctx.fillStyle = ColorUtil.rgb(r,g,b);
		ctx.translate(this.x,this.y);
		ctx.scale(this.scaleX,this.scaleY);
		ctx.globalAlpha = this.color[3];
		ctx.beginPath();
		ctx.arc(0,0,this.r,0,Math.PI*2);		
		ctx.fill();
		ctx.closePath();
	 }
  });

  //���ӷ�����
  Emit = Class.extend({
     init:function(param,sc,pClassName,pParam)
      {	
		 //������ʱ��
		 this.speed = param["speed"]||100;
		 //�������,<0��ʾ����
		 this.times = param["times"]||-1;
		 this.lifeRange = param["lifeRange"]||[500,800];
		 this.sSize = param["sSize"]||1;
		 this.eSize = param["eSize"]||1;
		 this.timeRange = param["timeRange"]||999999;
		 this.maxNum = param["maxNum"]||200;
		 this.pos =  param["pos"]||[0,0]
		 this.v = param["v"]||[0,0];
		 this.vRange = param["vRange"]||[0,0];
		 this.a = param["a"]||[0,0];
		 this.aRange = param["aRange"]||[0,0];
		 this.sc = sc;
		 this.pClassName = pClassName;
		 this.pParam = pParam;
		 this.startTime = FrameState.currTime;
	  },
     createParticle:function()
	 {
        for(var i=0;i<this.maxNum;i++)
		   {
			 var p = this.sc.createRObj(this.pClassName,this.pParam);
			 p.life = MathUtil.randInt(this.lifeRange[0],this.lifeRange[1]);
			 p.sSize = this.sSize;
			 p.eSize = this.eSize;
			 p.x = this.pos[0];
             p.y = this.pos[1];
			 p.vx = this.a[0]+MathUtil.randRange(this.aRange[0]);
			 p.vy = this.a[1]+MathUtil.randRange(this.aRange[1]);
			 p.dx = this.v[0]+MathUtil.randRange(this.vRange[0]);
			 p.dy = this.v[1]+MathUtil.randRange(this.vRange[1]);
			 p.start();
		   }
	 },
     jet:function()
	 {
        this.startTime = FrameState.currTime;
		this.createParticle();
	 },
     //�ɷ�����Ϸѭ���и���
	 update:function()
	 {		
        if((this.times!=0)&&(FrameState.currTime-this.startTime>this.speed))
		 {
           this.jet();
		 } 
		if(this.times>0)--this.times;
	 }
  })
  Particle.ClassName = "Particle";
  CirParticle.ClassName = "CirParticle";
  //ע��������
  ClassFactory.regClass(Particle.ClassName,Particle);
  ClassFactory.regClass(CirParticle.ClassName,CirParticle);
}())