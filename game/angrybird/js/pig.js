/*
* pig��
*/
(function(){
     //�������Sprite�̳�
     Pig = B2Sprite.extend({
     init:function(r)
     {
       this.r = r;
	   this.sCtx = new StateContext(this);     
	   this.regState();  
	   this._super();
	   this.score = 2000;
	   this.sCtx.changeState("idle");
	 }, 
	 //ע��״̬��
     regState:function()
     {
       this.sCtx.regState(new IdleState("idle",this.sCtx));
     },		     
	 //����״̬����
     update:function()
	 {
	   this.sCtx.update();
	 },
     //��ȡ��ǰ״̬
	 getState:function()
     {
		 return this.sCtx.currState.type;
	 },
     //��ӵ�b2world������
	 addToB2Word:function()
	 {
		var body = B2Util.createRoundBody(this.r,this.x,this.y,4,0.5,0.2);
		this.bindB2Obj(body);
	 },
      //��д��������  
     dead:function()
	 {        		
		this._super();
        TGame.createBoom(this.x,this.y);
		//��ʾ����
		TGame.createScore(this.x,this.y,{"txt":this.score,"col":"green","f_size":34,"l_time":1000});
	 }
   })
   //ע��pig���๤��
   Pig.ClassName = "Pig";
   var IdleState = State.extend({
       change:function()
	   {
         var pig = this.ctx.owner;		 
	   },
       update:function()
       {
          var pig = this.ctx.owner;	
          pig.syncToB2();
	   }
   });
   ClassFactory.regClass(Pig.ClassName,Pig);
}())