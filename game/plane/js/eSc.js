/*
* EndScene类
*/
(function(){
  //从引擎的Scene继承
  EndSC = Scene.extend({     
	  init:function(x,y,name)
	  {
		  this._super({"x":x,"y":y,"w":400,"h":600,"name":name});
		  this.isRetry = false;
		  this.initUI();
	  },
	  //初始化UI
	  initUI:function()
      {		
		  this.initStartUI();		  
	  },	 
      //初始化StartGame UI
      initStartUI:function()
	  {
		  var self = this;
		  var sDiv = $("<div id='sDiv' align='center' style='cursor:pointer;position:absolute;border-bottom:1px solid white;left:100px;top:300px;color:white;font-size:18px;line-height:18px;height:18px;width:200px;'>Return To Title</div>") 
          sDiv.click(function(){
              self.isRetry = true;
		  })
		  this.holder.append("<div align='center' style='position:absolute;left:100px;top:240px;color:Red;font-size:36px;line-height:36px;height:38px;width:200px;'>Game Over</div>");
		  this.holder.append("<div align='center' style='position:absolute;left:100px;top:180px;color:Red;font-size:36px;line-height:36px;height:38px;width:200px;'>Score:"+ShootGame.cfg.score+"</div>");
          this.holder.append(sDiv);
	  }    	  
   });
  EndSC.ClassName = "EndSC";
  //注册结束场景类
  ClassFactory.regClass(EndSC.ClassName,EndSC);
}())