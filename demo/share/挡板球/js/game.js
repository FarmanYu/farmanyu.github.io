/*
 * 挡板球游戏
 */
(function(win) {
	var _stickGame = Game.extend({
		//配置
		cfg: null,
		//小球对象
		ball: null,
		//档板对象
		stick: null,
		//游戏状态
		state: -1,
		//初始化游戏	  
		init: function() {
			//获取场景管理器
			this._super();
			var scm = this.sceneManager;
			//创建场景
			var x = (document.body.clientWidth - 400) * 0.5;
			//开始场景
			var tSC = scm.createScene([{
				"x": x,
				"w": 400,
				"h": 500,
				"name": "title"
			}]);
			//游戏场景
			var mSC = scm.createScene([{
				"color": "gray",
				"x": x,
				"w": 400,
				"h": 500,
				"name": "main"
			}]);
			//结束场景
			var eSC = scm.createScene([{
				"x": x,
				"w": 400,
				"h": 500,
				"name": "end"
			}]);
			//初始化所有场景
			this.initTSC(tSC);
			this.initMSC(mSC);
			this.initESC(eSC);
			this.initListener();
			this.showScene("title");
			//加载资源
			this.loadRes();
			//开始飞奔
			this.run(60);
		},
		//显示场景
		showScene: function(name) {
			var sc = this.sceneManager.getScene(name);
			this.sceneManager.bringToTop(sc);
		},
		//初始化title场景，添加加载进度条和提示
		initTSC: function(sc) {
			//创建UI,创建加载进度条
			var pBar = $("<div id='pCBar' style='position:absolute;border-radius:3px;border:2px solid yellow;left:50px;top:245px;height:10px;width:300px;'></div>");
			pBar.append("<div id='pBar' style='position:absolute;left:0px;top:0px;overflow:hidden;background-color:red;width:1px;height:9px;top:1px;'></div>");
			sc.holder.append("<div id='pTxt' style='text-align:center;position:absolute;font-size:26px;color:white;height:40px;width:400px;top:210px;'>Loading...</div>");
			sc.holder.append(pBar);
		},
		//初始化main场景
		initMSC: function(sc) {
			//创建UI
			sc.holder.append("<div id='pLifeTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:10px'>Life:0</div>");
			sc.holder.append("<div id='pLevTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:150px'>Level:1</div>");
			sc.holder.append("<div id='pScTxt' style='text-align:left;position:absolute;font-size:26px;color:red;height:40px;width:130px;left:290px'>Score:000</div>");
		},
		//初始化结束场景
		initESC: function(sc) {
			//创建UI
			sc.holder.append("<div id='pEndTxt' style='text-align:center;font-size:35px;position:absolute;border-radius:3px;color:white;left:50px;top:245px;height:10px;width:300px;'>Game Over</div>");
		},
		//增加游戏监听器
		initListener: function() {
			var self = this;
			//增加监听器
			var ltn = new AppEventListener({
				"afterRender": function() {
					if (self.state >= 0) {
						//var sc = self.sceneManager.getCurrentScene();
						//处理游戏过关
						if (self.cfg.blockNum == 0) {
							if (self.cfg.level == self.cfg.maxLev) {
								self.showSuccess();
							} else {
								++self.cfg.level;
								self.loadLevel();
							}
						}
						//处理游戏结束
						if (self.cfg.life == 0) {
							self.showGameover();
						}
						//更新UI;
						self.updateUI();
					}
				}
			});
			this.addListener(ltn);
		},
		//加载资源
		loadRes: function() {
			var self = this,
				scm = this.sceneManager,
				sc = scm.getScene("main");
			ResManager.loadRes("data/res.json", function() {
					//加载游戏配置文件
					ResUtil.loadFile("data/gamecfg.json", null, function(data) {
						self.cfg = data;
						//显示主画面
						self.showMain();
					});
				},
				function(total, cur) {
					//渲染进度条
					var pro = (cur / total) * 100 | 0;
					$("#pTxt").text("Loading:" + pro + "%");
					$("#pBar").width(pro * 3);
				});
		},
		//显示游戏主画面
		showMain: function() {
			this.loadCfg();
			this.showScene("main");
		},
		//显示成功结束
		showSuccess: function() {
			$("#pEndTxt").text("Mission Complete!");
			this.showScene("end");
		},
		//显示Gameover
		showGameover: function() {
			$("#pEndTxt").text("Game Over!");
			this.showScene("end");
		},
		//从配置加载游戏
		loadCfg: function() {
			var self = this,
				sc = this.sceneManager.getScene("main");
			//根据配置数据创建挡板

			function createStick(sc) {
				var cfg = self.cfg.stick;
				var st = sc.createRObj(Stick.ClassName, ["stick"]);
				st.w = cfg.w;
				st.h = cfg.h;
				var mx = sc.w * 0.5;
				st.moveTo(mx, sc.h - 30);
				//获取挡板动画序列资源
				var anims = ResManager.getAnimationsByName(cfg.resName, cfg.fName);
				st.setAnims(anims);
				self.stick = st;
			}
			//根据配置数据创建弹球

			function createBall(sc) {
				var cfg = self.cfg.ball;
				var ball = sc.createRObj(Ball.ClassName, ["ball", cfg.r]);
				self.ball = ball;
				//获取小球动画序列资源
				var anims = ResManager.getAnimationsByName(cfg.resName, cfg.fName);
				ball.setAnims(anims);
			}
			createStick(sc);
			createBall(sc);
			this.loadLevel();
		},
		//加载关卡
		loadLevel: function() {
			var self = this
			sc = this.sceneManager.getScene("main");
			//根据配置数据创建砖块

			function createBlock(sc) {
				//获取当前级别
				var lev = self.cfg.level,
					cfg = self.cfg["lev" + lev],
					bcfg = self.cfg.block;
				//获取砖块动画序列资源
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
			//创建砖块
			createBlock(sc);
			//复位游戏
			this.resetGame();
		},
		//复位球
		resetBall: function() {
			this.ball.moveTo(this.stick.x, this.stick.y - (this.stick.h + this.ball.h) * 0.5 - 1);
			this.ball.dx = this.ball.dy = 0;
		},
		//复位游戏状态
		resetGame: function() {
			this.resetBall();
			this.state = 0;
		},
		//弹射球 
		launchBall: function() {
			this.ball.dx = 5;
			this.ball.dy = -5;
			this.state = 1;
		},
		//触发游戏中产生的事件
		fireEvent: function(e) {
			e.exec();
		},
		//更新分数
		updateScore: function() {
			$("#pScTxt").text("Score:" + this.cfg.score);
		},
		//更新级别
		updateLevel: function() {
			$("#pLevTxt").text("Level:" + this.cfg.level);
		},
		//更新命
		updateLife: function() {
			$("#pLifeTxt").text("Life:" + this.cfg.life);
		},
		//更新UI
		updateUI: function() {
			this.updateScore();
			this.updateLevel();
			this.updateLife();
		},
		//处理碰撞砖块事件
		doBlockCollide: function(sender) {
			var sc = sender.owner;
			this.cfg.score += sender.getScore();
			//小球反弹
			this.ball.dy = -this.ball.dy;
			if (sender.canRelease()) {
				sc.removeRObj(sender);
				--this.cfg.blockNum;
			} else {
				sender.updateAnim();
			}
		},
		//处理碰撞档板事件
		doStickCollide: function(sender) {
			//小球反弹
			this.ball.dy = -this.ball.dy;
			this.ball.dx += MathUtil.randInt(-1, 2);
		},
		//处理球没接到事件
		doLose: function(sender) {
			--this.cfg.life;
			this.resetGame();
		}
	});
	//定义全局StickGame
	win.StickGame = new _stickGame();
}(window))