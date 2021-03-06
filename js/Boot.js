/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
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

//	debugHand:["ace_diamond","five_spade","five_club","four_spade","three_club","seven_heart","joker_one"],
//what happened here? 9c,8s,7c,4d,3c,2d,joker turns into 9c,8s - four high straight (4d,3c,2d,joker,joker)
//why 2 jokers?
//	debugHand:["nine_club","eight_spade","seven_club","four_diamond","three_club","two_diamond","joker_one"],

//	debugHand:["king_heart", "queen_club", "jack_heart", "ten_club", "nine_club", "two_heart", "joker_one"],
	settings:{
		hands_per_level:10,
		timer_amount:30,
		min_hint_count:2,
		max_hint_count:5,
	},
	game:{
		skip_houseway:false,
		mastery:false,
		thing:{},
		mode:'init',
		hair_chosen:[],
		group_player:{},
		group_bank:{},
		
		// current hand number
		hand_number:0,
		// array containing all hands
		hands:[],
		// a single hand
		hand:{},
		// stats
		stat:{
			count:0,
			tries:0,
			correct:0,
			total:0
		},
		level:{main:'pai-gow',sub:'nothing'},
		/*
			highest level attained so far
				- high_main
				- high_sub
			current level to display
				- now_main
				- now_sub
		*/
		levels:{high_main:'pai-gow',high_sub:'nothing',now_main:'pai-gow',now_sub:'nothing'},
		practice_mode:{main:'straight',sub:'random+random'},
		steps:{
			compare:["boot","init","set-bank","set-player","compare","result"],
			speed:["set-bank","set-other","compare","review"]
		},
		step:'',
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton: function(options) {
		var btn_width = (options.size != 'large') ? 113 : 130;
		btn_width = (typeof options.wide !== 'undefined') ? options.wide : btn_width;
		var font_size = (options.size != 'large') ? '12pt ' : '10pt ';
		var sprite = this.add.sprite(0,0);

		// inactive state
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(this.btn_color_inactive,1);
		gfx.drawRect(-2,-2,btn_width+4,29);
		sprite.addChild(gfx);
		sprite.inactive = gfx;
		sprite.inactive.visible = false;

		// active state
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(this.btn_color_active,1);
		gfx.drawRect(-2,-2,btn_width+4,29);
		gfx.visible = false;
		sprite.addChild(gfx);
		sprite.active = gfx;

		// available state
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(this.btn_color_available,1);
		gfx.drawRect(-2,-2,btn_width+4,29);
		gfx.visible = false;
		sprite.addChild(gfx);
		sprite.available = gfx;

		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,0.9);
		gfx.drawRect(0,0,btn_width,25);
		sprite.addChild(gfx);

		var style = { font: font_size+'Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: btn_width };
		var text = this.add.text(btn_width / 2, 4, options.name, style);	
		text.anchor.setTo(0.5,0);
		sprite.addChild(text);

		sprite.inputEnabled = true;
		sprite.input.useHandCursor = true;
		sprite.events.onInputDown.add(options.callback,this);
		// activate the correct backdrop
		sprite.activate = function(back) {
			sprite.active.visible = false;
			sprite.inactive.visible = false;
			sprite.available.visible = false;
			switch(back) {
				case 'available':
					sprite.available.visible = true;
					sprite.inputEnabled = true;
					sprite.input.useHandCursor = true;
					break;
				case 'active':
					sprite.active.visible = true;
					break;
				default:
					sprite.inactive.visible = true;
					sprite.inputEnabled = false;
					sprite.input.useHandCursor = false;
					break;
			}
		}
		sprite.name = (options.levels) ? 'levels' : options.name;
		
		return sprite;
	},
};
Casino.Boot = function(game) {};
Casino.Boot.prototype = {
	preload: function() {
			this.load.image('preloaderBg', 'assets/logo-small.png');
			this.load.image('preloaderBar', 'assets/loading-bar.png');
		},
		create: function() {
			this.game.stage.disableVisibilityChange = true;
			this.game.scale.scaleMode = Phaser.ScaleManager.AUTO;
			this.game.scale.pageAlignHorizontally = true;
			this.game.scale.pageAlignVertically = true;
			this.game.scale.setScreenSize(true);
			this.game.state.start('Preloader');	
			this.game.stage.backgroundColor = '#FFFFFF';
		}
};
