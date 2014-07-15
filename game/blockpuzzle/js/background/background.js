(function(exports){
    var tmp = [];
    var idx = 2;
    var config = StepConf.getStep();
    var background = {
        init : function(){
            var width  = config.box.w;
            var height = config.box.h;
            
            for(var i=0;i<width;i++){
                for(var j=0;j<height;j++){
                    var oli = $("<li />");
                    oli.text("["+i+","+ j +"]");
                    $("#background-data").append(oli);
                }
            }
            this.bindEvent();
        },
        bindEvent : function(){
            var self = this;
            $("#background-data").click(function(e){
                e = e || window.event;
                var target = e.srcElement || e.target;
                    target = $(target);
                if(target[0].tagName.toLowerCase() == "li" 
                && !target.hasClass("actived") 
                && !target.hasClass("select")){
                    var item = eval(target.text()).join("");
                    if(self.checkItem(item)){
                        target.addClass("select");
                        tmp.push(item);
                    }
                }
            });
            $("#background .create").click(function(){
                if(!self.checkData(tmp)) return;
                var end = $("#data-output").val().trim();
                    end = end.split("\n");
                var endData = self.calcData(tmp);
                    end.push( endData.toString() );
                $("#data-output").val(end.join("\n"));
                idx++;
                $("#background-data li.select").css("background-color", color.getColor(idx));
                self.clear();
            });
            $("#background .reset").click(function(){
                self.reset();
                $("#data-output").val("");
            });
        },
        calcData : function(data){
            var minX = 0,
                minY = 0,
                arr = [];
            for(var i=0;i<data.length;i++){
                var item = (data[i]).toString().split("");
                var itemX = parseInt(item[0], 10); 
                var itemY = parseInt(item[1], 10); 
                if(i === 0){
                    minX = itemX;
                    minY = itemY;
                } else{
                    if(itemX < minX){
                        minX = itemX;
                    }
                    if(itemY < minY){
                        minY = itemY;
                    }
                }
            }
            console.log(minX, minY);

            for(var j=0;j<data.length;j++){
                
                var itemData = (data[j]).toString().split("");
                var x = parseInt(itemData[0], 10);
                var y = parseInt(itemData[1], 10);
                
                arr[j] = (x - minX) + "" + (y - minY);
            }
            return arr;
        },
        clear : function(){
            tmp = [];
            $("#background-data li.select").addClass("actived").removeClass("select");
        },
        reset : function(){
            tmp = [];
            $("#background-data li.actived").removeAttr("style");
            $("#background-data li").removeClass("actived").removeClass("select");
        },
        checkData : function(data){
            var ret = true;
            if(data.length <= config.figure.min){
                alert("图形长度过短! 长度必须大于"+ config.figure.min);
                ret = false;
            }
            return ret;
        },
        checkItem : function(item){
            var ret = false;
            if(tmp.length > 0){
                for(var i =0;i<tmp.length;i++){
                    var data = item.split("");
                    var tmpData = tmp[i].split("");
                    if(Math.abs(data[0] - tmpData[0]) <= 1 && Math.abs(data[1] - tmpData[1]) <= 1){
                        ret = true;
                    } 
                }
                if(!ret){
                    alert("图形必须相连！");
                }
            } else{
                ret = true;
            }
            if(tmp.length >= config.figure.max){
                alert("图形长度过长! 长度必须小于" + config.figure.max);
                ret = false;
            }
            return ret;
        }
    };
    
    exports.background = background;
})(this);