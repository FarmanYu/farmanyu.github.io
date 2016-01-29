 /*!
  * xengine
  * Copyright 2012 xiangfeng
  * Released under the MIT license
  * Please contact to xiangfenglf@163.com if you hava any question
  * ��Ϸ��Ⱦ������
  */
 (function(win) {
 	//��Ⱦ������   
 	var _renderObj = win.RenderObj = Class.extend({
 		init: function(name) {
 			this.name = name || ("Unnamed_" + (_renderObj.SID++));
 			//ӵ����,ָ�򳡾�����
 			this.owner = null;
 			//x,y��������
 			this.x = 0;
 			this.y = 0;
 			//�����Ⱥ͸߶�
 			this.w = 0;
 			this.h = 0;
 			//x,y������ٶ�
 			this.dx = 0;
 			this.dy = 0;
 			//x,y����ļ��ٶ�
 			this.vx = 0;
 			this.vy = 0;
 			//�Ƕ�
 			this.deg = 0;
 			//z-index
 			this.zIdx = 0;
 			//�Ƿ�ɼ�
 			this.isVisible = true;
 		},
 		//����λ��
 		moveTo: function(x, y) {
 			this.x = x || this.x;
 			this.y = y || this.y;
 		},
 		//�ƶ�
 		move: function(xOff, yOff) {
 			this.x += xOff;
 			this.y += yOff;
 		},
 		//�ƶ�һС��
 		moveStep: function() {
 			this.dx += this.vx;
 			this.dy += this.vy;
 			this.x += this.dx;
 			this.y += this.dy;
 		},
 		//��תdeg��
 		rot: function(deg) {
 			this.deg = deg;
 		},
 		//���·�����ÿһ֡����	   
 		update: function() {
 			this.moveStep();
 		},
 		//��Ⱦ������ÿһ֡����,ctx��canvas����
 		render: function(ctx) {
 			return;
 		}
 	});
 	//��¼renderObj���
 	_renderObj.SID = 0;
 	_renderObj.ClassName = "RenderObj";
 	//ע���ൽ�๤����
 	ClassFactory.regClass(_renderObj.ClassName, _renderObj);
 }(window))