var Casino = {
	_WIDTH: 1000,
	_HEIGHT: 400,

		/*
		color scheme - brown
	*/
	// background-color: #AA8639;
	// button background
	_BTN_BG: 0x191816,
	// button text
	_BTN_TXT: '#E2DEDB',
	// information background
	_INFO_BG: 0x191816,
	// information text
	_INFO_TXT: '#E2DEDB',
	// stat box bg
	_STAT_BG: 0x191816,
	// stat box txt
	_STAT_TXT: '#E2DEDB',
	// message box bg
	_MESSAGE_BG: 0x191816,
	// message box txt
	_MESSAGE_TXT: '#E2DEDB',

	debugHand:["ace_heart","ace_club","ace_diamond","jack_diamond","ten_diamond","three_club","two_club"],
	game:{
		thing:{},
		mode:'learn',
		hair_chosen:[],
		hand_data:{},
		group_player:{},
		group_bank:{},
		per_level:10,
		hand:{
			count:0,
			tries:0
		},
		level:{main:'pai-gow',sub:'nothing'},
		practice_mode:{main:'random',sub:'random+random'},
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
			this.game.stage.backgroundColor = '#FFFFFF';
		}
};