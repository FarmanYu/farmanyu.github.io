/*
TGame 游戏主类
*/
(function(win){
	var _Game = Game.extend({			
        frames:60,
	    birds:[],
   	    pigs:[],
		blocks:[],
	    //记录所有可以销毁的精灵
		removableSprite:{},
	    avaBirdIdx:-1,
		currBird:null,
		sshort:null,	   
		floor:null,
        //地平线高度
	    skyLineY:530,
        //box2d监听器 
        b2Ltn:null,
        //弹弓最大拉力
	    power:27,
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-1024)*0.5;
	      var sc = scm.createScene([{"x":x,"w":1024,"h":600,"name":"main"}]);
		  //设置场景背景
          sc.setBGImg("imgs/bg.png",1);		
		  //初始化box2d工具类
		  B2Util.init(0,9.8,this,true);
		  this.loadRes(sc);
		},		
		//加载资源
	    loadRes:function(scene)
	    {
		  var self = this;
		  ResManager.loadRes("data/res.json",function(){
			self.initSprite();
			self.run(self.frames); 
		  });      
	    },    	 
		//创建精灵  	
	   initSprite:function()
	   {		 
          //初始化地板
		  this.initFloor();
		  //创建弹弓
		  this.createSShort();
		  //初始化小鸟
		  this.initBird(15,5);
		  //创建障碍
		  this.initBlock();
		  //初始化小猪
		  this.initPig();
		  //初始化各种监听器
          this.initListener();
	   },
       //创建小鸟
	   createBird:function(r,x,y)
	   {
          var sc = this.sceneManager.getScene("main");	
		  var bird = sc.createRObj(Bird.ClassName,[r]);
		  bird.setAnims(ResManager.getAnimationsByName("sprite","bird"));
		  bird.moveTo(x,y);
		  bird.dx = -1;
		  bird.w = bird.h = bird.r*2;	
		  //创建轨迹对象
		  bird.track = sc.createRObj(BirdTrack.ClassName);
		  this.birds.push(bird);
	   },
       //创建障碍物体
	   createBlock:function(type,animName,x,y,w,h)
	   {
          var sc = this.sceneManager.getScene("main");	
		  var bk = sc.createRObj(Block.ClassName,[type]);
		  bk.setAnims(ResManager.getAnimationsByName("sprite",animName));
		  bk.moveTo(x,y);
		  this.blocks.push(bird);
	   },
       //创建小猪
	   createPig:function(x,y)
	   {
          var sc = this.sceneManager.getScene("main");	
		  var p = sc.createRObj(Pig.ClassName,[16]);
		  p.setAnims(ResManager.getAnimationsByName("sprite","pig"));
		  p.moveTo(x,y);
		  p.w = p.h = p.r*2;
		  p.setAnimSpeed(0.3);
		  p.addToB2Word();
		  this.pigs.push(p);
	   },
	   //初始化小鸟
	   initBird:function(r,num)
	   {
          for(var i=0;i<num;i++)
		  {
             this.createBird(r,MathUtil.randInt(130,220),this.skyLineY-r);
		  }
	   },
       //初始化障碍
	   initBlock:function()
	   {
         var sc = this.sceneManager.getScene("main");	 
         var bks=[
           ["stone","lst",840,520,203,20,0,1000],
           ["wood","mwood",785,459,100,20,90],
		   ["wood","mwood",899,459,100,20,90],
		   ["wood","mwood",840,400,168,22,0,60],
		   ["wood","mwood",806,340,100,20,90],
		   ["wood","mwood",872,340,100,20,90],
		   ["wood","mwood",840,280,100,20],
		   ["glass","sgs",805,470,85,22,90,10],
		   ["glass","sgs",875,470,85,22,90,10]
		  ]
	     //创建
		 for(var i=0;i<bks.length;i++)
		 {
           var bk = bks[i];
           var p = sc.createRObj(Block.ClassName,[bk[0]]);		   
		   p.setAnims(ResManager.getAnimationsByName("sprite",bk[1]));
		   p.moveTo(bk[2],bk[3]);
		   p.w = bk[4],p.h=bk[5];
		   p.deg = bk[6]||0;
		   p.hp = bk[7]||p.hp;
		   p.addToB2Word();	
		   this.blocks.push(p);
		 }
	   },
	   //初始化小猪
	   initPig:function()
	   {
         var sc = this.sceneManager.getScene("main");	 
         var pigs=[
           [840,490],
           [840,370]
		  ];
		 for(var i=0;i<pigs.length;i++)
          {
			 var pig = this.createPig(pigs[i][0],pigs[i][1]);
		  }
	   },
	   //创建弹弓
	   createSShort:function()
	   {
		  var sc = this.sceneManager.getScene("main");	
		  //弹弓右边
		  var ss1 = sc.createRObj(Sprite.ClassName);
          ss1.setAnims(ResManager.getAnimationsByName("sprite","ss1"));
		  ss1.moveTo(90,this.skyLineY-ss1.h*0.5-10);
		  ss1.zIdx = -1;
		  //弹弓左边
		  var ss2 = sc.createRObj(Sprite.ClassName);
          ss2.setAnims(ResManager.getAnimationsByName("sprite","ss2"));
		  ss2.moveTo(79,this.skyLineY-ss2.h*0.5-15);
		  ss2.zIdx = 3;
		  this.sshort = ss1;
		  //找到弹弓左右边线端点
          var c = this.getShootCenter();
		  var cx = c[0];
			  cy = c[1]+4;
		  //弹弓右边线
		  var RLine = sc.createRObj(RenderObj.ClassName,["RLine"]);
          RLine.zIdx = -2;
		  //弹弓左边线
		  var LLine = sc.createRObj(RenderObj.ClassName,["LLine"]);
		  LLine.zIdx = 2; 
		  var fn = function(dx1,dy1){
            return function(ctx){
			  var sx = cx,sy = cy,dx = dx1,dy = dy1;
              var bird = TGame.currBird;
			  if(bird!=null&&bird.getState()=="goFly")
			  {
                 sx = bird.x;
				 sy = bird.y;
			  }
              ctx.lineWidth = 8;			  
		      ctx.strokeStyle = "rgb(48,23,8)";
			  ctx.beginPath();
			  ctx.moveTo(sx,sy);
			  ctx.lineTo(dx,dy);
			  ctx.stroke();
			}
		  }
		  //定义render方法
		  RLine.render = fn(cx+10,cy);
		  LLine.render = fn(cx-10,cy);		 		
	   },
	   //创建地板,地板不需要绘制
	   initFloor:function()
	   {
		 var sc = this.sceneManager.getScene("main");	
         this.floor = B2Util.createRectBody(512,this.skyLineY,600,2,null,null,null,null,b2Body.b2_staticBody);		 		 
		 //设置地板标记
		 this.floor.SetUserData("floor");
	   },
       //初始化碰撞监听器
	   initContactLtn:function()
	   {                  
          B2Util.setContactListener(this.b2Ltn.ltn);         
	   },
	   //获取弹弓中心坐标
	   getShootCenter:function()
	   {
		    var sx = this.sshort.x-6,
				sy = this.skyLineY-this.sshort.h;
			return [sx,sy];
	   },
       //初始化game监听器 
	   initListener:function()
	   {
		  var self = this;  
		  var appLtn = new AppEventListener();
		  //添加app监听器
		  appLtn.onAfterRender = function(){             
			 //控制小鸟开始准备
			 self.birdReady();
			 //处理精灵销毁
			 self.cleanSprite();
		  }
		  this.addListener(appLtn);
		  //设置box2d监听器 
		  this.b2Ltn = new B2Ltn();
	   },
       //处理精灵销毁
	   cleanSprite:function()
	   {
          //removableSprite保留了所有应该销毁的精灵对象，调用该对象的dead方法销毁
		  for(var i in this.removableSprite)
		   {
             this.removableSprite[i].dead();       
		   }
		  this.removableSprite = {};
	   },
       //控制小鸟开始准备
	   birdReady:function()
	   {
		 if((this.currBird==null)||(this.currBird!=null&&this.avaBirdIdx<this.birds.length-1&&this.currBird.getState()=="fly"))
		 {
            this.currBird = this.birds[++this.avaBirdIdx];
			this.currBird.sCtx.changeState("goReady");
		 }
	   },
	   //创建爆炸精灵
	   createBoom:function(x,y,callBack)
	   {
		var sc = this.sceneManager.getScene("main");	
        //创建一个爆破的精灵 
		var obj =  sc.createRObj(Sprite.ClassName);
		obj.setAnims(ResManager.getAnimationsByName("sprite","boom"));
		obj.moveTo(x,y);
		//重写update方法
        obj.update = function()
		 {
          if(this.animsCtrl.isFirstFrame()&&!this.isF)
			{
			  this.isF = true;
			  callBack&&callBack();
		    } 
          //最后一帧播放完毕后死亡
		  if(this.animsCtrl.isLastFrame())
			{
			  this.owner.removeRObj(this);			  
		    }
		 }
	   },
       //创建分数文本 
	   createScore:function(x,y,param)
	   {
		  var p = PubUtil.merge(param,{"x":x,"y":y,"txt":0,"col":"red","f_size":30,"l_time":800});
		  var sc = this.sceneManager.getScene("main");	
		  var tObj = sc.createRObj(RenderObj.ClassName);
		  tObj.birth = FrameState.currTime;
		  tObj.life = p.l_time;
		  tObj.col = p.col;
		  tObj.txt = p.txt;
		  tObj.size = p.f_size;
		  tObj.x = x;
		  tObj.y = y;
		  tObj.tAlpha = 1.0;
		  tObj.dy = -1;
          tObj.update = function(){
			 if(this.life>0)
			  {
				 var d = FrameState.currTime-this.birth;
				 if(d>this.life)
				  {
				    this.owner.removeRObj(this);
                  }
				 else
                  {
					this.tAlpha = (1.0-d/this.life);
				  }
			  }
			 this.moveStep();
		  }
		  tObj.render = function(ctx){
			ctx.save();
            ctx.fillStyle = this.col; 
			ctx.globalAlpha = this.tAlpha;
			ctx.font = "bold "+this.size+"px sans-serif"; 
			var txt = this.txt;
			var m = ctx.measureText(txt).width;
			ctx.fillText(this.txt,this.x-m*0.5,this.y);
			ctx.restore();
		  }
	   }
	})
   //定义全局TGame
   win.TGame = new _Game();    
}(window))