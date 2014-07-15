(function (exports) {
	var idx = 10;
	/**
	 * @desc 图形渲染类
	 * @param {array} 图形数据
	 * @param {number} 关卡
	 * @param {jquery element} 外容器
	 */
	var FigureRender = function (data, step, outputContainer) {
		this.data = data;
		this.step = step;

		this.targetSelect = [];
		this.id = idx++;
		this.index = this.id;
		this.canvasId = "canvas_" + this.id;
		this.name = "firure_" + this.id;

		this.isSelected = false;
		this.posX = 0;
		this.posY = 0;
		this.Selected = [];
		this.outputContainer = outputContainer || document.body;

		//this.targetColor = "yellow";
		this.targetColor = color.getColor(0);
		this.normalColor = color.getColor(this.id);
	}
	FigureRender.prototype = {
		init : function () {
			var config = StepConf.getStep(this.step);
			this.boxWidth = config.figure.width + config.figure.border;
			this.formatData = this.formatData(this.data);
			this.calcSize(this.formatData);
		},
		bindEvent : function () {
			var self = this;

			//触发新增图形
			self.fire("addFigure", {
				id : this.canvasId,
				target : this
			});

			var overTimer = null;
			$(this.container).bind("mouseover", function () {
				overTimer = setTimeout(function () {
						self.fire("selected", self);
					}, 200);
			});

			$(this.container).bind("mouseout", function () {
				clearTimeout(overTimer);
			});
		},
		/**
		 * @desc 实现事件派发
		 * @param 事件类型 {string}
		 * @param 事件参数
		 */
		fire : function (evtType, param) {
			if (this[evtType]) {
				return this[evtType](param);
			}
		},
		/**
		 * @desc 实现事件绑定
		 * @param 事件类型 {string}
		 * @param 事件函数体 {Function}
		 */
		on : function (evtType, func) {
			this[evtType] = func;
		},
		move : function (x, y) {
			if (this.isMove)
				return;
			this.isMove = true;
			var retX = this.fire("nearX", x);
			var retY = this.fire("nearY", y);
			var nx = retX.value;
			var ny = retY.value;

			$(this.container).css({
				"left" : nx,
				"top" : ny
			});
			//两点是否在map上，是否在map主体内.
			if (retX.isnear && retY.isnear && this.fire("isRepeat", {
					x : nx,
					y : ny
				})) {
				this.isSelected = true;
				this.x = retX.left;
				this.y = retY.top;

				this.posX = nx;
				this.posY = ny;
			} else {
				this.isSelected = false;
			}
			this.isMove = false;
		},
		isInFigure : function (x, y) {
			return this.ctx.isPointInPath(x, y);
		},
		render : function (pos) {
			this.createContainer(pos);
			this.createCanvas();
			this.bindEvent();
			this.renderFigure();
		},
		formatData : function (data) {
			var FormatData = [];
			for (var i = 0; i < data.length; i++) {
				var num = (data[i] < 10) ? ('0' + data[i]) : data[i];
				var item = (num).toString().split('');
				FormatData.push([
						parseInt(item[0], 10),
						parseInt(item[1], 10)
					]);
			}
			return FormatData;
		},
		/**
		 * @desc 绘制图形方法
		 */
		renderFigure : function () {
			var data = this.formatData;
			var selectData = this.Selected;
			var ctx = this.ctx;
			var config = StepConf.getStep(this.step);
			var width = config.figure.width,
                border = config.figure.border,
                i = 0,
                j = 0;

			for (; i < data.length; i++) {
				var x = data[i][1] * (width + border);
				var y = data[i][0] * (width + border);
				var isInMap = this.isSelect(x, y);
				if (isInMap) {
					this.setColor(this.targetColor);
				} else {
					this.setColor(this.normalColor);
				}
				//绘制路径，来判断点是否在canvas中
				ctx.rect(x, y, width, width);
				ctx.fillRect(x, y, width, width);
			}
		},
		/**
		 * @desc 监测点是否在地图中
		 */
		getTargetSelect : function () {
			return this.targetSelect;
		},
		isSelect : function (x, y) {
			var selectData = this.Selected,
			i = 0,
			len = selectData.length,
			isInMap = false;

			for (; i < len; i++) {
				if (x == selectData[i][0] && y == selectData[i][1]) {
					isInMap = true;
					continue;
				}
			}
			return isInMap;
		},
		clear : function () {
			this.ctx.clearRect(0, 0, this.width, this.height);
		},
		calcSize : function (data) {
			if (data.length === 0)
				return;
			var maxX = 0,
			maxY = 0,
			i = 0,
			len = data.length;
			for (; i < len; i++) {
				if (i === 0) {
					maxX = data[i][1];
					maxY = data[i][0];
				} else {
					if (maxX < data[i][1]) {
						maxX = data[i][1];
					}
					if (maxY < data[i][0]) {
						maxY = data[i][0];
					}
				}
			}
			var config = StepConf.getStep(this.step);
			var boxWidth = config.figure.width + config.figure.border;
			this.width = (maxX + 1) * boxWidth;
			this.height = (maxY + 1) * boxWidth;
		},
		createContainer : function (pos) {
			var container = document.createElement("div");
			$(container).addClass("figure");
			$(container).css({
				"position" : "absolute",
				"z-index" : this.index
			});
			this.container = container;
			this.update(pos);
			$(this.outputContainer).append($(container));
		},
		update : function (pos) {
			if (!isNaN(pos.x) && !isNaN(pos.y)) {
				this.pos = pos;
				$(this.container).css({
					"left" : pos.x,
					"top" : pos.y
				});
			}
		},
		setColor : function (color) {
			if (this.ctx) {
				this.ctx.fillStyle = color || this.normalColor;
			}
		},
		setOpacity : function (opacity) {
			$(this.container).css({
				"opacity" : opacity
			});
			this.opacity = opacity;
		},
		setIndex : function (index) {
			$(this.container).css({
				"z-index" : index
			});
			this.index = index;
		},
		clean : function () {
			$(this.container).unbind("mouseover");
			$(this.container).unbind("mouseout");
			this.clear();
			this.canvas.remove();
			this.container.remove();
		},
		createCanvas : function () {
			var canvas = document.createElement("canvas");
			canvas.width = this.width;
			canvas.height = this.height;
			canvas.id = this.canvasId;
			this.ctx = canvas.getContext("2d");
			this.setColor();
			this.ctx.shadowBlur = 1;
			this.ctx.shadowColor = "#fff";
			this.canvas = $(canvas);
			$(this.container).append(this.canvas);
		}
	}

	exports.FigureRender = FigureRender;
})(this);
