 /*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * ��Ϸ��������
 */
(function(win){
   //�򵥵ĳ����¼�������
   var _appEventListener = win.AppEventListener = EventListener.extend({
	   init:function(param)
	   {
		   //�������Ƿ���Ч
		   this.enabled = true;
		   this.onBeforeRender = param["beforeRender"]||this.onBeforeRender;		   
           this.onAfterRender = param["afterRender"]||this.onAfterRender;
	   },
       //��Ϸ��ѭ��ִ����Ⱦ����ǰ����
       onBeforeRender:function(){return true;},
       //��Ϸ��ѭ��ִ����Ⱦ�����󴥷�
       onAfterRender:function(){return true;}
   });

   var _game = win.Game = Class.extend({
     //�������еļ�����
	 listeners:[],
	 //����������
	 sceneManager:null,
     //��ʼ������
	 init:function()
	 {	   
	   this.sceneManager = new SceneManager();
	   this.paused = false;
	 },
     //��Ӽ�����
	 addListener:function(ln)
     {
       this.listeners.push(ln);
	 },
     //��ռ������б�
     clearListener:function()
     {
	   this.listeners.length = 0;
     },
     //��Ϸ��ѭ��
     mainloop:function()
	 {
	  //ִ����Ϸ��ѭ��
      var ltns = this.listeners;
	  //������������Ⱦǰ�¼�
	  for(var i=0,len = ltns.length;i<len;i++)
		{
		  ltns[i].enabled&&ltns[i].onBeforeRender();
		} 
	  //��ȡ��ǰ���������£�����Ⱦ
      var scene = this.sceneManager.getCurrentScene();
	  if(scene)
	  {
	    scene.update();
	    scene.render();
	  }
      //������������Ⱦ���¼�	  
	  for(var i=0;i<len;i++)
	   {
		  ltns[i].enabled&&ltns[i].onAfterRender();
	   }
	 },
	 //ִ����Ϸ
	 run:function(fps)
	 {     
	   //�趨fpsĬ��Ϊ60֡/�� 
	   fps = fps||60;
       var self = this,
	       spf = (1000/fps)|0;
	   //����֡������
	   FrameState.start();
       self.tHand = setInterval(function(){         
          //����֡״̬
          FrameState.update();	
		  if(!self.paused)
		   {
			  self.mainloop();
		   }
	   },spf); 
	 },
     //��ͣ��Ϸ
	 pause:function()
	 {
		 this.paused = true;
	 },
	 //��ֹ��Ϸ
	 stop:function()
	 {
	   clearInterval(this.tHand);
	 }
   });
}(window))