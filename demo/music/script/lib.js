/*
 * class data object
 * @param {string} url
 */
var ArticleDataProvider = function(feedUri) {
	this._mFeedUri = feedUri;
	
	this._mPagesData = [];
	this._mTimer = null;
	
	this._mXhr = null;
	this._mTimerOutAbort = false;
	this.onUriComposite = null;
}
ArticleDataProvider.MAX_DOC_CAHCE = 10;
ArticleDataProvider.SUCCESS = 0;
ArticleDataProvider.FAILURE = 1;

ArticleDataProvider.CONNECTION_TIME_OUT = 3 * 60 * 1000;
ArticleDataProvider.uriWithRandom = function(uri) {
	return uri + "&t=" + Math.random().toFixed(5);
}
ArticleDataProvider.prototype = {
	obtainDataAtPage : function(page, callback) {
		this._obtainDataAtPageInner(page, callback);
	},
	hasPendingRequest : function() {
		return this._mTimer != null && this._mTimer.isAlive();
	},
	exists : function(page){
		return  (typeof this._mPagesData[page] != "undefined");
	},
	_obtainDataAtPageInner : function(page, callback) {
		if (typeof this._mPagesData[page] != "undefined") {
			callback.call(
				this, 
				ArticleDataProvider.SUCCESS, 
				this._mPagesData[page], 
				page
			);
		} else {
			// has any pending request ?
			if (this.hasPendingRequest()) {
				//this._mTimer.interrupt();
			//	console.log("low level pending interception");
				return;
			}
			
			// obtain from server
			this._obtainFromServer(page, callback);
		}
	},
	_obtainFromServer : function(page, callback) {
		var _this = this;
		this._mTimerOutAbort = false;
		
		if (this._mTimer == null) {
			this._mTimer = new CTimer(ArticleDataProvider.CONNECTION_TIME_OUT, function(){
				if (_this._mXhr) {
					console.log("time out");
					_this._mTimerOutAbort = true;
					_this._mXhr.abort();
				}
			});
		}
		// start counting for this session
		this._mTimer.start();
		
		this._mXhr = new XMLHttpRequest();
		this._mXhr.onreadystatechange = function() {
			if (_this._mXhr.readyState == 4) {
				
				// prefix cleaning up
				if (_this._mTimer != null && _this._mTimer.isAlive()) {
					_this._mTimer.interrupt();
				}
				
				if (_this._mTimerOutAbort && _this._mXhr.status != 200) {
					// timeout
					_this._mXhr = null;
					callback.call(
						_this,
						ArticleDataProvider.FAILURE,
						null,
						page,
						"Service Not Available"
					);
				} else {
					var result;
					try {
						if(_this._mXhr.responseText != ''){
							if (typeof JSON != "undefined" && (typeof JSON.parse != "undefined"))
                                result = JSON.parse(_this._mXhr.responseText);
                            else
                                result = eval('('+ _this._mXhr.responseText + ')');
						}
					} catch (e) {
					//	console.log("json parsing error: " + e.message);
						_this._mXhr = null;
						callback.call(
							_this,
							ArticleDataProvider.FAILURE,
							null,
							page,
							"Malformed Data"
						);
					}
					
					// may be it contains more than one page data
					if (result instanceof Array) {
						_this._appendNewData(page, result);
						
						// send result back
						_this._mXhr = null;
						callback.call(
							this, 
							ArticleDataProvider.SUCCESS, 
							_this._mPagesData, 
							page
						);
						
					} else {
						_this._mXhr = null;
						callback.call(
							_this,
							ArticleDataProvider.FAILURE,
							null,
							page,
							"Malformed Data"
						);
					}
				}
				
				
			}
		};
		
		var uri = this._mFeedUri;
		if (typeof this.onUriComposite == "function")
			uri = this.onUriComposite.call(this, uri, page);
		
		this._mXhr.open("GET", uri, true);
		this._mXhr.send(null);
	},
	_appendNewData: function(fromPage, data){
			this._mPagesData = [];
			var i = fromPage;
			for (var idx in data) {
				this._mPagesData[i++] = data[idx];
			}

	}
};

var MusicData = (function(){
	var _MusicData = {
			'music' : []
	};
	
	function addMusicData( aMusic ){
			if(typeof aMusic == 'array'){
				if(_MusicData[_music].length != 0){
					for(var i = 0; i <_MusicData['music'].length;i++){
						for(var j = 0; j < aMusic.length; j++){
							if( _MusicData['music'][i] != aMusic[j] ){
								_MusicData['music'].push( aMusic[j] );
							}
						}
					}
				} else {
					for(var j = 0; j < aMusic.length; j++){
						_MusicData['music'].push(aMusic[j]);
					}	
				}
			} else {
				_MusicData['music'].push( aMusic );
			}
	}
	
	function getMusicData(){
		return _MusicData['music'];
	}
	
	return {
		add : addMusicData ,
		get : getMusicData
	}
})();

