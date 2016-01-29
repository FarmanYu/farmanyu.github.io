(function (exports) {
	/**
	 * class CTimer
	 * @param {int} interval
	 * @param {function} actionListener
	 */
	var CTimer = function (interval, actionListener) {
		this._timer = null;
		this._interval = interval;
		this._actionListener = actionListener;
		this._isAlive = false;
		this._startTime = 0;
	}
	CTimer.prototype = {
		isAlive : function () {
			return this._isAlive;
		},
		interrupt : function () {
			if (this._timer)
				clearTimeout(this._timer);
			this._timer = null;
			this._isAlive = false;
			this._startTime = 0;
		},
		setActionListener : function (l) {
			if (typeof l == "function")
				this._actionListener = l;
		},
		start : function () {
			var _this = this;
			this._timer = setTimeout(function () {
					_this.interrupt();
					_this._actionListener.call(_this);
				}, this._interval);
			this._startTime = (new Date()).getTime();
			this._isAlive = true;
		},
		getElapsed : function () {
			return (new Date()).getTime() - this._startTime;
		},
		setInterval : function (interval) {
			if (typeof interval == "number")
				this._interval = interval;
		},
		getInterval : function () {
			return this._interval;
		}
	}
	/**
	 * create color gradient
	 */

	function colour(r, g, b) {
		this.r = r;
		this.g = g;
		this.b = b;

		this.toRgba = function (alpha) {
			return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + alpha + ')';
		}
	}

	function rand(n) {
		return (Math.floor(Math.random() * n));
	}

	function gradient(sColor, eColor, step, index) {
		var arrColor = [];
		var aCr = Math.floor((eColor.r - sColor.r) / step);
		var aCg = Math.floor((eColor.g - sColor.g) / step);
		var aCb = Math.floor((eColor.b - sColor.b) / step);

		var nCr = sColor.r + (aCr * index);
		var nCg = sColor.g + (aCg * index);
		var nCb = sColor.b + (aCb * index);

		var cColor = new colour(nCr, nCg, nCb);
		return cColor.toRgba(1);

	}

	/**
	 * class CPlayer object
	 */

	var CPlayer = function(id) {
		this.Timer = null;
		this.ctx = null;
		this.isPlay = false;
            
		this.mSquareCanvas = null;
		this.mSquareColorArr = ['#24AD29', '#808E3D', '#E38E0F', '#24AD29'];

		this.mSquareColorStart = null;
		this.mSquareColorEnd   = null;

		this.mSquareAlphaArr = [0.7, 0.8, 0.9];
		this._init(id);
	}

	CPlayer.prototype = {
		_init : function (id) {
            if(!id)return;
			this.container = $("#" + id);
			this.randomColor();
			var oCanvas = this.container.find('canvas')[0];
            
			this.width  = this.container.width();
			this.height = this.container.height();

			this.mSquareMaxX = Math.floor(this.width  / 18);
			this.mSquareMaxY = Math.floor(this.height / 8);
			this.mSquare = {
				w : (this.width  - 10) /  this.mSquareMaxX,
				h : (this.height - 18) /  this.mSquareMaxY
			}
            
			if (!oCanvas) {
				this.mSquareCanvas = this.createCanvas();
			} else {
				this.mSquareCanvas = oCanvas.getContext('2d');
			}
            this.render();
		},
		play : function() {
            this.stop();
            this.isPlay = true;
            this.start();
		},
        stop : function(){
            this.isPlay = false;
			this.clearInterval();
            this.Timer = null;
        },
		start : function () {
            if(!this.isPlay) return;
			var self = this;
			var time = Math.ceil(rand(120) * .1) * 10 + 30;
			this.Timer = new CTimer(time, function(){
                self.render.call(self);
            });
			this.Timer.start();
		},
		clearInterval : function () {
			this.Timer && this.Timer.interrupt();
		},
		render : function () {
			var arr = [];
			var nTrend = Math.ceil(Math.random() * 10) / 10;

			for (var i = 0; i < this.mSquareMaxX; i++) {
				var n = Math.ceil(this.mSquareMaxY * Math.random() * nTrend);
				arr.push(n);
			}
			this.drewSquare(arr);
			this.start();
		},
		drewSquare : function (arr) {
            var ctx = this.mSquareCanvas;
			var y   = arr.length;
			ctx.clearRect(0, 0, this.width, this.height);
			for (var j = 0; j < y; j++) {
				for (var i = 0; i < arr[j]; i++) {
					ctx.save();

					ctx.fillStyle = gradient(this.mSquareColorStart, this.mSquareColorEnd, arr[j], i);

					var w = Math.ceil(this.mSquare.w - 3);
					var h = Math.ceil(this.mSquare.h - 1.5);
					var x = 7 + (this.mSquare.w * j);
					var y = this.height - (this.mSquare.h * (i + 1)) + 1.5;
					ctx.translate(x, y);
					ctx.fillRect(0, 0, w, h);
					ctx.restore();
				}
			}
		},
		createCanvas : function () {
			var newCanvas = document.createElement("canvas");
			newCanvas.width  = this.width;
			newCanvas.height = this.height;
			this.container[0].appendChild(newCanvas);
			return newCanvas.getContext('2d');
		},
        randomColor : function(){
         //  this.mSquareColorStart = new colour(rand(256), rand(256), rand(256));
            this.mSquareColorStart = new colour(12, 221, 232)
		 //	 this.mSquareColorEnd   = new colour(rand(256), rand(256), rand(256));
			this.mSquareColorEnd   = new colour(48, 141, 160);
        }
	}
	exports.Box = CPlayer;
})(this);