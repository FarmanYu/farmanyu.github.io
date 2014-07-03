/**
 * @fileoverview loader
 * @author dron
 * @date 2010-09-14
 */

void function(){
	var loader = {

	loaded: {},

	loadScript: function(js, target){
		target = target || document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = js;
		target.appendChild(script);
	},

	loadImages: function(images, callback){
		var len = images.length;
		var num = 0;

		var check = function(){
			num ++;
			if(num == len)
				callback();
		};

		var load = function(src){
			var img = document.createElement("img");
			var style = img.style;
			style.position = "absolute";
			style.left = style.top = "-10px";
			style.width = style.height = "1px";
			document.body.appendChild(img);
			img.onerror = img.onload = function(){
				this.onerror = this.onload = null;
				check();
			}
			img.src = src;
		};

		for(var i = 0, l = images.length; i < l; i ++)
			load(images[i]);
	},

	conditionLoad: function(condition, js){
		var me = this;
		this.listen(condition, function(){
			me.loadScript(js);
		});
	},

	listen: function(target, callback){
		target.interval = setInterval(function(){
			if(target()){
				clearInterval(target.interval);
				callback();
			}
		}, 16);
	}

};

window.loader = loader;
	loader.loadScript("script/base.js");
	loader.conditionLoad(function(){
		return loader.loaded.base;
	},"script/lib.js");
	loader.conditionLoad(function(){
		return loader.loaded.canvas && loader.loaded.lib;
	},"script/main.js");
	
}();