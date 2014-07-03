/*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question
 * ֡��������
 */
(function(win) {
		//֡��������
		var _frames = win.Frames = Class.extend({
			init: function(name, img, duration) {
				//֡��������
				this.name = name;
				//֡����ÿ֡��������ʱ��
				this.duration = duration | 50; //Ĭ��ÿ֡����50����
				//����ÿ֡λ�ã��ͳ���ʱ����Ϣ
				this.frames = [];
				//��Ӧ�Ķ���֡����ͼ,
				this.img = img;
			},
			//���֡����
			add: function(x, y, w, h, img, dur) {
				var dur = dur || this.duration,
					img = img || this.img;
				this.frames.push([img, x, y, w, h, dur]);
			},
			//����֡����
			insert: function(idx, x, y, w, h, img, dur) {
				var dur = dur || this.duration,
					img = img || this.img;
				ArrayUtil.insert(this.frames, idx, [img, x, y, w, h, dur]);
			},
			//�Ƴ�֡����
			remove: function(idx) {
				this.frames.removeIdx(idx);
			},
			//ɾ������֡
			clear: function() {
				this.frames = [];
			},
			//��ȡ֡����
			get: function(idx) {
				return this.frames[idx];
			},
			//��ȡ����
			getCount: function() {
				return this.frames.length;
			}
		});
		//֡�������϶���,����һ��֡��������
		var _animations = win.Animations = Class.extend({
			init: function() {
				//�������ж���֡
				this.anims = {};
			},
			//��ȡ��������
			getAllNames: function() {
				var ans = [];
				for (var k in this.anims) {
					if (this.anims.hasOwnProperty(k)) {
						ans.push(k);
					}
				}
				return ans;
			},
			//���֡��������
			add: function(name, frames) {
				this.anims[name] = frames;
			},
			//ɾ��֡��������
			remove: function(name) {
				this.anims[name] = null;
			},
			//���֡��������
			clear: function() {
				this.anims = {};
			},
			//��ȡ��ǰ֡����
			get: function(name) {
				return this.anims[name];
			}
		})
		//֡�������ƶ��� 
		var _frameCtrl = win.FrameCtrl = Class.extend({
			init: function(processFrameFN) {
				//ȱʡ����������
				function defProcessFrame() {
					//������һ֡�����ڵ�ʱ��
					this.fDur += FrameState.elapseTime * this.speed;
					//���������ǰ֡�ĳ���ʱ����л�����һ֡
					if (this.fDur >= this.currFrames.frames[this.currFIdx][5]) {
						this.fDur = 0;
						if (this.currFIdx < this.feIdx - 1) {
							++this.currFIdx;
						} else {
							if (this.isCycle) {
								this.currFIdx = this.fsIdx;
							}
						}
					}
				}
				//���ö���������
				this.processFrame = processFrameFN || defProcessFrame;
			},
			//��λ��������
			reset: function() {
				//��ʼ֡����
				this.fsIdx = 0;
				//����֡����
				this.feIdx = this.currFrames.getCount();
				//��ǰ����֡����
				this.currFIdx = 0;
				//�Ƿ�ѭ��
				this.isCycle = true;
				//��ǰ֡�Ѿ�������ʱ��
				this.fDur = 0;
				//�����ٶ�
				this.speed = 1;
			},
			//���õ�ǰ֡����
			setCurrent: function(name) {
				var cFrames = this.anims.get(name);
				if (this.currFrames != cFrames) {
					var oSpeed = this.speed || 1;
					this.currFrames = cFrames;
					this.reset();
					this.speed = oSpeed;
				}
			},
			//��ȡ��ǰ֡����
			getCurrent: function() {
				return this.currFrames;
			},
			//����frames
			setAnims: function(animations, currAnimName) {
				this.anims = animations;
				currAnimName = currAnimName || "def";
				//���õ�ǰ����֡��
				this.setCurrent(currAnimName);
			},
			getCurrFrameIdx: function() {
				return this.currFIdx;
			},
			//��ȡ��ǰ֡
			getCurrFrame: function() {
				return this.currFrames.get(this.currFIdx);
			},
			//��ȡ��һ֡
			getNextFrame: function() {
				this.processFrame();
				return this.currFrames.get(this.currFIdx);
			},
			//�Ƿ������һ֡ 
			isLastFrame: function() {
				return this.currFIdx == this.currFrames.frames.length - 1;
			},
			//�Ƿ��˵�һ֡ 
			isFirstFrame: function() {
				return this.currFIdx == 0;
			}
		})
		//������
		_frames.ClassName = "Frames";
		_frameCtrl.ClassName = "FrameCtrl";
		_animations.ClassName = "Animations"
		//ע���ൽ�๤����
		ClassFactory.regClass(_frames.ClassName, _frames);
		ClassFactory.regClass(_frameCtrl.ClassName, _frameCtrl);
		ClassFactory.regClass(_animations.ClassName, _animations);
}(window))