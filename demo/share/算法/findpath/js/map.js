/*
* ��ͼ
*/
(function(){
   //�������RenderObj�̳�
   Map = Sprite.extend({   
   init:function(r,c,wName,ww,wh)
   {
	   this.r = r;
	   this.c = c;
	   this.ww = ww;
	   this.wh = wh
	   this.wName = wName;
	   this.offX = 0;
	   this.offY = 0;
	   this.mapData = null;
	   this.maze = null;
	   this._super();	  
   },  
   reset:function()
   {
	   var sc = this.owner;
	   var maze = MapUtil.primMaze(this.r,this.c);
	   this.maze = maze;
	   this.mapData = MapUtil.convertArrToAS(maze);
	   this.offX = (sc.w-this.ww*(2*this.c+1))*0.5+(this.ww*0.5)
	   this.offY = (sc.h-this.wh*(2*this.r+1))*0.5+(this.wh*0.5);
	   //������ǽ
	   for(var i=0;i<maze.length;i++)
	   {
		  var m = maze[i];
		  for(var j=0;j<m.length;j++)
		   {
			  if(maze[i][j]==1)
			   {
				  var bar = sc.createRObj(Sprite.ClassName);					  					  
				  var anims = ResManager.getAnimationsByName("sprite",this.wName);
				  bar.setAnims(anims);
				  bar.w = this.ww;
				  bar.h = this.wh;	                   
				  bar.moveTo(this.offX+j*this.ww,this.offY+i*this.wh);
			   }
		   }
	   }
   }, 
   //��λ��Ļ���굽����λ��
   mapSCPos:function(x,y)
   {
	  return [(y-this.offY+this.wh*0.5)/this.wh|0,(x-this.offX+this.ww*0.5)/this.ww|0];
   },
   //��λ����λ�õ���Ļ����
   mapPosToSC:function(r,c)
   {
      return [this.offX+this.ww*c|0,this.offY+this.wh*r|0];
   },
   //����·��
   findPath:function(start,end)
   {
	  var m = MapUtil.convertArrToAS(this.maze);
	  var p = MapUtil.findPathA(m,start,end,m.length,m.length);
	  return p; 
   },   
   render:function(ctx)
   {
     return true;
   }
  });
  Map.ClassName = "Map";
  //ע��CObj��
  ClassFactory.regClass(Map.ClassName,Map);
}())