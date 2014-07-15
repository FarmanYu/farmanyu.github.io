(function (exports) {

	var GameManager = function (step, data) {
        this.step = step;
        this.data = data;
        this.maxLength = 0;
        this.mapPonitData = [];
        this.mapMainData = [];
        //数组和对象方式都保存一份，方便调用
		this.figures = [];
        this.figuresObject = {};
        this.finishTarget = {};
        this.eventFigures = {};
        this.container = $("#main");
	}
	GameManager.prototype = {
		init : function (mapPointsData, mapMainData) {
            this.mapPonitData = mapPointsData;
            this.mapMainData  = mapMainData;
            this.bindGolbalEvent();
			for (var i = 0; i < this.data.length; i++) {
				var item = this.data[i];
                this.maxLength += item.length;
				var figureIntance = new FigureRender(item, this.step, this.container);
				figureIntance.init();
                figureIntance.owner = this;
                figureIntance = this.bindEvent(figureIntance);
				this.figures.push(figureIntance);
                this.figuresObject[figureIntance.name] = figureIntance;
			}
		},
        bindEvent : function(intance){
            var self = this;
            var config = StepConf.getStep(this.step);
            
            intance.on("addFigure", function(opt){
                self.eventFigures[opt.id] = opt.target;
            
            });
            
            intance.on("selected", function(figure){
                if(self.target === figure)return;
                self.oldtarget = self.target;
                self.target    = figure;
                self.figures.forEach(function(item){
                    if(item.id === figure.id){
                        figure.fire("setIndex", config.figure.maxZindex);
                    } else {
                        var newIndex = ((item.index - 1) < 1)? 1 : (item.index - 1);
                        item.fire("setIndex", newIndex);
                    }
                });
            });
            
            intance.on("nearX", function(x){
                var xs = self.mapPonitData.x,
                    i = 0,
                    len = xs.length,
                    nx = x,
                    limit = config.figure.limit,
                    isNear = false;
                    
                if (x > xs[i] && x < xs[len - 1]) {
                    for (; i < len; i++) {
                        if (Math.abs(x - xs[i]) < limit) {
                            nx = xs[i];
                            isNear = true;
                            break;
                        }
                    }
                }
                return {
                    value : nx,
                    left : i,
                    isnear : isNear
                }
            });
            
            intance.on("nearY", function(y){
                var ys = self.mapPonitData.y,
                    i = 0,
                    len = ys.length,
                    ny = y,
                    limit = config.figure.limit,
                    isNear = false;
                    
                if (y > ys[i] && y < ys[len - 1]) {
                    for (; i < len; i++) {
                        if (Math.abs(y - ys[i]) < limit) {
                            ny = ys[i];
                            isNear = true;
                            break;
                        }
                    }
                }
                return {
                    value : ny,
                    top : i,
                    isnear : isNear
                };
            });
            
            intance.on("isRepeat" , function(opt){
                var w = self.mapMainData.x.length,
                    h = self.mapMainData.y.length,
                    mapWidth  = (self.mapMainData.x[w - 1] - self.mapMainData.x[0]) / (w - 1) * w,
                    mapHeight = (self.mapMainData.y[h - 1] - self.mapMainData.y[0]) / (h - 1) * h;
                    
                var figureRect = {
                    x : opt.x,
                    y : opt.y,
                    width : opt.width || intance.width,
                    height : opt.height || intance.height
                };
                var mapRect = {
                    x : self.mapMainData.x[0],
                    y : self.mapMainData.y[0],
                    width  : mapWidth,
                    height : mapHeight
                }
                //self.helpRect(mapRect);
                var isIn = area.isRectRepeat(figureRect, mapRect);
                return isIn;
            });
            
            intance.on("checkSelf", function(item){
                if(item.isSelected){
                    //this.isSelected = false;
                    //计算重复多少rect.
                    var width  = config.figure.width + config.figure.border;
                    var data = item.formatData;
                    var select = [],
                        targetSelect = [];
                    for (var i = 0; i < data.length; i++) {
                        var x = data[i][1] * width;
                        var y = data[i][0] * width;
                        var posX = item.posX + x;
                        var posY = item.posY + y;
                        
                        var left = item.x + data[i][1];
                        var top  = item.y + data[i][0];
                        
                        if(item.fire("isRepeat",{
                            x : posX,
                            y : posY,
                            width : width,
                            height: width
                        })){
                            select.push([x, y]);
                            targetSelect.push(left+"_"+top);
                        }
                    }
                    item.Selected = select;
                    item.targetSelect = targetSelect;
                    
                }else{
                    item.Selected = [];
                    item.targetSelect = [];
                }
                item.setOpacity(0.9);
                item.clear();
                item.renderFigure();
                
                self.updateMap(item.name, item.targetSelect);
                
            });
            
            return intance;
        },
        bindGolbalEvent:function(){
            var self = this;
            $(document).bind("mousedown", function (e) {
				e = e || window.event;
				e.preventDefault();
				var ox = e.pageX;
				var oy = e.pageY;
				
				var target = e.srcElement || e.target;
                //对象是否存在
				if (target.id != "" && self.eventFigures[target.id]) {
                    var intanceTarget = self.eventFigures[target.id];
                    var offset = $(intanceTarget.container).position();
					var isIn = intanceTarget.isInFigure(e.offsetX, e.offsetY);
					if (isIn) {
                        intanceTarget.setOpacity(0.7);
						$(document).bind("mousemove", function(evt) {
							evt = evt || window.event;
							evt.preventDefault();
							var nx = evt.pageX - ox;
							var ny = evt.pageY - oy;
							nx = nx + offset.left;
							ny = ny + offset.top;
							nx = nx > 0 ? nx : 0;
							ny = ny > 0 ? ny : 0;

							intanceTarget.move(nx, ny);
						});
					}
				}
			});

			$(document).bind("mouseup", function () {
				$(document).unbind("mousemove");
                self.target && self.target.fire("checkSelf", self.target);
			});        
        },
        unbindGolbalEvent : function(){
            $(document).unbind("mousedown");
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
        },
        /**
         * @desc 检测胜利
         * 
         */
        checkWin : function(){
            var isWin = false;
            var temp = [],
                tempJson = {},
                res = [];
            var finishSelected = this.finishTarget;
            
            for(var name in finishSelected){
                var data = finishSelected[name];
                temp = temp.concat(data);
            }
            for(var i = 0; i < temp.length; i++){
                if(!tempJson[temp[i]]){
                    res.push(temp[i]);
                    tempJson[temp[i]] = 1;
                }
            }
            if(res.length === this.maxLength){   
                isWin = true;
            }
            // winner!!
            if(isWin){
                this.passStep && this.passStep();
            }
        },
        updateMap : function(name, target){
        
            if(this.finishTarget && this.finishTarget[name] !== target){
                this.finishTarget[name] = target;
                if(target.length > 0){
                    this.checkWin();
                }
            }
        },
		render : function () {
			var figures = this.figures,
                left = -40,
                top = 0,
                maxWidth = this.container.width(),
                maxheight = 250,
                index = 0,
                margin = 15;
			for (var i = 0; i < figures.length; i++) {
				var figureIntance = figures[i];
                var itemWidth = figureIntance.width;
                if((left + itemWidth + margin) < maxWidth){
                    left += (itemWidth + margin);
                } else{
                    left = 0;
                    index = i;
                }
                if(index != 0 && i >= index){
                    top = maxheight;
                } else{
                    top = 20;
                }
                
				figureIntance.render({
					x : left,
					y : top
				});
			}
		},
        dispose : function(){
            this.unbindGolbalEvent();
            for (var i = 0; i < this.figures.length; i++) {
				var figure = this.figures[i];
                figure.clean();
			}
        }
	}

	exports.GameManager = GameManager;
})(this);