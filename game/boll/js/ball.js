/*
* Ball弹球类
*/
(function(){
  //从引擎的RenderObj继承
  Ball = Sprite.extend({
  		init : function (name, r) {
  			//定义半径
  			this.r = r || 10;
  			this._super(name);
  			this.w = this.h = this.r * 2;
  		},
  		//重写update
  		update : function () {
  			var w = this.owner.w,
  			h = this.owner.h;
  			//如果游戏处于就绪状态，小球跟随挡板移动
  			if (StickGame.state == 0) {
  				StickGame.resetBall();
  			}
  			//到达边界改变速度方向
  			if (this.x < this.r || this.x > w - this.r) {
  				this.dx = -this.dx;
  			};
  			if (this.y < this.r) {
  				this.dy = -this.dy;
  			}
  			if (this.y > StickGame.stick.y) {
  				StickGame.fireEvent(new Event(this, StickGame, StickGame.doLose));
  			}
  			//调用父类方法
  			this._super();
  		}
  	});
  Ball.ClassName = "Ball";
  //注册Ball类
  ClassFactory.regClass(Ball.ClassName, Ball);
}())