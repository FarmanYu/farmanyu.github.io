(function(win) {
	var _Game = Game.extend({
		map: null,
		player: null,
		selPoint: null,
		init: function() {
			this._super();
			var scm = this.sceneManager;
			//��������
			var x = (document.body.clientWidth - 500) * 0.5;
			var sc = scm.createScene([{
				"x": x,
				"w": 500,
				"h": 400,
				"name": "main"
			}]);
			this.loadRes(sc);
		},
		//������Դ
		loadRes: function(scene) {
			var self = this;
			ResManager.loadRes("data/res.json", function() {
				//��������
				self.initSprite();
				//��ʼ�ɱ�
				self.run(60);
			});
		},
		initSprite: function() {
			var sc = this.sceneManager.getScene("main");
			var r = 5,
				c = 6;
			//������ͼ
			this.map = sc.createRObj(Map.ClassName, [r, c, "bar", 32, 32]);
			this.map.reset();
			//��������
			this.player = sc.createRObj(Player.ClassName);
			var anims = ResManager.getAnimationsByName("sprite", "bul0");
			this.player.setAnims(anims);
			this.player.w = 32;
			this.player.h = 32;
			var p = this.map.mapPosToSC(1, 1);
			this.player.moveTo(p[0], p[1]);
			//����ѡ���
			this.selPoint = sc.createRObj(Sprite.ClassName);
			this.selPoint.setAnims(ResManager.getAnimationsByName("sprite", "bul1"));
			this.selPoint.w = this.selPoint.h = 16;
			this.selPoint.moveTo(p[0], p[1]);
		}
	})
	//����ȫ��TGame
	win.TGame = new _Game();
	//��������¼� 
	Mouse.sDLG("down", function(e) {
		//��ȡ��Ϸ��������
		var sc = TGame.sceneManager.getScene("main");
		var gx = sc.x,
			gy = sc.y,
			mx = Mouse.gX(),
			my = Mouse.gY();
		//ת��������굽��Ϸ��������ϵ
		var cd = MathUtil.mapSToCoord(mx, my, gx, gy);
		var cd1 = TGame.map.mapSCPos(cd[0], cd[1]);
		var cd2 = TGame.map.mapPosToSC(cd1[0], cd1[1]);
		var start = TGame.map.mapSCPos(TGame.player.x, TGame.player.y);
		//����·��
		var path = TGame.map.findPath(start, cd1);
		if (path != null) {
			TGame.selPoint.moveTo(cd2[0], cd2[1]);
			TGame.player.startMove(path);
		}
	});
}(window))