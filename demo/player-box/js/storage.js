/**
 * @database : {name:"", url:""}
 */
(function(exports){
    var key = "_MUSIC_DATA_";
    var Storge = {
        add : function (item) {
            var saved = false;
            if(!this.checkItem(item)) return;
            if(!this.isDataSave(item)){
                var data = this.getList();
                    data.push(item);
                localStorage.setItem(key, JSON.stringify(data));
                saved = true;
            }
            return saved;
        },
        getList : function(){
            var data = [];
            var saveData = localStorage.getItem(key);
            if(saveData){
                data = JSON.parse(saveData);
            }
            return data;
        },
        checkItem : function(item){
            return item && item.name && item.url;
        },
        isDataSave : function(item){
            var data = this.getList();
            var isSave = false;
            data.forEach(function(saveItem){
                if(saveItem.name === item.name && saveItem.url === item.url){
                    isSave = true;
                }
            });
            return isSave;
        },
        clear : function( nTimeNum ){
            localStorage.setItem(key, []);
        }
    };
    exports.DataStorge = Storge;
})(this);