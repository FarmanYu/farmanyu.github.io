/*
 * EndScene��
 */
(function() {
	//�������Scene�̳�
	EndSC = Scene.extend({
		init: function(x, y, name) {
			this._super({
				"x": x,
				"y": y,
				"w": 400,
				"h": 600,
				"name": name
			});
			this.isRetry = false;
			this.initUI();
		},
		//��ʼ��UI
		initUI: function() {
			this.initStartUI();
		},
		//��ʼ��StartGame UI
		initStartUI: function() {
			var self = this;
			var sDiv = $("<div id='sDiv' align='center' style='cursor:pointer;position:absolute;border-bottom:1px solid white;left:100px;top:300px;color:white;font-size:18px;line-height:18px;height:18px;width:200px;'>Return To Title</div>")
			sDiv.click(function() {
				self.isRetry = true;
			})
			this.holder.append("<div align='center' style='position:absolute;left:100px;top:240px;color:Red;font-size:36px;line-height:36px;height:38px;width:200px;'>Game Over</div>");
			this.holder.append("<div align='center' style='position:absolute;left:100px;top:180px;color:Red;font-size:36px;line-height:36px;height:38px;width:200px;'>Score:" + ShootGame.cfg.score + "</div>");
			this.holder.append(sDiv);
		}
	});
	EndSC.ClassName = "EndSC";
	//ע�����������
	ClassFactory.regClass(EndSC.ClassName, EndSC);
}())