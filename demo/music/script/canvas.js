/**
 * class CTimer
 * @param {int} interval
 * @param {function} actionListener
 */
var CTimer = function(interval,actionListener){
	this._timer = null;
	this._interval = interval;
	this._actionListener = actionListener;
	this._isAlive = false;
	this._startTime = 0;
}
CTimer.prototype = {
	isAlive:function(){
		return this._isAlive;
	},
	interrupt:function(){
		if(this._timer)
			clearTimeout(this._timer);
		this._timer = null;
		this._isAlive = false;
		this._startTime = 0;
	},
	setActionListener:function(l){
		if(typeof l == "function")
			this._actionListener = l;
	},
	start:function(){
		var _this = this;
		this._timer = setTimeout(function(){
			_this.interrupt();
			_this._actionListener.call(_this);
		},this._interval);
		this._startTime = (new Date()).getTime();
		this._isAlive = true;
	},
	getElapsed:function(){
		return (new Date()).getTime() - this._startTime;
	},
	setInterval:function(interval){
		if(typeof interval == "number")
			this._interval = interval;
	},
	getInterval:function(){
		return this._interval;
	}
}
/*
 * class draw canvas bg
 *
 */
function DrawBackground(ctx, w , h){
	var nRadius = 10 + Math.ceil(Math.random() * 40);
	var x = Math.ceil(Math.random() * w) , y = Math.ceil(Math.random() * h);
	var nTransparent = Math.floor(Math.random() * 2) / 10;
	var aColor = ['#1C501A','#50622E','#485D1F'];
	ctx.globalAlpha = nTransparent;

	var radgrad = ctx.createRadialGradient(x,y,nRadius - 10,x,y,nRadius + 20);
	radgrad.addColorStop(0, aColor[0]);  
	radgrad.addColorStop(0.7, aColor[1]);  
	radgrad.addColorStop(1, aColor[2]);  
	
	ctx.fillStyle = radgrad;
	ctx.arc(x,y,nRadius + 30,0,Math.PI * 2,true);
	ctx.fill();	
}

/**
 * create color gradient 
 */

function colour( r , g , b){
	this.r = r;
	this.g = g;
	this.b = b;

	this.toRgba = function( alpha ) {
		return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
	}	
}

function rand ( n ){
  return ( Math.floor ( Math.random ( ) * n) );
}

function gradient(sColor , eColor , step , index){
	var aCr = Math.floor((eColor.r - sColor.r) /step);
	var aCg = Math.floor((eColor.g - sColor.g) /step);
	var aCb = Math.floor((eColor.b - sColor.b) /step);
	
	var nCr = sColor.r + (aCr * index);
	var nCg = sColor.g + (aCg * index);
	var nCb = sColor.b + (aCb * index);
	
	var cColor = new colour(nCr , nCg , nCb);
	return cColor.toRgba( 1 );
	
}

/**
 * class CPlayer object
 */

