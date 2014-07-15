/*
* bird类
*/
(function(){
     //从引擎的Sprite继承
     Bird = B2Sprite.extend({
     init:function(r)
     {
       this.r = r;
	   this.sCtx = new StateContext(this);     
	   this.regState();
	   this.isGoFly = false;	   
	   this._super();
	   //设置bird血量 
	   this.hp = 45;
	   //轨迹对象
	   this.track = null;
	   this.sCtx.changeState("idle");
	 }, 
	 //注册状态类
     regState:function()
     {
       this.sCtx.regState(new IdleState("idle",this.sCtx));
	   this.sCtx.regState(new GoReadyState("goReady",this.sCtx));
       this.sCtx.regState(new GoFlyState("goFly",this.sCtx));
	   this.sCtx.regState(new FlyState("fly",this.sCtx));
       this.sCtx.regState(new DeadState("dead",this.sCtx));
     },		     
	 //更新状态机器
     update:function()
	 {
	   this.sCtx.update();
	 },
     //获取当前状态
	 getState:function()
     {
		 return this.sCtx.currState.type;
	 },
     //添加到b2world世界中
	 addToB2Word:function()
	 {
		var body = B2Util.createRoundBody(this.r,this.x,this.y,1.5,0.1,0.6);
		this.bindB2Obj(body);
	 },
     //弹射出去
	 shooter:function()
	 {
        //定义弹弓中心        
        var c = TGame.getShootCenter();
		//创建小鸟到弹弓中心向量
        var vx = c[0]-this.x,
			vy = c[1]-this.y;
		var len = Math.sqrt(vx*vx+vy*vy);
		vx /= len;
		vy /= len;
		var force = TGame.power;
		//定义弹弓最长80,最短20;
		var tLen = 80;     
        force *=(len/tLen);
        this.b2Obj.ApplyImpulse(new b2Vec2(vx*force,vy*force), this.b2Obj.GetWorldCenter());
		return force;
	 },
     //定义小鸟碰撞效果
	 effColl:function()
	 {
	   var  emit = new Emit({  
						  "lifeRange":[600,900],
						  "sSize":1.2,
						  "eSize":0.1,				
						  "maxNum":5,                           
						  "pos":[this.x,this.y],
                          "angRange":90,
						  "v":[-1,-1],
						  "vRange":[1,1], 
						  "a":[0.01,0.01],
						  "aRange":[0.01,0.01]
						},this.owner,BoomParticle.ClassName,["boom1","def"]);	
        emit.jet();
	 },    
     //复写死亡方法  
     dead:function()
	 {        		
		var self = this;
		this._super();
		TGame.createBoom(this.x,this.y,function(){		  
		   self.effColl();
		})
	 }
   })
   //注册Bird到类工厂
   Bird.ClassName = "Bird";  
   //bird状态类   
   var IdleState = State.extend({      
   });
   //定义Bird初始状态类
   var GoReadyState = State.extend({
      enter:function()
	  {
        var bird = this.ctx.owner;
		//以树杈中心为顶点，小鸟初始位置构造抛物线
		var sc = TGame.getShootCenter();
		this.b = bird.x-sc[0];
		this.c = TGame.skyLineY-sc[1];
		this.a = -this.c/(this.b*this.b);
		//设定time毫秒内移动到弹弓上
		//每帧消耗的时间
        var tPerFrame = 1000/TGame.frames;
        var time = 600;		
		//计算time时间内移动到弹弓上水平步数
		var steps = time/tPerFrame;
		//计算dx
		bird.dx = -this.b/steps;
		//计算每帧旋转的角度
		this.sDeg = 360/steps;		
	  },
      change:function()
	  {
		var bird = this.ctx.owner;
	    if(bird.isGoFly)
	    {
		  //准备好
		  this.ctx.changeState("goFly");
		}	
	  },
	  update:function()
	  {	   
        var bird = this.ctx.owner;	
		var sc = TGame.getShootCenter();
		bird.deg+=this.sDeg;
		//计算横坐标位移
        bird.x += bird.dx;
		//计算相对弹弓的x坐标
		var bx = bird.x-sc[0];
		//计算抛物线y坐标
        var by = this.a*bx*bx+this.c;
		bird.y = TGame.skyLineY-by;	
		//如果刚好到达弹弓顶端则准备好可以发射小鸟
        if(bx<=0)
		{
			bird.isGoFly = true;
		}
	  }
    });
   //准备好状态
   var GoFlyState = State.extend({
      enter:function()
	  {
		//初始监听器
		TGame.initContactLtn();
		this.reset = false;
	  },
      change:function()
	  { 
        var bird = this.ctx.owner;  
		//释放鼠标
		if(this.drag&&Mouse.gBtnState(0)==0)
		{	
		 this.drag = false;	
		 //距离太短，恢复原状
		 if(this.reset)
		 {
           bird.moveTo(this.ox,this.oy); 
		 }
		 else
		 {
		   //飞行
		   this.ctx.changeState("fly");		 
		 }		 
		}	
	  },
	  update:function()
	  { 
		 var bird = this.ctx.owner;  
		 var sshort = TGame.sshort;
		 if(!this.drag&&Mouse.gBtnState(0)==1&&bird.isMouseIn())
		  {
			 this.drag = true;
			 this.ox = bird.x;
			 this.oy = bird.y;
		  }
         //移动
		 if(this.drag)
		  {
             var nx = this.ox+Mouse.gXOff(),
				 ny = this.oy+Mouse.gYOff();
			 var c = TGame.getShootCenter();
			 var sx = c[0]-nx;
			 var sy = c[1]-ny;
			 var len = sx*sx+sy*sy;
			 //限制拖动的长度不超过80
			 if(len<6400)
			 {
			   bird.moveTo(nx,ny);
             }
			 //限制拖动的长度小于20则还原
			 this.reset = (len<400)?true:false;
		  }
	  }
    });
   //定义飞行状态
   var FlyState = State.extend({
      enter:function()
	  {
		var bird = this.ctx.owner;
		//增加到box2d物理空间中 
		bird.addToB2Word();
		var f = bird.shooter(); 
		//记录轨迹次数
		this.step = MathUtil.lerp(6,1,(f-TGame.power*0.2)/(TGame.power*0.8))|0;
		this.tCount = this.step;
	  },
      change:function()
	  {
        var bird = this.ctx.owner;
	    var v = bird.b2Obj.GetLinearVelocity();
		//速度为0或者超出屏幕范围,则转换到死亡
		if(bird.x<-bird.r||bird.x>bird.owner.w+bird.r||(Math.abs(v.x)<0.1&&Math.abs(v.y)<0.1)){
          this.ctx.changeState("dead");
		} 		   	
	  },
	  update:function()
	  {       
		var bird = this.ctx.owner;
		bird.syncToB2();	
		//如果没有碰撞过
		if(!bird.isColled)
		{
		   if(++this.tCount>this.step)
			{
			   this.tCount = 0;
               bird.track.tracks.push(bird.x,bird.y);
		    }          
		}
	  }
    });
    //死亡状态
	var DeadState = State.extend({      
	  update:function()
	  {         
		 var bird = this.ctx.owner;
		 bird.dead();
	  }
    });
   ClassFactory.regClass(Bird.ClassName,Bird);
   ClassFactory.regClass(BoomParticle.ClassName,BoomParticle);   
}())