void function(){
	
	if(typeof String.prototype.trim !== "function"){
		String.prototype.trim = function(){
			return this.replace(/(?:^\s+|\s+$)/gi,"");
		}
	};
		
	
	var LocalClass = (function(){
		var _DefaultVoiceValue = 70,
		_DefaultVoiceName = 'MusicBox_Volume' ,
		isSupportLocal = (typeof localStorage != 'undefined'),
		_DefaultSongName = 'MusicBox_Info',
		_DefaultSongPlayType = 'MusicBox_PlayType',	
		SaveVoice = function ( nValue ){
			if( typeof nValue == 'number' && nValue <= PlayCtrl.MaxVoice && nValue >= PlayCtrl.MinVoice ){
			    localStorage.setItem( _DefaultVoiceName ,  nValue);
			} else {
			    //console.log("local voice make error!");
			}
		},		
		GetVoice = function (){
			if(isSupportLocal){
			       var nValue =  localStorage.getItem( _DefaultVoiceName );	
			       return  (nValue != null) ? nValue : _DefaultVoiceValue;
			} else{
			       //console.log("It's doesn't support localstorage!!please choose chrome!");
			       return false;
			}
		},		
		SaveSongInfo = function ( jInfo ){
			 var _a = JSON.stringify( jInfo );
			 localStorage.setItem( _DefaultSongName ,  _a);
		},	
		GetSongInfo = function (){
			if(isSupportLocal){
				var _SongInfo = localStorage.getItem( _DefaultSongName );
				return (_SongInfo != null) ? JSON.parse( _SongInfo ) : false;
			} else{
				//doesn't support localstorage
				return false;
			}
		},	
		SavePlayType = function ( nType ){
			if(nType >= 1 && nType <= 3){
			   localStorage.setItem(_DefaultSongPlayType , nType);
			} 
		},
		GetPlayType = function (){
			if(isSupportLocal){
			   var playType = localStorage.getItem( _DefaultSongPlayType ) ;
			   return ( playType == null) ? 1 : playType;
			}
			return false;
		};
		
		return {
			SaveVoice : SaveVoice ,
			GetVoice  : GetVoice ,
			SaveSong  : SaveSongInfo ,
			GetSong   : GetSongInfo,
			SaveType  : SavePlayType,
			GetType   : GetPlayType
		}
	})();
	
	var UtilClass = window.UtilClass = {
		FormatTimeNum : function( nTimeNum ){
			var nNum =  parseInt( nTimeNum );
			var m = parseInt(nNum / 60) ;
			var s = nNum % 60;
			m = (m < 10) ? ('0' + m) : m;
			s = (s < 10) ? ('0' + s) : s;
			return (m + ':' + s);
		},
		FormatFloatNum:function( nFloatNum ,  nLength){
			var _defalut = nLength || 4;
			return parseFloat( nFloatNum.toString().substr(0, _defalut) , 10)
		},
		Local : LocalClass
	}
	
	loader.loaded.base = true;

}();