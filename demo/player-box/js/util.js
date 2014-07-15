(function(exports){
    var util = {
        createURL : function (obj) {
            var url = null;
            if (window.createObjectURL) {
                url = window.createObjectURL(obj);
        //    } else if (window.createBlobURL) {
        //        url = window.createBlobURL(obj);
            } else if (window.URL && window.URL.createObjectURL) {
                url = window.URL.createObjectURL(obj);
            } else if (window.webkitURL && window.webkitURL.createObjectURL) {
                url = window.webkitURL.createObjectURL(obj);
            }
            return url;
        },
        FormatTime : function( nTimeNum ){
            var nTimeNum =  parseInt( nTimeNum );
            var m = parseInt(nTimeNum / 60) ;
            var s = nTimeNum % 60;
            m = (m < 10) ? ('0' + m) : m;
            s = (s < 10) ? ('0' + s) : s;
            return (m + ':' + s);
        },
        FormatFloat : function(nFloatNum ,  nLength){
            var defalut = nLength || 4;
            return parseFloat(nFloatNum.toString().substr(0, defalut) , 10);
        }
    };
    exports.Util = util;
})(this);