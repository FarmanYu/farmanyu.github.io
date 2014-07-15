(function (exports) {

	var Main = {
		init : function () {
			this.step = 1;
			this.maxStep = Data.getMaxStep();
			var self = this;
			this.stepTimes = [];

			$("#gamePlay").click(function (e) {
				e.preventDefault();
				$("#gameUI, #gameIntro").hide();
				$("#main").show();
				self.start();
				Timer.start();
			});
		},
		start : function () {
			var renderData = Data.getStep(this.step);
			$("#step").text(this.step);
            document.title = "第 " + this.step + " 关";
            var hardScore = this.scoreCalc(renderData);
            $("#hardScore").html(hardScore);
			var gameIntance = this.gameIntance = new GameManager(this.step, renderData);
			var mapIntance = this.mapIntance = new MapManager(this.step);

			mapIntance.init();
			mapIntance.render();

			var mapPointsData = mapIntance.getMapPointsData();
			var mapMainData = mapIntance.getMapData();
			gameIntance.init(mapPointsData, mapMainData);
			gameIntance.render();

			var self = this;
			gameIntance.passStep = function () {
				self.passStep();
			}

		},
		passStep : function () {
			var stepTime = Timer.getTime();
			this.stepTimes.push(stepTime);
			Timer.start();
			this.updateStep();
		},
		updateStep : function () {
			if ((this.step + 1) <= this.maxStep) {
				this.step++;
				this.dispose();
				this.start();
			} else {
				this.dispose();

				$("#gameUI, #gameComplete").show();

				var allTime = 0;
				$(this.stepTimes).each(function (idx, item) {
					allTime += item;
				});
				$("#timeInner").html("游戏总耗时: " + allTime + " s");
				console.log("每关对应耗时: " + this.stepTimes);
				$("#main").hide();

				var self = this;
				$("#gameTry").click(function (e) {
					e.preventDefault();
					$("#gameUI, #gameComplete").hide();
					$("#main").show();
					self.step = 1;
					self.start();

					Timer.start();
				});
			}
		},
		dispose : function () {
			this.gameIntance.dispose();
			this.mapIntance.dispose();
			this.gameIntance = null;
			this.mapIntance = null;
		},
        scoreCalc : function(data){
            var score = 5;
            
            for(var x = 0;x < data.length; x++){
                if(data[x].length > 9){
                    score += 1;
                }
                if(data[x].length < 3){
                    score -= 1;
                }
            }
            switch(data.length){
                case 3:
                    score -= 8;
                    break;
                case 4:
                    score -= 4;
                    break;
                case 5:
                    score -= 3;
                    break;
                default:
                    score -= 1;
                    break;
                
            }
            score  = (score < 1) ? 1 : score;
            score  = (score > 5) ? 5 : score;
            var html = "";
            for(var i = 0;i<score;i++){
                html += "★";
            }
            return html;
        }
	};

	exports.game = Main;
})(this);