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

//what happened here? 9c,8s,7c,4d,3c,2d,joker turns into 9c,8s - four high straight (4d,3c,2d,joker,joker)
//why 2 jokers?
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
		practice_mode:{main:'random',sub:'random+random'},
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a card for display
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createCard:function(options) {
		var key = options.key;
		var disabled = options.disabled;
		var callback = options.callback;

		var card = this.add.sprite();

		var shadow = this.add.sprite(-2, -2,'cards',key);
		shadow.scale.setTo(1.025);
		shadow.tint = 0x000000;
		shadow.alpha = 0.8;
		card.addChild(shadow);
		var actual = this.add.sprite(0,0,'cards',key);
		card.addChild(actual);

		var outline = this.add.sprite(-3.5, -3.5,'cards',key);
		outline.scale.setTo(1.05);
		outline.tint = 0x2F4F2F;
		outline.alpha = 0.15;
		outline.visible = false;
		card.addChild(outline);
		card.outline = outline;

		var right = this.add.sprite(-3.5, -3.5,'cards',key);
		right.scale.setTo(1.05);
		right.tint = 0x00FF00;
		right.alpha = 0.15;
		right.visible = false;
		card.addChild(right);
		card.right = right;

		var wrong = this.add.sprite(-3.5, -3.5,'cards',key);
		wrong.scale.setTo(1.05);
		wrong.tint = 0xFF0000;
		wrong.alpha = 0.15;
		wrong.visible = false;
		card.addChild(wrong);
		card.wrong = wrong;
		
		card.activate = function(tint) {
			card.outline.visible = false;
			card.right.visible = false;
			card.wrong.visible = false;
			switch(tint) {
				case 'outline':
					card.outline.visible = true;
					break;
				case 'right':
					card.right.visible = true;
					break;
				case 'wrong':
					card.wrong.visible = true;
					break;
			}
		}
		
		if (!disabled) {
			card.key = key;
			card.inputEnabled = true;
			card.input.useHandCursor = true;
			card.events.onInputDown.add(callback,card);
		}
		card.key = key;
		return card;
	},
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