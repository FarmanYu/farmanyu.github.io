(function (exports) {
	var msg = {
		show : function (text) {
			var ww = $(document).width(),
			wh = $(document).height();

			var dmsg = $("#msg");
			dmsg.text(text).css({
				"left" : (ww - 170) * 0.5,
				"top"  : (wh - 170) * 0.5
			});
			dmsg.fadeIn(500, function () {
				$(this).fadeOut(3000);
			});
		}
	};
	exports.msg = msg;
})(this);