/**
 * class paly music main 
 */

var PlayAction = function(){
	//obj obj
	this.oPlayAni = null ;
	this._mDataProvider = null;
	this._mListenMusic = null;
	
	//view obj
	this.playBtn = null; 
	this.MusicBox = null;
	this.showSongName = null;
	
	this.prevBtn = null;
	this.nextBtn = null;
	this.restartBtn = null;
	
	this.showFormatName = null;
	this.showSongTime = null;
	
	this.playMain = null;
	this.playTime = null;
	
	this.playMode = null;
	//data obj
	this.MusicData = null;
	this._actSongIndex = 0; //default value
	this._listenSong =  1000;
	this._mSoneLength = null;
	this._MaxPlayActBgLength = 710;
	this.OMusic = {};
	
	//staus num
	this.isPlay = false;
	this.ModeType = UtilClass.Local.GetType();
}
PlayAction.MUSIC_URL = 'readLocalMusic.php';
PlayAction.MUSIC_SONGNAME = 'demo music';
PlayAction.DEL_MUSIC_TYPE = /\.(mp3|wma|ra|aac|ogg)$/i ;  
PlayAction.RE_MUSIC_TYPE = /^.*?\.(mp3|wma|ra|aac|ogg)$/i;

PlayAction.musicNameShow = function(name){
	var nameStr = "{name}";
	var strarr = name.split('/');
	var l = strarr.length - 1;
	return nameStr.replace(/{name}/ig, decodeURIComponent(strarr[l]));
} 
PlayAction.deleteFileName = function(filename){
	return filename.replace( PlayAction.DEL_MUSIC_TYPE , '');
}
PlayAction.getFileName = function(filename){
	return filename.substr( filename.indexOf('.') + 1 );
}
PlayAction.prototype = {
  init : function(){
	  this.oPlayAni = new CPlayer();
	  
	  var eAudio = document.createElement("audio");
	  eAudio.id = 'musicBox';
	  document.body.appendChild(eAudio);
	  
	  this.MusicBox = eAudio;
	  this.playBtn = document.querySelector('#play');
	  this.showSongName = document.querySelector('.music-name span');
	  this.prevBtn = document.querySelector('.paly-nav .prev');
	  this.nextBtn = document.querySelector('.paly-nav .next');
	  this.restartBtn = document.querySelector('.paly-nav  .restart');
	  
	  this.showFormatName = document.querySelector('.play-info .tl span');
	  this.showSongTime = document.querySelector('.play-info .tr span');
	  this.playMain = document.querySelector('#play-main');
	  this.playTime = document.querySelector('#playtime');
	  this.playMode =  document.querySelector("#playMode");
	  
//	  this._buildMode();
	  this._addEvent();
	  this._getMusicList();
  },
  _addEvent:function(){
	 this.playBtn.addEventListener('click', this._play.bind(this) , false);
	 this.prevBtn.addEventListener('click', this._toPrev.bind(this) , false); 
	 this.nextBtn.addEventListener('click', this._toNext.bind(this) , false); 
	 this.restartBtn.addEventListener('click', this._restart.bind(this) , false); 
  },
  /*_buildMode : function( nModein ){
  		var nMode = nModein || this.ModeType;
		
		var PlayTextArr = ['顺序播放','单曲循环','随机播放'];
		var len = PlayTextArr.length;
		
		var _this = this;
		var oUl = document.createElement('ul');
		oUl.className = "showMode";
		oUl.style.display = "none";
		for(i = 0 ; i < len ; i++){
			var oLi = document.createElement('li');
			oLi.textContent = PlayTextArr[i];
			if(i == nMode - 1){
			   oLi.className = 'act';
			} else {
			   var closed = function ( num ){ oUl.style.display = "none"; _this._buildMode( num );  }
			   baidu.on(oLi ,'click',closed.bind(this, (i+1)));
			}

			oUl.appendChild(oLi);
		}
		var oA = document.createElement('a');
		oA.href ="javascript:void(0);";
		oA.textContent = PlayTextArr[nMode - 1].substr(0 , 2);
		oA.onclick = function(){
			oUl.style.display = (oUl.style.display == "block") ? 'none' : 'block';
		}
		
		this.ModeType = nMode;
		UtilClass.Local.SaveType( nMode );
		
	//	console.log( this.ModeType );
		this.playMode.innerHTML = "";
		this.playMode.appendChild(oUl);
		this.playMode.appendChild(oA);
  },*/
  _play:function(){
		if(this.isPlay){
			this.isPlay = false;
			this.playBtn.className = 'play';
			this.MusicBox.pause();
			if( this.oPlayAni.isPlay ){ //if play ,then stop
				 this.oPlayAni.play();
			}
			if( this._mListenMusic.isAlive ){
				this._mListenMusic.interrupt();
			}
		}else{
	       if(! this.oPlayAni.isPlay ){ //if stop ,then play
				this.oPlayAni.play();
		   }	
		    this.isPlay = true;
		    this.playBtn.className = 'stop';
			if(this.MusicBox.paused && this.MusicBox.networkState){
				this.MusicBox.play();
				this._mListenMusic = new CTimer( this._listenSong , this._listen.bind(this) );
				this._mListenMusic.start();
			}else{
				this.playSong();
			}			
		}
  },
  _toNext:function(){
	   this._baseAction();
	   this._actSongIndex ++;
	//   this._ChangeActSong('next');
	   this.playSong();
  },
  _toPrev:function(){
           this._baseAction();
	   this._actSongIndex --;
	//   this._ChangeActSong('prev');
	   this.playSong();	  
  },
  /*_ChangeActSong : function(act){
 	   switch(this.ModeType){
		   case 1 :
			if( act == 'prev' ){
			      this._actSongIndex --;
			} else {
			      this._actSongIndex ++;
			} 
			break;
		   case 2 :
			if( act == 'prev' ){
			      this._actSongIndex --;
			} else if( act == 'next' ) {
			      this._actSongIndex ++;
			} 
			break;
		   case 3 :
			this._actSongIndex = rand( this.MusicData.length );
			break;
	   } 
  },*/
  _restart:function(){
	  this._baseAction();
 	  this.playSong();
  },
  _baseAction:function(){
	   this.oPlayAni.removeCanvasWithChangeColor();
	   if(! this.oPlayAni.isPlay ){
		this.oPlayAni.play();
	   }	
	   this.isPlay = true;
	   this.playBtn.className = 'stop';	   
  },
  _getMusicList:function(){   
	this._mDataProvider = new ArticleDataProvider( PlayAction.MUSIC_URL );
	this._mDataProvider.onUriComposite = function(uri) {
	       return ArticleDataProvider.uriWithRandom(uri + '?');
	}
	var _this = this;
	var page = 0;
	this._mDataProvider.obtainDataAtPage(page ,function(status, data , page, msg){
	       if (status == ArticleDataProvider.SUCCESS) {
		  _this._buildData(data);
	       } else {
		  _this._buildData();
	       }
	});
  },
  _buildData:function(data){
	  this.MusicData = [];
	  var _this = this;

	  if(data instanceof Array){ 
		 for(var i = 0; i < data.length; i++){
			 var songName = decodeURIComponent(  data[i] ) ;	 
			 if(PlayAction.RE_MUSIC_TYPE.test( songName )){
				songName = songName.replace(/\+/gi,' ');        
				this.MusicData.push( songName );  			
			 }
		 }
	  } else {
		  this.MusicData.push("好好爱你.mp3"); 
	  }
	MusicData.add(   this.MusicData   );
  },
  playSong:function(){  
	    if(this._actSongIndex >= this.MusicData.length){
			this._actSongIndex =  0;
		}
		if(this._actSongIndex < 0){
			this._actSongIndex = this.MusicData.length - 1;
		}
	  	var _PlayMusic = this.MusicData[ this._actSongIndex ];
		this.OMusic = {
			name : PlayAction.deleteFileName(_PlayMusic),
			url : 'music/' + _PlayMusic,
			format : PlayAction.getFileName( _PlayMusic ).toUpperCase()
		}
		this.MusicBox.src = this.OMusic.url;
	        this.showFormatName.textContent = this.OMusic.format;
		this.showSongName.textContent  = this.OMusic.name;
		document.title = "正在播放：" + this.OMusic.name;
		this.MusicBox.play();
		UtilClass.Local.SaveSong( this.OMusic );
		
		setTimeout( this.getMusicTime.bind(this) , 500);
		
		if(this.MusicBox.error != null){
			console.log(  this.MusicBox.error.code );
		}
		this._mListenMusic = new CTimer( this._listenSong , this._listen.bind(this) );
		this._mListenMusic.start();
		
  },
  readLocalInfo : function(){
	  	var _SongInfo = UtilClass.Local.GetSong();
  		if(false != _SongInfo ){
		    for(var i = 0 ,l = this.MusicData.length; i < l; i++){
			if(_SongInfo.name == PlayAction.deleteFileName(this.MusicData[i])){
			    this._actSongIndex = i;
			    this._play();
			}
		    }
		}
  },
  getMusicTime : function(){
	    if( this.MusicBox.duration ){
			this._mSoneLength = parseInt( this.MusicBox.duration );
			this.showSongTime.textContent = UtilClass.FormatTimeNum( this._mSoneLength );
		}  
  },
  _listen : function(){
	  if( this.MusicBox.ended ){
		  	this._baseAction();
			this._ChangeActSong();
			this.playSong();
	  }
	  if(this.MusicBox.paused){
		if( this._mListenMusic.isAlive ){
			this._mListenMusic.interrupt();
		}
	  } else{
		 if( this.MusicBox.currentTime ){
			var ratio = parseInt(this.MusicBox.currentTime) / this._mSoneLength;
			this.playMain.style.width = parseInt(ratio * this._MaxPlayActBgLength) + 'px';
			this.playTime.textContent = UtilClass.FormatTimeNum( this.MusicBox.currentTime );
		 } 
	  }
	  this._mListenMusic.start();
  }
};

