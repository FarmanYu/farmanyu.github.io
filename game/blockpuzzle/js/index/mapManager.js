(function (exports) {
    var MapManager = function(step){
        this.container = null;
        this.step = step;
        this.fillStyle = "#aaa";
    }
    MapManager.prototype = {
        init : function(){
            this.container = $("#main");
            this.makeConfig();
        },
        makeConfig : function(){
            var config = StepConf.getStep(this.step);
            var boxWidth = config.figure.width + config.figure.border;
            this.maxW = config.box.w  + 2 * (config.box.w - 1);
            this.width  = this.maxW * boxWidth;
            this.maxH = config.box.h  + 2 * (config.box.h - 1);
            this.height = this.maxH * boxWidth;
            
            this.left = (this.container.width() - this.width ) * 0.5;
            this.top  = 10;
        },
        render : function(){
            this.createBackground();
            this.createMain();
            //this.helpMap();
            
            var config = StepConf.getStep(this.step);
            var width  = config.figure.width ;
            var mapData = this.getMapData();
            for(var i=0;i<mapData.x.length;i++){
                for(var j=0;j<mapData.y.length;j++){
                    var x = mapData.x[i] - this.left;
                    var y = mapData.y[j] - this.top;
                    this.ctx.fillRect(x, y, width, width);
                }
            }
        },
        createBackground : function(){
            var container = $("<div />").css({
                "position" : "absolute",
                "z-index" : 1,
                "left"  : this.left,
                "top"   : this.top,
                "width" : this.width,
                "height" : this.height
            });
            this.backgroundContainer = container;
            this.container.append(container);
        },
        createMain : function(){
            var canvas = document.createElement("canvas");
            canvas.width  = this.width;
            canvas.height = this.height;
            this.ctx = canvas.getContext("2d");
            this.ctx.fillStyle = this.fillStyle;
            this.backgroundContainer.append($(canvas));
        },
        helpMap : function(){
            var config = StepConf.getStep(this.step);
            var width  = config.figure.width ;
            var border = config.figure.border;
            var boxWidth = width + border;
            var data = this.getMapPointsData();
            
            for(var i=0;i<this.maxW;i++){
                for(var j=0;j<this.maxH;j++){
                    var oDiv = $("<div />").css({
                        "background-color" : "#fff",
                        "width"  : 2,
                        "height" : 2,
                        "position" : "absolute",
                        "left" : data.x[i],
                        "top" : data.y[j]
                    });
                    this.container.append(oDiv);
                }
            }
        },
        dispose : function(){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.ctx = null;
            this.backgroundContainer.remove();
        },
        getMapPointsData : function(){
            var mapData = {
                x : [],
                y : []
            };
            var config = StepConf.getStep(this.step);
            var boxWidth = config.figure.width + config.figure.border;
            
            for(var i=0;i<this.maxW;i++){
                mapData.x.push(this.left + i * boxWidth);
            }
            for(var j=0;j<this.maxH;j++){
                mapData.y.push(this.top  + j * boxWidth);
            }
            return mapData;
        },
        getMapData : function(){
            var config = StepConf.getStep(this.step);
            var width  = config.figure.width ;
            var border = config.figure.border;
            var boxWidth = width + border;
            var baseLeft = (config.box.w - 1) * boxWidth;
            var baseTop  = (config.box.h - 1) * boxWidth;
            
            var data = {
                x : [],
                y : []
            };
            
            for(var i=0;i<config.box.w;i++){
                var x = this.left + baseLeft + i * boxWidth;
                data.x.push(x);
            }
            for(var j=0;j<config.box.h;j++){
                var y = this.top + baseTop  + j * boxWidth;
                data.y.push(y);
            }
            return data;
        }
    }

	exports.MapManager = MapManager;
})(this);