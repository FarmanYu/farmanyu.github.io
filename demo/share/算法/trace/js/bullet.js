/*
* Bullet��
*/
(function(){
  //�������RenderObj�̳�
   Bullet = Sprite.extend({   
   //��дupdate
   update:function()
   {	
     var p = TGame.player,
		 dx,dy;
	 /*����㷨
	 this.dx = (this.x>p.x)?-1:1;
     this.dy = (this.y>p.y)?-1:1;	 
     */
	//����׷���㷨
	/* var vx = p.x-this.x,
		 vy = p.y-this.y,
         rlen = 1/Math.sqrt(vx*vx+vy*vy),
	     dx = vx*rlen,
		 dy = vy*rlen;
	 this.dx = dx*2;
	 this.dy = dy*2;
     this._super();
	 */
	 //�����㷨
	 var dvx = p.dx-this.dx,
		 dvy = p.dy-this.dy,
         dx = p.x-this.x,
		 dy = p.y-this.y,
         len1 = Math.sqrt(dvx*dvx+dvy*dvy),
         len2 = Math.sqrt(dx*dx+dy*dy),  
		 t = len2/len1,		 
	     ndx=p.x+t*p.dx,
		 ndy=p.y+t*p.dy;

	 var vx = ndx-this.x,
		 vy = ndy-this.y,
         rlen = 1/Math.sqrt(vx*vx+vy*vy),
	     xdx = vx*rlen,
		 xdy = vy*rlen;
	 this.dx = xdx*3;
	 this.dy = xdy*3;
     this._super();
   }
  });
  Bullet.ClassName = "Bullet";
  //ע��Ball��
  ClassFactory.regClass(Bullet.ClassName,Bullet);
}())