var CPlayer = function(){
	this.Content = null;
	this.Timer   = null;
	this.ctx     = null;
	this.isPlay  = false;
	
	this.mSquareCanvas = null;
	this.mSquareMaxX   = Math.floor(CPlayer.canvasWidth / 26); 
	this.mSquareMaxY   = Math.floor(CPlayer.canvasWidth / 26); 
	this.mSquare = {
		w:(CPlayer.canvasWidth  - 10)/this.mSquareMaxX,
		h:(CPlayer.canvasHeight - 15)/this.mSquareMaxY
	}
	this.mSquareColorArr = ['#24AD29','#808E3D','#E38E0F','#24AD29'];
	
	this.mSquareColorStart = null;
	this.mSquareColorEnd   = null;	
	
	this.mSquareAlphaArr   = [0.7,0.8,0.9];
	this._init();
}
CPlayer.canvasWidth = 660; //canvas widht
CPlayer.canvasHeight = 220; // canvas height
CPlayer.isDrewBg = false;
CPlayer.DrewBg = function(ctx){
	var lineargradient = ctx.createLinearGradient(0,0,0,CPlayer.canvasHeight);
	    lineargradient.addColorStop(1,'rgb(20,20,20)');
	    lineargradient.addColorStop(0,'#090907');
	    ctx.fillStyle = lineargradient;
            ctx.fillRect (0, 0, CPlayer.canvasWidth, CPlayer.canvasHeight); //drew bg color
	for(var i = 0; i< 6;i++){
	    DrawBackground(ctx, CPlayer.canvasWidth , CPlayer.canvasHeight);
	}
}
CPlayer.prototype = {
	_init:function(){
		this.Content = document.querySelector("#player");
		this.removeCanvasWithChangeColor();
		var oCanvas = this.Content.querySelector('canvas');
		oCanvas.width = CPlayer.canvasWidth;
		oCanvas.height = CPlayer.canvasHeight;
		this.mSquareCanvas = oCanvas.getContext('2d');	
	},
	play:function(){
		if( this.isPlay ){ 
		    this.isPlay = false;
		    this._clearInterval();
		} else {
		    this.isPlay = true;
		    this._start();
		}
	},
	_start:function(){
		var me = this;
		var time = Math.ceil(rand( 120 )  * .1 ) * 10 + 30;
		this.Timer = new CTimer(time , me._Render.bind(me));
		this.Timer.start();
	},
	_clearInterval:function(){
		this.Timer.interrupt();
	},
	_Render:function(){
		var arr = [];
		var nTrend = Math.ceil(Math.random() * 10) / 10;

	    for(var i = 0;i < this.mSquareMaxX; i++){
			var n = Math.ceil(this.mSquareMaxY * Math.random() * nTrend);
			arr.push(n);
		}
		if( !this.mSquareCanvas ){
			this.mSquareCanvas = this._createCanvas();
		}
		this._drewSquare(this.mSquareCanvas , arr);
		this._start();
	},
	_drewSquare:function(ctx , arr){
		var y = arr.length;
		ctx.clearRect(0,0,CPlayer.canvasWidth,CPlayer.canvasHeight);
		for(var j = 0; j < y; j++){
			for(var i = 0; i < arr[j]; i++){
				ctx.save();
				
				ctx.fillStyle = gradient(this.mSquareColorStart , this.mSquareColorEnd , arr[j] , i);

				var w = Math.ceil(this.mSquare.w - 3);
				var h = Math.ceil(this.mSquare.h - 1.5);				
				var x = 7 + (this.mSquare.w * j);
				var y = CPlayer.canvasHeight - (this.mSquare.h * (i + 1)) + 1.5;
				ctx.translate(x , y);
				ctx.fillRect(0 ,0, w, h);
				ctx.restore();
			}	
		}
	},
	_createCanvas:function(){
		var newCanvas = document.createElement("canvas");
		newCanvas.width = CPlayer.canvasWidth;
		newCanvas.height = 	CPlayer.canvasHeight;
		newCanvas.style.position = "absolute";
		newCanvas.style.left = 0;
		newCanvas.style.top  = 0;
		this.Content.appendChild(newCanvas);
		return newCanvas.getContext('2d');
	},
	removeCanvasWithChangeColor:function(){
		if(this.mSquareCanvas && this.mSquareCanvas.parentNode){
			this.mSquareCanvas.parentNode.removeChild( this.mSquareCanvas );
		}

		this.mSquareColorStart = new colour(rand( 256 ) , rand( 256 ) , rand( 256 ));
		this.mSquareColorEnd = new colour(255 , rand( 256 ) , rand( 256 ));	
	}
}
/**
 * draw canvas background
 */
