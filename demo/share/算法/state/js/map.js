/*
* 地图
*/
(function(){
   //定义地图块对象
   function MPoint(r,c,flag)
   {
	  //行
      this.r = r;
	  //列
	  this.c = c;
	  //通过标记
	  this.flag = flag;
	  //地面物体
	  this.mObj = null;
   }
   //从引擎的RenderObj继承
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
	   //闲置地块数组
	   this.nullF = [];
	   this._super();	  
   },  
   reset:function()
   {
	   var sc = this.owner;
	   var r = this.r*2+1;
	   var c = this.c*2+1;
	   var mapData =new Array(r);
	   this.mapData = mapData;
	   this.offX = (sc.w-this.ww*(2*this.c+1))*0.5+(this.ww*0.5)
	   this.offY = (sc.h-this.wh*(2*this.r+1))*0.5+(this.wh*0.5);
	   //创建地图
	   for(var i=0;i<r;i++)
	   {		 
		 mapData[i] = new Array(c);
		 for(var j=0;j<c;j++)
	     {
           mapData[i][j] = new MPoint(i,j,0);
		   if(i==0||i==r-1||j==0||j==c-1)
			 {
			   mapData[i][j].flag = 1;
		     }			  		   
           if(mapData[i][j].flag==1)
		     {
			  var bar = sc.createRObj(Sprite.ClassName);					  					  
			  var anims = ResManager.getAnimationsByName("sprite",this.wName);
			  bar.setAnims(anims);
			  bar.w = this.ww;
			  bar.h = this.wh;	                   
			  bar.moveTo(this.offX+j*this.ww,this.offY+i*this.wh);
			 }
		   else
			 {
			  //放入闲置地表中,存放索引号
			  this.nullF.push(i*c+j);
			 }
	     }    
	   }		 		   
   }, 
   //定位屏幕坐标到数组位置
   mapSCPos:function(x,y)
   {
	  return [(y-this.offY+this.wh*0.5)/this.wh|0,(x-this.offX+this.ww*0.5)/this.ww|0];
   },
   //定位数组位置到屏幕坐标
   mapPosToSC:function(r,c)
   {
      return [this.offX+this.ww*c|0,this.offY+this.wh*r|0];
   },
   //随机找一个闲置的地表,可放置物体
   getRandNull:function()
   {
	 var idx = this.nullF[MathUtil.randInt(this.nullF.length-1)];
	 var c = (this.c<<1)+1;
     return [idx/c|0,idx%c];
   },
   //获取r行c列地块在数组中的索引号
   getArrIdx:function(r,c)
   {
	  var mr = (this.r<<1)+1,
		  mc = (this.c<<1)+1;
	  return r*mc+c;
   },
   //设置地面物体
   setMObj:function(r,c,mObj)
   {
	   var md=this.mapData[r][c];
	   if(!md.mObj&&md.flag==0)
	   {
          md.mObj=mObj;
	   }
	   //从闲置地表移出
	   var idx = this.getArrIdx(r,c);
	   ArrayUtil.removeFn(this.nullF,function(i){return i==idx});
   },
   //清除地面物体
   clearMObj:function(r,c)
   {       
	  if(this.mapData[r][c].mObj!=null)
	   {
         this.mapData[r][c].mObj = null;
         var idx = this.getArrIdx(r,c);
	     this.nullF.push(idx);
	   }	  
   },
   //获取地面物体
   getMObj:function(r,c)
   {	  
      return this.mapData[r][c].mObj; 
   },  
   //获取地图障碍标记
   isBar:function(r,c)
   {
	  return this.mapData[r][c].flag==1;
   },
   render:function(ctx)
   {
     return true;
   }
  });
  Map.ClassName = "Map";
  //地面物体标记
  Map.SFlag = {
	 ANT:0,
     WATER:1,
     FOOD:2,
     NEST:3,
     POISON:4
  }
  //注册CObj类
  ClassFactory.regClass(Map.ClassName,Map);
}())