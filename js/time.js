(function(){
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var second = now.getSeconds();
	var day = "星期" + "日一二三四五六".charAt( now.getDay() );
	var tpl = ["现在是",year,"年",month,"月",date,"日 ", hour,":",minute,":",second," ",day].join("");
	$("#time-now").html(tpl);
	setTimeout(arguments.callee, 1000);
})();