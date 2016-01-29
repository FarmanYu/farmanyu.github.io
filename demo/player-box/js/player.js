(function (exports) {
	var Player = {
		audioObj : null,
		currentId : -1,
		playList : [],

		init : function () {
			var aObj = $("<audio id='ai'></audio>");
			this.audioObj = aObj[0];
            this.boxIntance = new Box("play-box");
		},

		clearList : function () {
			this.playList.length = 0;
			this.currentId = -1;
		},

		add : function (data) {
			this.playList.push(data);
		},

		remove : function (name) {
			delete this.playList[name];
		},

		play : function (index) {
			var song = null;
            var self = this;
            index = parseInt(index);
			if ((song = this.playList[index]) != null) {
				if (this.audioObj.readyState == 4 && this.currentId == index) {
					this.audioObj.play();
                    self.boxIntance.play();
				} else {
					this.currentId = index;
					this.stop();
					this.audioObj.src = song.url;

					$(this.audioObj).bind("canplaythrough", function () {
						this.play();
                        self.boxIntance.play();
					});
				}
			}
			return song;
		},

		stop : function () {
			this.audioObj.pause();
            this.boxIntance.stop();
		},

		isEmptyPlayList : function () {
			return this.playList.length === 0;
		},

		playStep : function (step) {
			if (this.isEmptyPlayList()) {
				return null;
			}

			if (this.currentId == null) {
				return this.play(this.playList[0]);
			} else {
				var id = this.currentId;

				if (step == 1) {
					id = (id < this.playList.length - 1) ? (id + 1) : 0;
				} else if (step == -1) {
					id = (id > 0) ? (id - 1) : (this.playList.length - 1);
				}
				return this.play(id);
			}
		},

		playNext : function () {
			return this.playStep(1);
		},

		playPri : function () {
			return this.playStep(-1);
		}
	};
	exports.Player = Player;
})(this);
