(function (exports) {
    var area = {
        isRectRepeat : function(rect1, rect2){
            var isInside = false;
            var zRect1X = 2 * rect1.x + rect1.width;
            var zRect1Y = 2 * rect1.y + rect1.height;
            var zRect2X = 2 * rect2.x + rect2.width; 
            var zRect2Y = 2 * rect2.y + rect2.height; 
            //分别比较两个矩形的重心在x轴方向上和y轴方向上的距离与两个矩形的长或者宽的一半的和的大小。如果重心的在x轴和y轴上的距离都比他们边长和的一半要小就符合相交的条件。
            //中心点x轴，y轴距离的两倍
            var xlen = Math.abs(zRect2X - zRect1X);
            var ylen = Math.abs(zRect2Y - zRect1Y);
            
            //两条边距离的两倍
            var rectWdith  = rect2.width  + rect1.width;
            var rectHeight = rect2.height + rect1.height;
            
            if(xlen < rectWdith && ylen < rectHeight){
                    isInside = true;
            }
            return isInside;
        }
    };
    exports.area = area;
})(this);