(function(){
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() < 9 ? ("0" + now.getMonth() + 1) : (now.getMonth() + 1);
	var date = now.getDate() < 10 ? ("0" + now.getDate()) : now.getDate();
	var hour = now.getHours() < 10 ? ("0" + now.getHours()) : now.getHours();
	var minute = now.getMinutes() < 10 ? ("0" + now.getMinutes()) : now.getMinutes();
	var second = now.getSeconds() < 10 ? ("0" + now.getSeconds()) : now.getSeconds();
	var day = "星期" + "日一二三四五六".charAt( now.getDay() );
	var tpl = ["现在是",year,"年",month,"月",date,"日 ",day," ", hour,":",minute,":",second].join("");
	$("#time-now").html(tpl);
	setTimeout(arguments.callee, 1000);
})();
