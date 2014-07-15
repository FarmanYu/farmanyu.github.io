/*
box2d帮助类
*/
(function(win){
   var _b2Util = win.B2Util = {
	  b2World:null,
	  b2Scale:30,
      //游戏监听器 
      ltn:null,
      //初始化
	  init:function(x,y,game,enabled)
	  {
		  //定义快捷访问对象
          win.b2Vec2 = Box2D.Common.Math.b2Vec2;
          win.b2AABB = Box2D.Collision.b2AABB;
          win.b2BodyDef = Box2D.Dynamics.b2BodyDef;
          win.b2Body = Box2D.Dynamics.b2Body;
          win.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
          win.b2Fixture = Box2D.Dynamics.b2Fixture;
          win.b2World = Box2D.Dynamics.b2World;
          win.b2MassData = Box2D.Collision.Shapes.b2MassData;
          win.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
          win.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
          win.b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
          win.b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef;
		  win.b2ContactListener =  Box2D.Dynamics.b2ContactListener;
		  win.b2ContactFilter =  Box2D.Dynamics.b2ContactFilter;
		  //初始box2d世界
		  var bw = this.b2World = new b2World(new b2Vec2(x,y),true);
		  this.ltn = new AppEventListener({
	        "beforeRender":function(){	
			   bw.Step(1/game.frames, 6, 1);
			   bw.ClearForces();
               bw.DrawDebugData();
	       }
 	      }); 
         this.ltn.enabled = enabled;
	     game.addListener(this.ltn);
	  },
      //设置显示窗口 
      setDebugDraw:function(context)
	  {
          var debugDraw = new b2DebugDraw();
	 	  debugDraw.SetSprite(context);
		  debugDraw.SetDrawScale(this.b2Scale);
	      debugDraw.SetFillAlpha(0);
		  debugDraw.SetAlpha(0);
		  debugDraw.SetLineThickness(1.0);
		  debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	      this.b2World.SetDebugDraw(debugDraw);
	  },
      //转换长度到box2d世界
	  lenToB2d:function(pixel)
	  {
          return pixel/this.b2Scale;
	  },
       //转换box2d长度到屏幕像素
      lenToScn:function(b2Len)
	  {
          return this.b2Scale*b2Len;
	  },
      //创建圆形body
	  createRoundBody:function(r,x,y,density,friction,restitution,type)
	  {
		 //定义为圆形状
         var bodyDef = new b2BodyDef();
	     bodyDef.type = (type==null)?b2Body.b2_dynamicBody:type;
		 bodyDef.position.Set(this.lenToB2d(x||0),this.lenToB2d(y||0));
		 bodyDef.angularDamping = 1.6;
	     //创建形状
	     var ba = new b2CircleShape(this.lenToB2d(r));
         //创建材质
	     var fix =  new b2FixtureDef();
	     fix.shape = ba;
	     fix.density = density||2;
         fix.friction = friction||0.5;
	     fix.restitution = restitution||0.5;
		 //创建物体	    
	     var body = this.b2World.CreateBody(bodyDef);
		 if(type==b2Body.b2_staticBody)
		 {
             body.CreateFixture2(ba);
		 }
		 else
		 {
			 body.CreateFixture(fix);
		 }	     
		 return body;
	  },
      //创建矩形形body
	  createRectBody:function(x,y,w,h,ang,density,friction,restitution,type)
	  {
         //定义floor类型
	     var bodyDef = new b2BodyDef();
	     bodyDef.type = (type==null)?b2Body.b2_dynamicBody:type;
	     bodyDef.position.Set(this.lenToB2d(x||0),this.lenToB2d(y||0));
	     //创建形状
         var box = new b2PolygonShape();
         box.SetAsBox(this.lenToB2d(w||0),this.lenToB2d(h||0));  
         //创建材质
	     var fix =  new b2FixtureDef();
	     fix.shape = box;
	     fix.density = density||2;
         fix.friction =friction||0.5;
	     fix.restitution = restitution||0.5;
		 fix.groupIndex = 1;
	     //创建body
	     var body = this.b2World.CreateBody(bodyDef);  
		 body.SetAngle(MathUtil.deg2rad(ang||0));
	     //创建材质
		 if(type==b2Body.b2_staticBody)
		 {
             body.CreateFixture2(box);			 
		 }
		 else
		 {
			 body.CreateFixture(fix);
		 }	 
		 return body;
	  },
      //设置碰撞监听器
	  setContactListener:function(ltn)
	  {
        this.b2World.SetContactListener(ltn);
	  },
	  //设置碰撞过滤器
      setContactFilter:function(flt)
	  {
		 this.b2World.SetContactFilter(flt);
	  },
      //移除物体
	  remove:function(b)
	  {
		 this.b2World.DestroyBody(b);
	  }    
   }
}(window))