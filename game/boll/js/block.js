/*
* Block砖块类
*/
(function(){
  //从引擎的RenderObj继承
  Block = Sprite.extend({
  		init : function (name) {
  			//定义级别
  			this.lev = 1;
  			//被击中次数
  			this.hit = 0;
  			this._super(name);
  		},
  		update : function () {
  			//检测是否碰撞到,如果碰撞触发事件
  			var ball = StickGame.ball,
  			bsx = this.x - this.w * 0.5 - ball.r,
  			bex = bsx + this.w + ball.r,
  			bsy = this.y - this.h * 0.5 - ball.r,
  			bey = this.y + this.h * 0.5 + ball.r;
  			if (ball.x >= bsx && ball.x <= bex && ball.y >= bsy && ball.y <= bey) {
  				++this.hit;
  				StickGame.fireEvent(new Event(this, StickGame, StickGame.doBlockCollide));
  			}
  		},
  		//更新动画
  		updateAnim : function () {
  			this.setCAnim("s" + (this.lev - this.hit));
  		},
  		//判断是否可以销毁
  		canRelease : function () {
  			return (this.hit == this.lev);
  		},
  		//获取分数
  		getScore : function (lev) {
  			return this.lev * 10;
  		}
  	});
  Block.ClassName = "Block";
  //注册Ball类
  ClassFactory.regClass(Block.ClassName, Block);
}())