var PlayCtrl = {
	init : function(){
		var _newani = window._newani = new CPlayer();
		_newani.play();
		setTimeout(function(){
			if(_newani.isPlay){
				_newani.play();
				window._newani = _newani = null;
			}									
		} ,150);
		
		this._mPlay = new PlayAction();
		this._mPlay.init();
		
		PlayCtrl.SoundActElement = document.querySelector('.soundact');
		PlayCtrl.MusicBoxElement = document.querySelector('#musicBox');
		
		this._setDefaultVolume();
		
		baidu.on(baidu.q('soundbg')[0],'click',PlayCtrl.setVoice);
		baidu.on(baidu.q('voiceToDown')[0],'click',PlayCtrl.DownVoice);
		baidu.on(baidu.q('voiceToUp')[0],'click',PlayCtrl.UpVoice);
		
		try {
		   var _fn = this.buildMusicList.bind(this);
		   //wait the ajax data
		   setTimeout(_fn , 500);
		} catch(e){
		   console.log(e); //output error msg	
		}
	},
	_mPlay : null ,
	SoundActElement : null,
	MusicBoxElement : null,
	MaxVoice : 100,
	MinVoice : 0,
	LoopVoice: 10,
	DefaultVolume : UtilClass.Local.GetVoice(),
	setVoice:function( e ){
		if(e){
		   var width = (e.offsetX > PlayCtrl.MaxVoice) ? PlayCtrl.MaxVoice : e.offsetX;
		   var ratio =  UtilClass.FormatFloatNum( width / PlayCtrl.MaxVoice );
		   var nVolume = Math.ceil(ratio * (PlayCtrl.MaxVoice - PlayCtrl.MinVoice) / 10) * 10;
		   PlayCtrl._setVoiceToShow( nVolume );
		}
	},
	UpVoice:function(){
		var nVolume = parseInt(PlayCtrl.SoundActElement.style.width) + PlayCtrl.LoopVoice ;
		PlayCtrl._setVoiceToShow(  nVolume );
	},
	DownVoice:function(){
		var nVolume = parseInt(PlayCtrl.SoundActElement.style.width) - PlayCtrl.LoopVoice;
		PlayCtrl._setVoiceToShow(  nVolume );
	},
	_setDefaultVolume:function(){	
		PlayCtrl._setVoiceToShow( PlayCtrl.DefaultVolume );
	},
	_setVoiceToShow:function(Value){
                if(Value > PlayCtrl.MaxVoice || Value < PlayCtrl.MinVoice) return;
		PlayCtrl.SoundActElement.style.width = Value  + 'px';
		PlayCtrl.MusicBoxElement.volume = UtilClass.FormatFloatNum( Value / 100 );
		UtilClass.Local.SaveVoice( parseInt(Value) );
	},
	buildMusicList:function(){
		var _data = this._mPlay.MusicData;//the music data
		var oUl = document.createElement('ul');
		oUl.className = "showMode";
		oUl.style.display = "none";
		for(i = 0,len=_data.length; i < len ; i++){
			var oLi = document.createElement('li');
			oLi.textContent = _data[i];
			if(i == nMode - 1){
			   oLi.className = 'act';
			} else {
			   var closed = function ( num ){
				oUl.style.display = "none";
				_this._buildMode( num );
			   }
			   baidu.on(oLi ,'click',closed.bind(this, (i+1)));
			}

			oUl.appendChild(oLi);
		}
	}
}


loader.loaded.lib = true;