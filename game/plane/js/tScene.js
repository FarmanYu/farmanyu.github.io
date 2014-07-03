/*
* TitleScene��
*/
(function(){
  //�������Scene�̳�
  TitleSC = Scene.extend({     
	  init:function(x,y,name)
	  {
		  this._super({"x":x,"y":y,"w":400,"h":600,"name":name});
          this.setBGImg("imgs/title.jpg",1);
          this.isStart = false;
		  this.initUI();
	  },
	  //��ʼ��UI
	  initUI:function()
      {
		  this.initProgressUI();
		  this.initStartUI();		  
	  },
	  //��ʼ��������
      initProgressUI:function()
      {
		  var pBar = $("<div id='pCBar' style='position:absolute;border-radius:3px;border:2px solid yellow;left:50px;top:560px;height:10px;width:300px;'></div>");
		  pBar.append("<div id='pBar' style='position:absolute;left:0px;top:0px;overflow:hidden;background-color:red;width:1px;height:9px;top:1px;'></div>");
          this.holder.append(pBar);
	  },
      //���ؽ�����
	  hideProgressUI:function()
      {
		  this.holder.find("#pCBar").hide();
	  },
      //��ʼ��StartGame UI
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
  //ע��TitleSC��
  ClassFactory.regClass(TitleSC.ClassName,TitleSC);
}())