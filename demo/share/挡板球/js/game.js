/*
 * ��������Ϸ
 */
(function(win) {
	var _stickGame = Game.extend({
		//����
		cfg: null,
		//С�����
		ball: null,
		//�������
		stick: null,
		//��Ϸ״̬
		state: -1,
		//��ʼ����Ϸ	  
		init: function() {
			//��ȡ����������
			this._super();
			var scm = this.sceneManager;
			//��������
			var x = (document.body.clientWidth - 400) * 0.5;
			//��ʼ����
			var tSC = scm.createScene([{
				"x": x,
				"w": 400,
				"h": 500,
				"name": "title"
			}]);
			//��Ϸ����
			var mSC = scm.createScene([{
				"color": "gray",
				"x": x,
				"w": 400,
				"h": 500,
				"name": "main"
			}]);
			//��������
			var eSC = scm.createScene([{
				"x": x,
				"w": 400,
				"h": 500,
				"name": "end"
			}]);
			//��ʼ�����г���
			this.initTSC(tSC);
			this.initMSC(mSC);
			this.initESC(eSC);
			this.initListener();
			this.showScene("title");
			//������Դ
			this.loadRes();
			//��ʼ�ɱ�
			this.run(60);
		},
		//��ʾ����
		showScene: function(name) {
			var sc = this.sceneManager.getScene(name);
			this.sceneManager.bringToTop(sc);
		},
		//��ʼ��title��������Ӽ��ؽ���������ʾ
		initTSC: function(sc) {
			//����UI,�������ؽ�����
			var pBar = $("<div id='pCBar' style='position:absolute;border-radius:3px;border:2px solid yellow;left:50px;top:245px;height:10px;width:300px;'></div>");
			pBar.append("<div id='pBar' style='position:absolute;left:0px;top:0px;overflow:hidden;background-color:red;width:1px;height:9px;top:1px;'></div>");
			sc.holder.append("<div id='pTxt' style='text-align:center;position:absolute;font-size:26px;color:white;height:40px;width:400px;top:210px;'>Loading...</div>");
			sc.holder.append(pBar);
		},
		//��ʼ��main����
		initMSC: function(sc) {
			//����UI
			sc.holder.append("<div id='pLifeTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:10px'>Life:0</div>");
			sc.holder.append("<div id='pLevTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:150px'>Level:1</div>");
			sc.holder.append("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:290px'>Score:000</div>");
		},
		//��ʼ����������
		initESC: function(sc) {
			//����UI
			sc.holder.append("<div id='pEndTxt' style='text-align:center;font-size:35px;position:absolute;border-radius:3px;color:white;left:50px;top:245px;height:10px;width:300px;'>Game Over</div>");
		},
		//������Ϸ������
		initListener: function() {
			var self = this;
			//���Ӽ�����
			var ltn = new AppEventListener({
				"afterRender": function() {
					if (self.state >= 0) {
						//var sc = self.sceneManager.getCurrentScene();
						//������Ϸ����
						if (self.cfg.blockNum == 0) {
							if (self.cfg.level == self.cfg.maxLev) {
								self.showSuccess();
							} else {
								++self.cfg.level;
								self.loadLevel();
							}
						}
						//������Ϸ����
						if (self.cfg.life == 0) {
							self.showGameover();
						}
						//����UI;
						self.updateUI();
					}
				}
			});
			this.addListener(ltn);
		},
		//������Դ
		loadRes: function() {
			var self = this,
				scm = this.sceneManager,
				sc = scm.getScene("main");
			ResManager.loadRes("data/res.json", function() {
					//������Ϸ�����ļ�
					ResUtil.loadFile("data/gamecfg.json", null, function(data) {
						self.cfg = data;
						//��ʾ������
						self.showMain();
					});
				},
				function(total, cur) {
					//��Ⱦ������
					var pro = (cur / total) * 100 | 0;
					$("#pTxt").text("Loading:" + pro + "%");
					$("#pBar").width(pro * 3);
				});
		},
		//��ʾ��Ϸ������
		showMain: function() {
			this.loadCfg();
			this.showScene("main");
		},
		//��ʾ�ɹ�����
		showSuccess: function() {
			$("#pEndTxt").text("Mission Complete!");
			this.showScene("end");
		},
		//��ʾGameover
		showGameover: function() {
			$("#pEndTxt").text("Game Over!");
			this.showScene("end");
		},
		//�����ü�����Ϸ
		loadCfg: function() {
			var self = this,
				sc = this.sceneManager.getScene("main");
			//�����������ݴ�������

			function createStick(sc) {
				var cfg = self.cfg.stick;
				var st = sc.createRObj(Stick.ClassName, ["stick"]);
				st.w = cfg.w;
				st.h = cfg.h;
				var mx = sc.w * 0.5;
				st.moveTo(mx, sc.h - 30);
				//��ȡ���嶯��������Դ
				var anims = ResManager.getAnimationsByName(cfg.resName, cfg.fName);
				st.setAnims(anims);
				self.stick = st;
			}
			//�����������ݴ�������

			function createBall(sc) {
				var cfg = self.cfg.ball;
				var ball = sc.createRObj(Ball.ClassName, ["ball", cfg.r]);
				self.ball = ball;
				//��ȡС�򶯻�������Դ
				var anims = ResManager.getAnimationsByName(cfg.resName, cfg.fName);
				ball.setAnims(anims);
			}
			createStick(sc);
			createBall(sc);
			this.loadLevel();
		},
		//���عؿ�
		loadLevel: function() {
			var self = this
			sc = this.sceneManager.getScene("main");
			//�����������ݴ���ש��

			function createBlock(sc) {
				//��ȡ��ǰ����
				var lev = self.cfg.level,
					cfg = self.cfg["lev" + lev],
					bcfg = self.cfg.block;
				//��ȡש�鶯��������Դ
				var anims = ResManager.getAnimationsByName(bcfg.resName, bcfg.fName);
				var bOffY = 60;
				for (var i = 0; i < cfg.length; i++) {
					for (var j = 0; j < cfg[i].length; j++) {
						var bData = cfg[i][j];
						if (bData > 0) {
							var bk = sc.createRObj(Block.ClassName);
							bk.setAnims(anims, "s" + bData);
							bk.lev = bData;
							bk.w = bcfg.w;
							bk.h = bcfg.h;
							bk.moveTo(j * bk.w + (bk.w * 0.5), bOffY + i * bk.h);
							++self.cfg.blockNum;
						}
					}
				}
			}
			//����ש��
			createBlock(sc);
			//��λ��Ϸ
			this.resetGame();
		},
		//��λ��
		resetBall: function() {
			this.ball.moveTo(this.stick.x, this.stick.y - (this.stick.h + this.ball.h) * 0.5 - 1);
			this.ball.dx = this.ball.dy = 0;
		},
		//��λ��Ϸ״̬
		resetGame: function() {
			this.resetBall();
			this.state = 0;
		},
		//������ 
		launchBall: function() {
			this.ball.dx = 5;
			this.ball.dy = -5;
			this.state = 1;
		},
		//������Ϸ�в������¼�
		fireEvent: function(e) {
			e.exec();
		},
		//���·���
		updateScore: function() {
			$("#pScTxt").text("Score:" + this.cfg.score);
		},
		//���¼���
		updateLevel: function() {
			$("#pLevTxt").text("Level:" + this.cfg.level);
		},
		//������
		updateLife: function() {
			$("#pLifeTxt").text("Life:" + this.cfg.life);
		},
		//����UI
		updateUI: function() {
			this.updateScore();
			this.updateLevel();
			this.updateLife();
		},
		//������ײש���¼�
		doBlockCollide: function(sender) {
			var sc = sender.owner;
			this.cfg.score += sender.getScore();
			//С�򷴵�
			this.ball.dy = -this.ball.dy;
			if (sender.canRelease()) {
				sc.removeRObj(sender);
				--this.cfg.blockNum;
			} else {
				sender.updateAnim();
			}
		},
		//������ײ�����¼�
		doStickCollide: function(sender) {
			//С�򷴵�
			this.ball.dy = -this.ball.dy;
			this.ball.dx += MathUtil.randInt(-1, 2);
		},
		//������û�ӵ��¼�
		doLose: function(sender) {
			--this.cfg.life;
			this.resetGame();
		}
	});
	//����ȫ��StickGame
	win.StickGame = new _stickGame();
}(window))