void function(){
	var drawCanvasBg = {
		_wrapperBg : function(){
			var oW = document.querySelector('.wrapper');
			var w = oW.offsetWidth || 500;
			var h = oW.offsetHeight || 500;
			var nbg = document.getCSSCanvasContext("2d","box_bg", w , h);
			var max = 5 + rand(20);
			for(var i = 0;i< max;i++){
				DrawBackground( nbg ,w , h);
			}	
		},
		_drawPlayBtn : function(){
			var w = 25, h = 26;
			var nbg = document.getCSSCanvasContext("2d","play_btn", w , h);
			nbg.fillStyle = "#d5d5df";
			nbg.beginPath();
			nbg.moveTo(0 , 0);
			nbg.lineTo(0 , h/2);
			nbg.lineTo(w , h/2);
			nbg.fill();
			nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(0 , h/2);
			nbg.lineTo(0 , h);
			nbg.lineTo(w , h/2);
			nbg.fill();
		},
		_drawRestartBtn : function(){
			var w = 24, h = 26;
			var nbg = document.getCSSCanvasContext("2d","restart_btn", w , h);
			nbg.fillStyle = "#d5d5df";
			nbg.fillRect(0 , 0 , w , h/2);
			nbg.fillStyle = "#9e9bac";
			nbg.fillRect(0 , h/2 , w , h/2);
		},
		_drawStopBtn : function(){
			var w = 24, h =26 ;
			var st = 1 , ww = 8;
			var nbg = document.getCSSCanvasContext("2d","stop_btn", w , h);
			nbg.fillStyle = "#d5d5df";
			nbg.beginPath();
			nbg.moveTo(st , 0);
			nbg.lineTo(st , h/2);
			nbg.lineTo(st + ww  , h/2);
			nbg.lineTo(st + ww , 0);
			nbg.fill();
			nbg.moveTo(w-st-ww , 0);
			nbg.lineTo(w-st-ww , h/2);
			nbg.lineTo(w-st , h/2);
			nbg.lineTo(w-st , 0);
			nbg.fill();
			nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(st , h/2);
			nbg.lineTo(st , h);
			nbg.lineTo(st+ww , h);
			nbg.lineTo(st+ww , h/2);
			nbg.fill();
			nbg.moveTo(w-st-ww , h/2);
			nbg.lineTo(w-st-ww , h);
			nbg.lineTo(w-st , h);
			nbg.lineTo(w-st , h/2);
			nbg.fill();			
		},
		_drawPrevBtn : function(){
			var w = 35, h = 26;
			var nbg = document.getCSSCanvasContext("2d","prev_btn", w , h);
			nbg.fillStyle = "#d5d5df";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(24 , 0);
			nbg.lineTo(24 , h/2 - 7);
			nbg.lineTo(w  , 0);
			nbg.lineTo(w  , h/2);
			nbg.fill();
			nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(24 , h);
			nbg.lineTo(24 , h/2 + 7);
			nbg.lineTo(w  , h);
			nbg.lineTo(w  , h/2);
			nbg.fill();
		},
		_drawNextBtn : function(){
			var w = 35, h = 26;
			var nbg = document.getCSSCanvasContext("2d","next_btn", w , h);
			nbg.fillStyle = "#d5d5df";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(0  , 0);
			nbg.lineTo(11 , h/2 - 7);
			nbg.lineTo(11 , 0);
			nbg.lineTo(w  , h/2);
			nbg.fill();
			nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(0  , h);
			nbg.lineTo(11 , h/2 + 7);
			nbg.lineTo(11 , h);
			nbg.lineTo(w  , h/2);
			nbg.fill();
		},
		_drawMusicBg : function (){
			var w = 6, h = 20;
			var nbg = document.getCSSCanvasContext("2d","music_bg", w , h);
			nbg.fillStyle = "#747277";
			nbg.beginPath();
			nbg.moveTo(0   , 0);
			nbg.lineTo(0   , h/2);
			nbg.lineTo(w-2 , h/2);
			nbg.lineTo(w-2 , 0);
			nbg.fill();
			nbg.fillStyle = "#4A484B";
			nbg.beginPath();
			nbg.moveTo(0   , h/2);
			nbg.lineTo(0   , h);
			nbg.lineTo(w-2 , h);
			nbg.lineTo(w-2 , h/2);
			nbg.fill();			
		},
		_drawMusicActBg : function (){
			var w = 6, h = 20;
			var nbg = document.getCSSCanvasContext("2d","music_act_bg", w , h);
			nbg.fillStyle = "#484848";
			nbg.beginPath();
			nbg.moveTo(0   , 0);
			nbg.lineTo(0   , h/2);
			nbg.lineTo(w-2 , h/2);
			nbg.lineTo(w-2 , 0);
			nbg.fill();
			nbg.fillStyle = "#181619";
			nbg.beginPath();
			nbg.moveTo(0   , h/2);
			nbg.lineTo(0   , h);
			nbg.lineTo(w-2 , h);
			nbg.lineTo(w-2 , h/2);
			nbg.fill();			
		},
		_drawVoiceToUp : function (){
			var w = 18, h = 18 ,ww = 4;
			var nbg = document.getCSSCanvasContext("2d","voicetoup_btn", w , h);
			nbg.fillStyle = "#484848";
			nbg.beginPath();
			nbg.moveTo(0   , h/2);
			nbg.lineTo(0   , (h - ww)/2);
			nbg.lineTo((w - ww)/2   , (h - ww)/2);
			nbg.lineTo((w - ww)/2   , 0);
			nbg.lineTo((w + ww)/2   , 0);
			nbg.lineTo((w + ww)/2   , (h - ww)/2);
			nbg.lineTo(w   , (h - ww)/2);
			nbg.lineTo(w   , h/2);
			nbg.fill();
			nbg.fillStyle = "#181619";
			nbg.beginPath();
			nbg.moveTo(0     , h/2);
			nbg.lineTo(0     , (h + ww)/2);
			nbg.lineTo((w - ww)/2   , (h + ww)/2);
			nbg.lineTo((w - ww)/2   , h);
			nbg.lineTo((w + ww)/2   , h);
			nbg.lineTo((w + ww)/2   , (h + ww)/2);
			nbg.lineTo(w   , (h + ww)/2);
			nbg.lineTo(w   , h/2);
			nbg.fill();			
		},
		_drawVoiceToDown : function (){
			var w = 18, h = 18 ,ww = 4;
			var nbg = document.getCSSCanvasContext("2d","voicetodown_btn", w , h);
			nbg.fillStyle = "#484848";
			nbg.beginPath();
			nbg.moveTo(0 , h/2);
			nbg.lineTo(0 , (h - ww)/2);
			nbg.lineTo(w , (h - ww)/2);
			nbg.lineTo(w , h/2);
			nbg.fill();
			nbg.fillStyle = "#181619";
			nbg.beginPath();
			nbg.moveTo(0 , h/2);
			nbg.lineTo(0 , (h + ww)/2);
			nbg.lineTo(w , (h + ww)/2);
			nbg.lineTo(w , h/2);
			nbg.fill();			
		},
		_drawPlayModeBg : function (){
			var w = 16, h = 15 ,hh = 2.5;
			var nbg = document.getCSSCanvasContext("2d","playmode_bg", w , h);
			nbg.fillStyle = "#484848";
			nbg.fillRect( 0 , 0  ,w ,hh );
			nbg.fillRect( 0 , 5.5  ,w ,hh );
			nbg.fillRect( 0 , 11 ,w ,hh );
		}		
	};	

	for(var name in drawCanvasBg){
	    var fn = drawCanvasBg[name];
	    fn();
	}	
}();

loader.loaded.canvas = true;