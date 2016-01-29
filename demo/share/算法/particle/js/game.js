(function(win){
	var _Game = Game.extend({	
		emit:null,
		init:function()
		{
		  this._super();
	      var scm = this.sceneManager; 
	      //创建场景
          var x = (document.body.clientWidth-400)*0.5;
	      var sc = scm.createScene([{"x":x,"w":300,"h":200,"name":"main"}]);		
		  this.initSprite();
		  this.initListener();
		  this.run(60);
		},		        			   
	    initSprite:function()
	    {
		   var sc = this.sceneManager.getScene("main");
		   var p = sc.createRObj(CirParticle.ClassName);
		   this.emit = new Emit({  
             "lifeRange":[600,900],
		     "sSize":1,
		     "eSize":0.1,				
             "maxNum":40,
             "pos":[100,100],
		     "v":[0,-1.6],
             "vRange":[0.6,1], 
             "a":[0,0.01],
             "aRange":[0.01,0.01]
		   },sc,CirParticle.ClassName,[5,[255,220,60,1]]);	
           this.emit1 = new Emit({  
             "lifeRange":[1000,2000],				

             "sSize":0.1,
		     "eSize":3.5,	
             "maxNum":30,
			 "pos":[200,100],
		     "v":[0,0],
             "vRange":[MathUtil.randRange(1),MathUtil.randRange(1)], 
             "a":[0,0]
            
		   },sc,CirParticle.ClassName,[5,[255,255,255]]);			 
		},
	   //增加游戏监听器
	   initListener:function()
	   {
		 var self = this;
         //增加监听器
         var ltn = new AppEventListener({
	      "afterRender":function(){		   
			  self.emit.update();
			  self.emit1.update();
	      }
 	     });
	     this.addListener(ltn);
	   }
	})
   //定义全局TGame
   win.TGame = new _Game();   
}(window))