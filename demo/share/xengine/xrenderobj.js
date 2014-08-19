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
 			//z-index,����ԽСԽ����Ⱦ
 			this.zIdx = 0;
 			//�Ƿ�ɼ�
 			this.isVisible = true;
 			//�Ƿ���Ƴ�
 			this.canRemove = false;
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
 		},
 		//�ж���굱ǰ�����Ƿ��ڵ�ǰ��Ⱦ����������
 		isMouseIn: function() {
 			var x = Mouse.gX(),
 				y = Mouse.gY();
 			var sc = TGame.sceneManager.getScene("main");
 			var gx = this.owner.x,
 				gy = this.owner.y;
 			//ת��������굽��Ϸ��������ϵ
 			var cd = MathUtil.mapSToCoord(x, y, gx, gy);
 			var hw = this.w * 0.5,
 				hh = this.h * 0.5;
 			return cd[0] >= this.x - hw && cd[0] <= this.x + hw && cd[1] >= this.y - hh && cd[1] <= this.y + hh;
 		}
 	});
 	//��¼renderObj���
 	_renderObj.SID = 0;
 	_renderObj.ClassName = "RenderObj";
 	//ע���ൽ�๤����
 	ClassFactory.regClass(_renderObj.ClassName, _renderObj);
 }(window))