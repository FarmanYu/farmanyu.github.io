(function(exports){

    var _win = {};
    
    var system = {
        module : function(name, obj){
            var ret;
            if(name.indexOf(".") !== -1){
                _win[name] = obj;
            }
            
        }
    };
    
    exports.system = system;
})(this);