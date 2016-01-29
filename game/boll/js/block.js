/*
* Blockש����
*/
(function(){
  //�������RenderObj�̳�
  Block = Sprite.extend({
  		init : function (name) {
  			//���弶��
  			this.lev = 1;
  			//�����д���
  			this.hit = 0;
  			this._super(name);
  		},
  		update : function () {
  			//����Ƿ���ײ��,�����ײ�����¼�
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
  		//���¶���
  		updateAnim : function () {
  			this.setCAnim("s" + (this.lev - this.hit));
  		},
  		//�ж��Ƿ��������
  		canRelease : function () {
  			return (this.hit == this.lev);
  		},
  		//��ȡ����
  		getScore : function (lev) {
  			return this.lev * 10;
  		}
  	});
  Block.ClassName = "Block";
  //ע��Ball��
  ClassFactory.regClass(Block.ClassName, Block);
}())