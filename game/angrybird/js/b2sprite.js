/*
* b2Sprite��
*/
(function(){
  //�������Sprite�̳�
     B2Sprite = Sprite.extend({
     init:function()
     {
       //�����Ѫ������ײ����� 
	   this.hp = 12;
	   //�Ƿ���ײ��
	   this.isColled = false;
	   this.isDead = false;
	   //��Ӧbox2d�е���������
       this.b2Obj = null;
	   this._super();
	 },
     //��һ��b2Obj����
     bindB2Obj:function(b2Obj)
     {
         //��box2d������
		 this.b2Obj = b2Obj;
		 b2Obj.SetUserData(this);
	 },  
	 //ͬ����box2d��������	 
     syncToB2:function()
	 {	   		 
	   if(this.b2Obj!=null)
	    {
		   //��ȡ���嵱ǰλ��
	       var pos = this.b2Obj.GetPosition();	
		   this.x = B2Util.lenToScn(pos.x);
		   this.y = B2Util.lenToScn(pos.y);
		   //��ȡ����Ƕ�
		   var ang = this.b2Obj.GetAngle();
		   this.deg = MathUtil.rad2deg(ang);
	    }       
	 },
     //����Ѫ��
     reduceHP:function(del)
	 {		
		 this.hp -=del;
	 },
	 //�Ƿ�ﵽ�Ƴ�Ҫ��
	 isRemovable:function()
	 {
        return (this.hp<=0);
	 },
     //����,���������ʵ��Ч��
	 dead:function()
     {
		//ɾ��box2d�еĹ������� 
		if(this.b2Obj)
		{
		  B2Util.remove(this.b2Obj);
		}		
		//�ӳ�����������ɾ������ 
		this.owner.removeRObj(this);
		this.isDead = true;
	 },
     //��д���·��� 
     update:function()
	 {
	   this.syncToB2();
	 }
   })
   //ע��pig���๤��
   B2Sprite.ClassName = "B2Sprite";
   ClassFactory.regClass(B2Sprite.ClassName,B2Sprite);
}())