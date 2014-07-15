 /*!
  * xengine
  * Copyright 2012 xiangfeng
  * Released under the MIT license
  * Please contact to xiangfenglf@163.com if you hava any question
  * ��Ϸ������
  */
 (function(win) {
 	//��Ⱦ������   
 	var _sprite = win.Sprite = RenderObj.extend({
 		init: function(name) {
 			this._super(name);
 			//֡�������϶���
 			this.anims = null;
 			this.animsCtrl = new FrameCtrl();
 			//�Ƿ�ˮƽ���� 
 			this.isXFlip = false;
 			//�Ƿ�ֱ���� 
 			this.isYFlip = false;
 			this.scaleX = 1;
 			this.scaleY = 1;
 			//��Χ��
 			this.bBox = null;
 			//tagPoint
 			this.tags = [];
 		},
 		//����֡�������϶���
 		setAnims: function(animations, currAnimName) {
 			currAnimName = currAnimName || "def";
 			this.anims = animations;
 			this.animsCtrl.setAnims(animations, currAnimName);
 			//�������ô�С
 			var f = this.getCurrFrame();
 			this.w = f[3];
 			this.h = f[4];
 		},
 		//���ö�����
 		addAnim: function(name, frames, isCurrent) {
 			this.anims.add(name, frames);
 			isCurrent && this.animsCtrl.setCurrent(name);
 		},
 		//ɾ��ָ�����ƶ���
 		removeAnim: function(name) {
 			this.anims.remove(name);
 		},
 		//���������õ�ǰ����
 		setCAnim: function(name) {
 			this.animsCtrl.setCurrent(name);
 		},
 		//���ö����ٶ�
 		setAnimSpeed: function(sp) {
 			this.animsCtrl.speed = sp;
 		},
 		//�����ƻ�ȡ����
 		getAnim: function(name) {
 			return this.anims.get(name);
 		},
 		//��ȡ��ǰ���еĶ���
 		getCurrentAnim: function() {
 			return this.animsCtrl.getCurrent();
 		},
 		//��ȡ��ǰ����֡
 		getCurrFrame: function() {
 			return this.animsCtrl.getCurrFrame();
 		},
 		//��ȡ��һ֡��Ϣ
 		getNextFrame: function() {
 			return this.animsCtrl.getNextFrame();
 		},
 		//������Ļ�Ƴ��ö���
 		offScreenRemove: function() {
 			var hw = this.w * 0.5,
 				hh = this.h * 0.5;
 			if (this.x < -hw || this.x > this.owner.w + hw || this.y < -hh || this.y > this.owner.h + hh) {
 				this.owner.removeRObj(this);
 			};
 		},
 		//���·���
 		update: function() {
 			this._super();
 			if (this.bBox) {
 				this.bBox.x = this.x;
 				this.bBox.y = this.y;
 			}
 			this.offScreenRemove();
 		},
 		//��Ⱦ������ÿһ֡����,ctx��canvas����
 		render: function(ctx) {
 			ctx.translate(this.x, this.y);
 			var hw = 0.5 * this.w;
 			var hh = 0.5 * this.h;
 			var scaleX = (this.isXFlip) ? -this.scaleX : this.scaleX;
 			var scaleY = (this.isYFlip) ? -this.scaleY : this.scaleY;
 			if (this.deg !== 0) {
 				ctx.rotate(MathUtil.deg2rad(this.deg));
 			}
 			ctx.scale(scaleX, scaleY);
 			var f = this.getNextFrame();
 			ctx.drawImage(f[0], f[1], f[2], f[3], f[4], -hw, -hh, this.w, this.h);
 		}
 	});
 	_sprite.ClassName = "Sprite";
 	//ע���ൽ�๤����
 	ClassFactory.regClass(_sprite.ClassName, _sprite);
 }(window))