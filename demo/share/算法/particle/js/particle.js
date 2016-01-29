/*
* Particle类
*/
(function(){
  //从引擎的Sprite继承
   Particle = Sprite.extend({  
   init:function()
   {
     //生命毫秒
	 this.life = 500;
	 //年龄
	 this.age = 0 ;
	 //开始时间
	 this.sTime = 0 ;
	 //初始大小
	 this.sSize = 1;
	 //结束大小
	 this.eSize = 1;	
	 //是否激活
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
		//获取生命比例
        var lratio = this.age/this.life;		
		var sc = this.sSize+(this.eSize-this.sSize)*lratio;
		this.scaleX = this.scaleY = sc;
		//更新颜色  
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

  //粒子发生器
  Emit = Class.extend({
     init:function(param,sc,pClassName,pParam)
      {	
		 //喷射间隔时间
		 this.speed = param["speed"]||100;
		 //喷射次数,<0表示无限
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
     //可放在游戏循环中更新
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
  //注册粒子类
  ClassFactory.regClass(Particle.ClassName,Particle);
  ClassFactory.regClass(CirParticle.ClassName,CirParticle);
}())