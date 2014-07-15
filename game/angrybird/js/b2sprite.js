/*
* b2Sprite类
*/
(function(){
  //从引擎的Sprite继承
     B2Sprite = Sprite.extend({
     init:function()
     {
       //物体的血量，碰撞后减少 
	   this.hp = 12;
	   //是否碰撞过
	   this.isColled = false;
	   this.isDead = false;
	   //对应box2d中的物体引用
       this.b2Obj = null;
	   this._super();
	 },
     //绑定一个b2Obj对象
     bindB2Obj:function(b2Obj)
     {
         //绑定box2d中物体
		 this.b2Obj = b2Obj;
		 b2Obj.SetUserData(this);
	 },  
	 //同步到box2d物理数据	 
     syncToB2:function()
	 {	   		 
	   if(this.b2Obj!=null)
	    {
		   //获取物体当前位置
	       var pos = this.b2Obj.GetPosition();	
		   this.x = B2Util.lenToScn(pos.x);
		   this.y = B2Util.lenToScn(pos.y);
		   //获取物体角度
		   var ang = this.b2Obj.GetAngle();
		   this.deg = MathUtil.rad2deg(ang);
	    }       
	 },
     //减少血量
     reduceHP:function(del)
	 {		
		 this.hp -=del;
	 },
	 //是否达到移除要求
	 isRemovable:function()
	 {
        return (this.hp<=0);
	 },
     //死亡,由子类具体实现效果
	 dead:function()
     {
		//删除box2d中的关联对象 
		if(this.b2Obj)
		{
		  B2Util.remove(this.b2Obj);
		}		
		//从场景管理器中删除对象 
		this.owner.removeRObj(this);
		this.isDead = true;
	 },
     //复写更新方法 
     update:function()
	 {
	   this.syncToB2();
	 }
   })
   //注册pig到类工厂
   B2Sprite.ClassName = "B2Sprite";
   ClassFactory.regClass(B2Sprite.ClassName,B2Sprite);
}())