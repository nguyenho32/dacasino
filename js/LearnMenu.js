Casino.LearnMenu = function(game) {};
Casino.LearnMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		
		// active button color
		this.btn_active = 0x000000;
		// inactive button color
		this.btn_inactive = 0xCCCCCC;
		this.group = this.add.group();
		this.cards = this.add.group();
		
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton({name:'start',callback:this.btnHandler});
		this.btn_start = btn;
		btn.key = 'start';
		btn.x = 890;
		btn.y = 0;
		// button for options
		var btn = this.createButton({name:'option',callback:this.btnHandler});
		this.btn_option = btn;
		btn.key = 'option';
		btn.x = 0;
		btn.y = 375;
		// create a text box for game related information
		var sprite = this.add.sprite(0,0);
		sprite.x = 120;
		sprite.y = 0;
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = 'learn the game of pai-gow poker (click start to practice setting hands)   --->';
		this.txt_main_info = this.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);

		// create buttons for the main menu
//		var sprite = this.add.sprite(0,0);
		var width;
		var i = 0;
		for (var key in Paigow.rules) {
			var value = Paigow.rules[key];
			var btn = this.createButton({name:key,callback:this.btnHandler,size:'large',learn:true});
			btn.main_key = key;
			btn.x = 20 +(i*135);
			btn.y = 35;
			var n = 1;
			this.group.add(btn);
			for (var sub in Paigow.rules[key]) {
				var subval = Paigow.rules[key][sub];
				var btn = this.createButton({name:sub,callback:this.btnHandler,size:'large',learn:true});
				btn.main_key = key;
				btn.sub_key = sub;
				btn.x = n*135-30;
				btn.y = 70;
				n++;
				this.group.add(btn);
			}
			i++;
		}
		// set the main level
		if (!Casino.game.level.main) {
			Casino.game.level.main = 'pai-gow';
		}
		// set the sub level
		if (!Casino.game.level.sub) {
			Casino.game.level.sub = 'nothing';
		}
		// main keys + index
		var main_keys = Object.keys(Paigow.rules);
		var main_index = main_keys.indexOf(Casino.game.level.main);
		// sub keys + index
		var sub_keys = Object.keys(Paigow.rules[Casino.game.level.main]);
		var sub_index = sub_keys.indexOf(Casino.game.level.sub);

		this.group.forEach(function(btn) {
			btn.disabled = true;
			btn.visible = true;
			// this buttons key is the same or less than the main index
			if (main_keys.indexOf(btn.main_key) <= main_index) {
				// button has no sub key then show it
				if (!btn.sub_key) {
					btn.disabled = false;
					btn.off.visible = false;
				} else {
					btn.disabled = true;
					btn.off.visible = true;
				}
				// this buttons sub key is the same or less than sub index
				if (sub_keys.indexOf(btn.sub_key) <= sub_index) {
					btn.disabled = false;
					btn.off.visible = false;
				} else {
					btn.disabled = true;
					btn.off.visible = true;
				}
			}
		},this);

		// create a text box for messages
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,960,75);
		sprite.addChild(gfx);
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 960 };
		this.message_box = this.add.text(0, 0, '', style);	
		sprite.addChild(this.message_box);
		sprite.x = 20;
		// place the information area
		sprite.y = 105;
		this.messageBox('Welcome to Learn Mode. Click a button above to begin.');

		this.showGroup('none');
	},
	messageBox(str) {
		this.message_box.text = str;
	},
	createExampleHand:function() {
		var str = Casino.game.level.sub.split('+');
		var chance;
		if (str[1] == 'joker') {
			chance = 100;
		} else {
			chance = 0;
		}
		hand = Cards.handCreate(Poker.create(Casino.game.level.main,chance,str[0]));
		// create an array to hold chosen hair cards
		Casino.game.hair_chosen = [];
		// solve for poker
		hand.poker = Poker.solve(hand.sorted);
		// solve for pai-gow
		hand.paigow = Paigow.solve(hand.poker);
		// set the hand data
		Casino.game.hand_data = hand;
		// display the hand
		this.displayNormalWay({hand:hand});
	},
	createCard:function(key) {
		var card = this.add.sprite();
		var shadow = this.add.sprite(-1, -2,'cards',key);
		shadow.scale.setTo(1.025);
		shadow.tint = 0x000000;
		shadow.alpha = 0.8;
		card.addChild(shadow);
		var outline = this.add.sprite(-2, -3,'cards',key);
		outline.scale.setTo(1.05);
		outline.tint = 0xFF0000;
		outline.alpha = 0.8;
		outline.visible = false;
		card.addChild(outline);
		card.outline = outline;
		var actual = this.add.sprite(0,0,'cards',key);
		card.addChild(actual);
		return card;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to disply the hand normally
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayNormalWay:function(opts){
		this.cards.destroy();
		this.cards = this.add.group();

		var hand = opts.hand;
		var cards = hand.shuffled;
		var card_x = 30;
		var card_y = 190;
		var spacer_x = 135;
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i]
			var card = this.createCard(key);
			if (hand.paigow.hair.indexOf(key) != -1) {
				card.outline.visible = true;
			}
			card.key = key;
//			card.inputEnabled = true;
//			card.input.useHandCursor = true;
//			card.events.onInputDown.add(this.gameSelectHair,card);
			if (card) {
				card.x = card_x+i*spacer_x;
				card.y = card_y;
				this.cards.add(card);
			}
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton: function(opts) {
		var btn_width = (opts.size != 'large') ? 113 : 130;
		var font_size = (opts.size != 'large') ? '12pt ' : '10pt ';

		var sprite = this.add.sprite(0,0);
		
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,1);
		gfx.drawRect(0,0,btn_width,25);
		sprite.addChild(gfx);
		if (opts.learn) {
			var gfx = this.add.graphics(0,0);
			gfx.beginFill(this.btn_inactive,1);
			gfx.drawRect(0,0,btn_width,25);
			sprite.addChild(gfx);
			sprite.off = gfx;
		}
		var style = { font: font_size+'Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: btn_width };
		var text = this.add.text(btn_width / 2, 4, opts.name, style);	
		text.anchor.setTo(0.5,0);
		if (!opts.disabled) {
			sprite.addChild(text);
			sprite.inputEnabled = true;
			sprite.input.useHandCursor = true;
			sprite.events.onInputDown.add(opts.callback,this);
		}
		sprite.key = (opts.learn) ? 'learn' : opts.name;
		
		return sprite;
	},
	showGroup:function(sub) {
		if (sub != 'none') {
			var super_keys = Object.keys(Paigow.rules[sub]);
		}
		// main keys + index
		var main_keys = Object.keys(Paigow.rules);
		var main_index = main_keys.indexOf(Casino.game.level.main);
		// sub keys + index
		var sub_keys = Object.keys(Paigow.rules[Casino.game.level.main]);
		var sub_index = sub_keys.indexOf(Casino.game.level.sub);

		this.group.forEach(function(btn) {
			btn.visible = false;
			// always show the main buttons
			if (!btn.sub_key) {
				btn.visible = true;
			}
			// show the sub group
			if (btn.main_key == sub && super_keys.indexOf(btn.sub_key) != -1) {
				btn.visible = true;
			}
			/*
			// this buttons sub key is the same or less than sub index
			if (sub_keys.indexOf(btn.sub_key) <= sub_index) {
				btn.disabled = false;
				btn.off.visible = false;
			} else {
				btn.disabled = true;
				btn.off.visible = true;
			}
			*/
		},this);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu or start a game state
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function(btn) {
		switch(btn.key) {
			case 'start': this.game.state.start('Game');
			break;
			case 'learn':
				// button not disabled
				if (!btn.disabled) {
					// no sub key means main button
					if (!btn.sub_key) {
						var str = 'Click the '+Casino.game.level.sub+' button above to start learning '+btn.main_key+' type hands\n'
						str += 'this will display a hand of that type, cards highlighted in red are the possible hair cards\n';
						str += 'click the button again to show another example\n';
						this.messageBox(str);
						this.showGroup(btn.main_key);
					} else {
						this.messageBox(Paigow.rules[Casino.game.level.main][Casino.game.level.sub]);
						this.createExampleHand();
					}
				} else {
					if (!btn.sub_key) {
						this.messageBox('You have not yet attained this level');
					}
				}
			break;
			default: this.game.state.start('MainMenu');
			break;
		}
	}
};


