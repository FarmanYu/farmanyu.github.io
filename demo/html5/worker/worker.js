/**
 *  π/4=1-1/3+1/5-1/7+1/9-1/11+……
 */
function calcPI( max){
    var end = 1,
    i = 2;
    for(;i<max;i++){
       if(i % 2 === 1){
            if((i % 4) === 3){
                end -= 1 / i;
            } else{
                end += 1 / i;
            }
       }
    }
    return 4 * end;
}
onmessage = function(e){
  var data = parseInt(e.data);     
  postMessage(calcPI(data)); 
}