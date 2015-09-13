var Casino = {
	_WIDTH: 1000,
	_HEIGHT: 400,

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
	// stat box bg
	_STAT_BG: 0x604409,
	// stat box txt
	_STAT_TXT: '#F4D38D',
	// message box bg
	_MESSAGE_BG: 0x604409,
	// message box txt
	_MESSAGE_TXT: '#F4D38D',

	
	game:{
		thing:{},
		mode:'practice',
		hair_chosen:[],
		hand_data:{},
		group_player:{},
		group_bank:{},
		hand:{
			count:0,
			tries:0
		},
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