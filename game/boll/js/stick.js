/*
* Stick��
*/
(function(){
  //�������RenderObj�̳�
  Stick = Sprite.extend({
  		//��дupdate
  		update : function () {
  			//��ȡscene�߽�
  			var w = this.owner.w,
  			hw = this.w * 0.5;
  			//���ư���
  			if (Key.pressed(Key.SPACE)) {
  				if (StickGame.state == 0) {
  					StickGame.launchBall();
  				}
  			}
  			if (Key.pressed(Key.A)) {
  				if (this.x > hw) {
  					this.move(-5, 0);
  				}
  			}
  			if (Key.pressed(Key.D)) {
  				if (this.x < (w - hw)) {
  					this.move(5, 0);
  				}
  			}
  			//�����ײ��,�����ײ���򴥷��¼�
  			var ball = StickGame.ball,
  			bsx = this.x - this.w * 0.5 - ball.r,
  			bex = bsx + this.w + ball.r,
  			bsy = this.y - this.h * 0.5 - ball.r,
  			bey = this.y + this.h * 0.5 + ball.r;
  			if (ball.x >= bsx && ball.x <= bex && ball.y >= bsy && ball.y <= bey) {
  				StickGame.fireEvent(new Event(this, StickGame, StickGame.doStickCollide));
  			}
  		}
  	});
  Stick.ClassName = "Stick";
  //ע��Ball��
  ClassFactory.regClass(Stick.ClassName, Stick);
}());