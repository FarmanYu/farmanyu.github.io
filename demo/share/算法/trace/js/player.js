/*
* Player��
*/
(function(){
  //�������RenderObj�̳�
   Player = Sprite.extend({   
   //��дupdate
   update:function()
   {	  
	   this.dx = this.dy = 0;
	 if(Key.pressed(Key.A))
	   {
		 this.move(-2,0);	
		 this.dx =-2;
	   }
     if(Key.pressed(Key.D))
	   {
		 this.move(2,0);	 
		 this.dx =2;
	   }
     if(Key.pressed(Key.W))
	   {
		 this.move(0,-2);		
		 this.dy =-2;
	   }
     if(Key.pressed(Key.S))
	   {
		 this.move(0,2);	 
		 this.dy =2;
	   }
   }
  });
  Player.ClassName = "Player";
  //ע��Ball��
  ClassFactory.regClass(Player.ClassName,Player);
}())