/*
* Stick类
*/
(function(){
  //从引擎的RenderObj继承
  Stick = Sprite.extend({
  		//重写update
  		update : function () {
  			//获取scene边界
  			var w = this.owner.w,
  			hw = this.w * 0.5;
  			//控制按键
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
  			//检测碰撞球,如果碰撞到则触发事件
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
  //注册Ball类
  ClassFactory.regClass(Stick.ClassName, Stick);
}());