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
		hands_per_level:2,
		timer_amount:5,
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
		level:{main:'trips',sub:'2-pair'},
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

		if (options.levels) {
			// inactive state
			var gfx = this.add.graphics(0,0);
			gfx.beginFill(this.btn_color_inactive,1);
			gfx.drawRect(-2,-2,btn_width+4,29);
			gfx.visible = false;
			sprite.addChild(gfx);
			sprite.inactive = gfx;

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
		}

		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,0.8);
		gfx.drawRect(0,0,btn_width,25);
		sprite.addChild(gfx);

		var style = { font: font_size+'Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: btn_width };
		var text = this.add.text(btn_width / 2, 4, options.name, style);	
		text.anchor.setTo(0.5,0);
		if (!options.disabled) {
			sprite.addChild(text);
			sprite.inputEnabled = true;
			sprite.input.useHandCursor = true;
			sprite.events.onInputDown.add(options.callback,this);
		}
		// activate the correct backdrop
		sprite.activate = function(back) {
			sprite.active.visible = false;
			sprite.inactive.visible = false;
			sprite.available.visible = false;
			switch(back) {
				case 'available':
					sprite.available.visible = true;
					break;
				case 'active':
					sprite.active.visible = true;
					break;
				default:
					sprite.inactive.visible = true;
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