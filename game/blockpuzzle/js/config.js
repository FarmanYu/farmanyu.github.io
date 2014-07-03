(function (exports) {

	var config = {
		box : {
			w : 6,
			h : 6,
		},
		figure : {
			min : 3,
			max : 12,
            width : 40,
            border: 1,
            limit : 5,
            maxZindex : 100
		}
	};

	exports.StepConf = {
        getStep : function(step){
            return config;
        }
    };
})(this);
