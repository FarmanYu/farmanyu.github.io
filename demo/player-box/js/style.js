/**
 * 创建canvas对象，绘制在内存中
 */
void function(){
	var canvasbg = {
		DrawPlayBtn : function(){
            var playBtn = $("#play");
			var w = playBtn.width(), 
                h = playBtn.height();
			var nbg = document.getCSSCanvasContext("2d","play", w , h);
			nbg.fillStyle = "#bec8d5";
			nbg.beginPath();
			nbg.moveTo(0 , 0);
			nbg.lineTo(0 , h/2);
			nbg.lineTo(w , h/2);
			nbg.fill();
			nbg.beginPath();
			nbg.moveTo(0 , h/2);
			nbg.lineTo(0 , h);
			nbg.lineTo(w , h/2);
			nbg.fill();
		},
		DrawStopBtn : function(){
            var playBtn = $("#play");
			var w = playBtn.width(), 
                h = playBtn.height();
			var st = 4, ww = 8;
			var nbg = document.getCSSCanvasContext("2d","stop", w , h);
			nbg.fillStyle = "#bec8d5";
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
			//nbg.fillStyle = "#9e9bac";
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
		DrawPrevBtn : function(){
			var priBtn = $("#pri");
			var w = priBtn.width(), 
                h = priBtn.height();
            var half = w * 0.5,
                limit = 0;
			var nbg = document.getCSSCanvasContext("2d","pri", w , h);
			nbg.fillStyle = "#bec8d5";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(half , 0);
			nbg.lineTo(half , h/2 - limit);
			nbg.lineTo(w  , 0);
			nbg.lineTo(w  , h/2);
			nbg.fill();
			//nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(half , h);
			nbg.lineTo(half , h/2 + limit);
			nbg.lineTo(w  , h);
			nbg.lineTo(w  , h/2);
			nbg.fill();
		},
		DrawNextBtn : function(){
			var nextBtn = $("#next");
			var w = nextBtn.width(), 
                h = nextBtn.height();
            var half = w * 0.5,
                limit = 0;
			var nbg = document.getCSSCanvasContext("2d","next", w , h);
			nbg.fillStyle = "#bec8d5";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(0  , 0);
			nbg.lineTo(half , h/2 - limit);
			nbg.lineTo(half , 0);
			nbg.lineTo(w  , h/2);
			nbg.fill();
			//nbg.fillStyle = "#9e9bac";
			nbg.beginPath();
			nbg.moveTo(0  , h/2);
			nbg.lineTo(0  , h);
			nbg.lineTo(half , h/2 + limit);
			nbg.lineTo(half , h);
			nbg.lineTo(w  , h/2);
			nbg.fill();
		}
	};
    canvasbg.DrawPlayBtn();
    canvasbg.DrawStopBtn();
    canvasbg.DrawPrevBtn();
    canvasbg.DrawNextBtn();
}();