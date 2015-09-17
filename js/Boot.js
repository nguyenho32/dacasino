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

//	debugBank:["queen_spade","king_heart","eight_club","nine_club","seven_club","six_spade","joker_one"],
//	debugPlayer:["queen_heart","king_club","eight_spade","eight_heart","eight_club","joker_one","ten_club"],
//	debugCompare:true,
//	debugHand:["queen_spade","queen_club","jack_club","ten_club","nine_club","eight_club","joker_one"],
//	debugHand:["ten_diamond","nine_spade","nine_club","eight_spade","seven_club","six_spade","two_club"],
	settings:{
		hands_per_level:10,
		timer_amount:30
	},
	game:{
		mastery:false,
		thing:{},
		mode:'learn',
		hair_chosen:[],
		hand_data:{},
		group_player:{},
		group_bank:{},
		hand:{
			count:0,
			tries:0,
			correct:0,
			total:0
		},
		level:{main:'pai-gow',sub:'nothing'},
		practice_mode:{main:'random',sub:'random+random'},
		compare:{
			steps:["init","set-bank","set-other","both-set","resolve"],
			current:'init',
			index:function() {
				return this.steps.indexOf(this.current);
			}
		}
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