/*
* Bird��ײ����Ч����
*/
(function(){    
   //Bird��ײ����Ч����
   BoomParticle = Particle.extend({
	 init:function(sp,animName)
	 {		 
		 this._super();
		 //��ȡ����֡
		 var anim = ResManager.getAnimationsByName("sprite",sp);
		 //�����ȡ����
         var animNames = anim.getAllNames();
		 animName = animName||animNames[MathUtil.randInt(animNames.length)];
		 this.setAnims(anim,animName);
	 },
	 render:function(ctx)
	 {
		var lratio = this.age/this.life;		
	    var sc = this.sSize+(this.eSize-this.sSize)*lratio;
	    this.scaleX = this.scaleY = sc;
        this._super(ctx);
	 }
	});
    //ע��Boom���๤��
   BoomParticle.ClassName = "BoomParticle"; 
   ClassFactory.regClass(BoomParticle.ClassName,BoomParticle);   
}())