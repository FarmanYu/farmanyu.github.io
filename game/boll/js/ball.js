/*
* Ball������
*/
(function(){
  //�������RenderObj�̳�
  Ball = Sprite.extend({
  		init : function (name, r) {
  			//����뾶
  			this.r = r || 10;
  			this._super(name);
  			this.w = this.h = this.r * 2;
  		},
  		//��дupdate
  		update : function () {
  			var w = this.owner.w,
  			h = this.owner.h;
  			//�����Ϸ���ھ���״̬��С����浲���ƶ�
  			if (StickGame.state == 0) {
  				StickGame.resetBall();
  			}
  			//����߽�ı��ٶȷ���
  			if (this.x < this.r || this.x > w - this.r) {
  				this.dx = -this.dx;
  			};
  			if (this.y < this.r) {
  				this.dy = -this.dy;
  			}
  			if (this.y > StickGame.stick.y) {
  				StickGame.fireEvent(new Event(this, StickGame, StickGame.doLose));
  			}
  			//���ø��෽��
  			this._super();
  		}
  	});
  Ball.ClassName = "Ball";
  //ע��Ball��
  ClassFactory.regClass(Ball.ClassName, Ball);
}())