 /*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * ��Ϸ״̬����
 */
 (function(win){
	  //״̬������
	  var _StateContext = win.StateContext = Class.extend({
		  init:function(owner)
		  {
			  //�͸�״̬������Ķ���
			  this.owner = owner;
			  this.states={};
			  this.currState = null;
		  },
		  changeState:function(type)
		  {
              this.currState&&this.currState.exit();
			  this.currState = this.states[type];
			  this.currState.enter();
		  },
		  getState:function(type)
		  {
			  return this.states[type];
		  },
		  //ע��һ��״̬��
		  regState:function(state)
		  {
			  this.states[state.type] = state;
			  return this;
		  },
          //ע��һ��״̬��
		  unRegState:function(type)
          {
             if(this.states[type]!=null&&this.currState!=this.states[type])
			  {
				 delete this.states[type];
			  }
		  },
		  unRegAll:function()
          { 
			  this.currState = null;
              this.states = {};
		  },
          //�÷�������Ϸ��ѭ����ʹ��
		  update:function()
		  {
              this.currState.change();
              this.currState.update(); 
		  }
	  })
      //״̬������
	  var _state = win.State = Class.extend({
		  init:function(type,context)
		  {			  
			  this.ctx = context;
			  this.type = type;
		  },
		  //����context changeState����ת��������״̬
		  change:function()
		  {
              return;
		  },
		  //��ǰ״̬�Ļ
          update:function()
		  {
			  return;
		  },
          //�����״̬ʱִ��
	      enter:function()
		  {
			  return true;
		  },
          //�˳�״ִ̬��
		  exit:function()
          {
			  return;
		  }
	  })
 }(window))