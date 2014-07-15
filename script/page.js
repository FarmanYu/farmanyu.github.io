(function() {
	"use strict";

	var topAnimate = {
		key: "_local_top_ani",
		init: function() {
			if (this.isInit) return;
			this.isInit = true;

			this.width = parseInt(localStorage.getItem(this.key), 10) || 0;
			this.max = $(document.body).width();
			this.interval = null;
			this.speed = 15;
			this.$elem = $("<div>").css({
				"background": "#78d2d8",
				"height": "5px",
				"width": this.width,
				"position": "absolute",
				"top": 0,
				"left": 0
			});
			$('body').append(this.$elem);

		},
		setPlay: function(width) {
			localStorage.setItem(this.key, width);
			this.$elem.width(width);
		},
		play: function() {
			this.run(0);
		},
		run : function(start, isFlash){
			  this.width = start || this.width;
				var self = this;
				var start = new Date().getTime();
				this.interval = setInterval(function() {
					var end = new Date().getTime();
					if (end - start >= 2000) {
						clearInterval(self.interval);
						self.interval = null;
						if(isFlash){
							self.width = 0;
							localStorage.setItem(self.key, 0);
						}
					} else {
						var distance = isFlash ? ((self.max / 30)|0) : (self.max - self.width) / 180;
						var width = (self.width + distance)|0;
						width = self.max > width ? width : self.max;
						self.width = width;
						self.setPlay.call(self, width);
					}
				}, self.speed);
		},
		reflash: function(){
			this.run(this.width, true);
		}
	};
	topAnimate.init();
	topAnimate.reflash();
	window.topAnimate = topAnimate;
	//set document top animate
	$(document).delegate("a","click", function(e) {
			topAnimate.play();
	});
	$(window).on("resize", function(){
			topAnimate.reflash();
	});

})();