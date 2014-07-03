(function (exports) {

	var time,interval,isStop;
    
    function reset(){
        time = 0;
        times = [];
        clearInterval(interval);
        interval = null;
        isStop = false;
        $("#gameScore").html(time);
    }
    
    function start(){
        reset();
        interval = setInterval(function(){
            if(!isStop){
                $("#gameScore").html(++time);
            }
        }, 1000);
    }
    
    function pause(){
        isStop = true;
    }
    
    function play(){
        isStop = false;
    }
    
	function getTime() {
		return time;
	}
    
	exports.Timer = {
        start : start,
        pause : pause,
        play  : play,
		getTime : getTime
	};
})(this);