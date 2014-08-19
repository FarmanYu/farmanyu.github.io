/*!
 * xengine
 * Copyright 2012 xiangfeng
 * Released under the MIT license
 * Please contact to xiangfenglf@163.com if you hava any question 
 * xengine 工具类
 */
 (function(win){
   //浏览器工具类
   var _bUtil = win.BrowseUtil = {
       //获取浏览器适合的css前缀
	   getPrefix4CSS:function()
	   {
	   }
	 };   
   //JSON工具类
   var _jUtil = win.JSONUtil = {
	   isEmpty:function(obj)
	   {
		   for(var i in obj)
		   {			  
			   return false;			
		   }
		   return true;
	   }
   }
   //资源工具类
   var _rUtil = win.ResUtil = {
     loadFile:function(fileURL,type,fn,sync)
	 {
		var ct = "text/xml;charset=UTF-8";
		var dt = type||"json";
		if(dt=="json")
		{
			ct = "text/x-json;charset=UTF-8";
		}
		$.ajax(
				 {
					  url:fileURL,
					  async:(sync==null?true:sync),					 
					  type:"POST",				  
					  dataType:dt,
					  contentType:ct,
					  error:function()
					   {
						  console.log("Load File ["+fileURL+"] Error!");
					   },
					  success:function(data)
					   {
						  console.log("Load File ["+fileURL+"] Successful!")						 
						  fn(data);	
					   }
				 }
			  );
	 }
   }
   //队列类
   var _queue = win.Queue = function(cap){
	   var _MAXDEF  = 9,
		capacity = cap+1,
		head = 0,
		tail = 0,
		data = [];
		this.empty = function(){ data.length = 0 ;}
		this.isEmpty = function(){ return (head==tail); }
		this.isFull = function(){ return  ((tail+1)%capacity == head); }
		this.add = function(val) 
		{ 
			if(this.isFull())
			{
				return -1;
			}
			data[tail] = val;
			tail = (tail+1)%capacity;
		};
		this.remove = function()
		{
			var result = null;
			if(!this.isEmpty())
			{
				result = data[head];
				head = (head+1)%capacity;
			}
			return result;
		};
   }
   //数组工具类
   var _arrUtil = win.ArrayUtil = {
	   //移出arr中索引为idx的项目
	   removeByIdx:function(arr,idx)
       {
		  arr&&arr.splice(idx,1);        
	   },
	   removeFn:function(arr,fn)
	   {
         var idx=-1;
	     for(var i=0,len=arr.length;i<len;i++)
		 {
		   if (fn(arr[i]))
		   {
			   idx = i;
			   break;
		   }
	     }
		 if(idx!=-1)
			arr.splice(idx,1);
	   },
	   insert:function(arr,pos,ele)
	   {
		  if((arr.length===0&&pos===0)||(pos===arr.length))
		  {
			  this.push(ele);
		  }
		  else if(pos<0||pos>arr.length)
		  {
			  return;
		  }
		  else
		  {
		   var len = arr.length-pos;
		   arr.splice(pos,len,ele,arr.slice(pos));
		  }
	   }
   }
   //数学工具类
   var MathUtil = win.MathUtil = {
      deg2rad:function(angle)
       {
         return angle*0.017453292;
       },
      rad2deg:function(rad)
       {
         return rad*57.29578;
       },
	  randInt:function(min,max)
       { 
		max=max||0;
		min=min||0;
        var step=Math.abs(max-min);
        var st = (arguments.length<2)?0:min;
	    var result ;
	    result = st+(Math.ceil(Math.random()*step))-1;
	    return result;
       }
   }
   //颜色工具
   var ColorUtil = win.ColorUtil = {
     //产生颜色代码,r,g,b值为0~255
     rgb:function(r,g,b)
	 {
		var c = "#"+Number((r<<16)+(g<<8)+b).toString(16);
        return c;
	 }
   }
 }(window))