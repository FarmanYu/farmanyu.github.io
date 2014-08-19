/*
* ��ͼ
*/
(function(){
   //�����ͼ�����
   function MPoint(r,c,flag)
   {
	  //��
      this.r = r;
	  //��
	  this.c = c;
	  //ͨ�����
	  this.flag = flag;
	  //��������
	  this.mObj = null;
   }
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
	   //���õؿ�����
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
	   //������ͼ
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
			  //�������õر���,���������
			  this.nullF.push(i*c+j);
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
   //�����һ�����õĵر�,�ɷ�������
   getRandNull:function()
   {
	 var idx = this.nullF[MathUtil.randInt(this.nullF.length-1)];
	 var c = (this.c<<1)+1;
     return [idx/c|0,idx%c];
   },
   //��ȡr��c�еؿ��������е�������
   getArrIdx:function(r,c)
   {
	  var mr = (this.r<<1)+1,
		  mc = (this.c<<1)+1;
	  return r*mc+c;
   },
   //���õ�������
   setMObj:function(r,c,mObj)
   {
	   var md=this.mapData[r][c];
	   if(!md.mObj&&md.flag==0)
	   {
          md.mObj=mObj;
	   }
	   //�����õر��Ƴ�
	   var idx = this.getArrIdx(r,c);
	   ArrayUtil.removeFn(this.nullF,function(i){return i==idx});
   },
   //�����������
   clearMObj:function(r,c)
   {       
	  if(this.mapData[r][c].mObj!=null)
	   {
         this.mapData[r][c].mObj = null;
         var idx = this.getArrIdx(r,c);
	     this.nullF.push(idx);
	   }	  
   },
   //��ȡ��������
   getMObj:function(r,c)
   {	  
      return this.mapData[r][c].mObj; 
   },  
   //��ȡ��ͼ�ϰ����
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
  //����������
  Map.SFlag = {
	 ANT:0,
     WATER:1,
     FOOD:2,
     NEST:3,
     POISON:4
  }
  //ע��CObj��
  ClassFactory.regClass(Map.ClassName,Map);
}())