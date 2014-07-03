/*
* TitleScene类
*/
(function(){
  //从引擎的Scene继承
  TitleSC = Scene.extend({     
	  init:function(x,y,name)
	  {
		  this._super({"x":x,"y":y,"w":400,"h":600,"name":name});
          this.setBGImg("imgs/title.jpg",1);
          this.isStart = false;
		  this.initUI();
	  },
	  //初始化UI
	  initUI:function()
      {
		  this.initProgressUI();
		  this.initStartUI();		  
	  },
	  //初始化进度条
      initProgressUI:function()
      {
		  var pBar = $("<div id='pCBar' style='position:absolute;border-radius:3px;border:2px solid yellow;left:50px;top:560px;height:10px;width:300px;'></div>");
		  pBar.append("<div id='pBar' style='position:absolute;left:0px;top:0px;overflow:hidden;background-color:red;width:1px;height:9px;top:1px;'></div>");
          this.holder.append(pBar);
	  },
      //隐藏进度条
	  hideProgressUI:function()
      {
		  this.holder.find("#pCBar").hide();
	  },
      //初始化StartGame UI
      initStartUI:function()
	  {
		  var self = this;
		  var sDiv = $("<div id='sDiv' align='center' style='display:none;cursor:pointer;position:absolute;border:2px solid white;left:100px;top:300px;color:white;font-size:36px;line-height:36px;height:38px;width:200px;'>Start</div>") 
		  sDiv.click(function(){
		     self.isStart = true;
		  })
          this.holder.append(sDiv);
	  }    	  
   });
  TitleSC.ClassName = "TitleSC";
  //注册TitleSC类
  ClassFactory.regClass(TitleSC.ClassName,TitleSC);
}())