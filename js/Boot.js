var Casino = {
	_WIDTH: 1280,
	_HEIGHT: 800,

		/*
		color scheme - brown
	*/
	// background-color: #AA8639;
	// button background
	_BTN_BG: 0x85631C,
	// button text
	_BTN_TXT: '#F4D38D',
	// information background
	_INFO_BG: 0x604409,
	// information text
	_INFO_TXT: '#F4D38D',

	
	game:{
		thing:{},
		mode:'practice',
		hair_chosen:[],
		hand_data:{},
		group_player:{},
		group_bank:{},
		level:{main:'random',sub:'random+random'}
	}
};
Casino.Boot = function(game) {};
Casino.Boot.prototype = {
	preload: function() {
//			this.load.image('preloaderBg', 'img/loading-bg.png');
//			this.load.image('preloaderBar', 'img/loading-bar.png');
		},
		create: function() {
			this.game.scale.scaleMode = Phaser.ScaleManager.AUTO;
			this.game.scale.pageAlignHorizontally = true;
			this.game.scale.pageAlignVertically = true;
			this.game.scale.setScreenSize(true);
			this.game.state.start('Preloader');	
		}
};