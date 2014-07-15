/*
* Bird碰撞粒子效果类
*/
(function(){    
   //Bird碰撞粒子效果类
   BoomParticle = Particle.extend({
	 init:function(sp,animName)
	 {		 
		 this._super();
		 //获取动画帧
		 var anim = ResManager.getAnimationsByName("sprite",sp);
		 //随机获取动画
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
    //注册Boom到类工厂
   BoomParticle.ClassName = "BoomParticle"; 
   ClassFactory.regClass(BoomParticle.ClassName,BoomParticle);   
}())