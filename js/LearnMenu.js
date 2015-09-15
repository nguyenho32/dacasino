Casino.LearnMenu = function(game) {};
Casino.LearnMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		
		this.clock = 0;
		this.clockEvent;
		// active button color
		this.btn_color_active = 0x000000;
		// inactive button color
		this.btn_color_inactive = 0xCCCCCC;
		this.buttons = {};
		this.group = this.add.group();
		this.cards = this.add.group();

		// current main level
		this.current_main;
		// current sub_level
		this.current_sub;
		
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton({name:'start',callback:this.btnHandler});
		this.buttons['start'] = btn;
		btn.x = 890;
		btn.y = 375;
		// button for options
		var btn = this.createButton({name:'option',callback:this.btnHandler});
		this.buttons['option'] = btn;
		btn.x = 0;
		btn.y = 375;
		// create a text box for game related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = '';
		if (Casino.game.toast) {
			Casino.game.toast = false;
			txt = 'congrats!!! new level: '+Casino.game.level.main+' - '+Casino.game.level.sub;
		} else {
			txt = 'click the button for an example - current level: '+Casino.game.level.main+' - '+Casino.game.level.sub;
		}
		this.txt_main_info = this.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);
		sprite.x = 120;
		sprite.y = 0;

		// create a text box for stat related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = '<--- click to return to this menu            click to begin setting hands --->';
		this.txt_main_info = this.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);		
		sprite.x = 120;
		sprite.y = 375;

		// create buttons for the levels
		var width;
		var i = 0;
		for (var key in Paigow.rules) {
			var value = Paigow.rules[key];
			var btn = this.createButton({name:key,callback:this.btnHandler,size:'large',learn:true});
			btn.main_key = key;
			btn.x = 30 +(i*135);
			btn.y = 30;
			var n = 1;
			this.group.add(btn);
			for (var sub in Paigow.rules[key]) {
				var subval = Paigow.rules[key][sub];
				var btn = this.createButton({name:sub,callback:this.btnHandler,size:'large',learn:true});
				btn.main_key = key;
				btn.sub_key = sub;
				btn.x = n*135-35;
				btn.y = 60;
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

		// create a text box for messages
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,800,120);
		sprite.addChild(gfx);
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 800 };
		this.message_box = this.add.text(0, 0, '', style);	
		sprite.addChild(this.message_box);
		sprite.x = 100;
		sprite.y = 95;

		this.showGroup(Casino.game.level.main);
		this.current_main = Casino.game.level.main;
		this.current_sub = Casino.game.level.sub;
		this.messageBox(Paigow.rules[Casino.game.level.main][Casino.game.level.sub]);
		this.createExampleHand(Casino.game.level.main,Casino.game.level.sub);
	},
	messageBox(str) {
		this.message_box.text = str;
	},
	createExampleHand:function(main,sub) {
		var str = sub.split('+');
		var chance;
		if (str[1] == 'joker') {
			chance = 100;
		} else {
			chance = 0;
		}
		hand = Cards.handCreate(Poker.create({main:main,joker:chance,sub:str[0]}));
		// create an array to hold chosen hair cards
		Casino.game.hair_chosen = [];
		// solve for poker
		hand.poker = Poker.solve(hand.sorted);
		// solve for pai-gow
		hand.paigow = Paigow.solve(hand.poker);
		// set the hand data
		Casino.game.hand_data = hand;

		this.cards.destroy();
		this.cards = this.add.group();
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			var card = this.createCard(key);
			card.key = key;
			this.cards.add(card);
		}
		// display the hand
		Display.normal(this.cards,{size:'small',hand:hand});
		console.log('created hand for learn display...',hand);
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
			gfx.beginFill(this.btn_color_inactive,1);
			gfx.drawRect(0,0,btn_width,25);
			sprite.addChild(gfx);
			sprite.off = gfx;

			var gfx = this.add.graphics(0,0);
			gfx.beginFill(this.btn_color_current,1);
			gfx.drawRect(0,0,btn_width,25);
			sprite.addChild(gfx);
			sprite.current = gfx;
			sprite.current.visible = false;
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
	showGroup:function(main) {
		var super_keys = Object.keys(Paigow.rules);
		var current_level = Casino.game.level.main
		var current_index = super_keys.indexOf(current_level);

		// main keys / index + sub index
		var main_keys = Object.keys(Paigow.rules[main]);
		var main_index = super_keys.indexOf(main);
		var sub_index = main_keys.indexOf(Casino.game.level.sub);

		this.group.forEach(function(btn) {
			btn.visible = false;
			btn.inputEnabled = false;
			btn.input.useHandCursor = false;
			btn.off.visible = true;
			// always show the main buttons
			if (!btn.sub_key) {
				btn.visible = true;
				btn.inputEnabled = true;
				btn.input.useHandCursor = true;
				btn.off.visible = false;
			} else {
				// deal with sub buttons that are not part of the main_keys
				if (main_keys.indexOf(btn.sub_key) == -1) {
					btn.visible = false;
				}
				// main index over current index, show button but its not active
				if (main_index > current_index) {
					if (btn.main_key == main) {
						btn.visible = true;
						btn.off.visible = true;
					}
				} else if (main_index < current_index) {
					if (btn.main_key == main) {
						btn.visible = true;
						btn.off.visible = false;
					}
					btn.inputEnabled = true;
					btn.input.useHandCursor = true;
				} else {
					// otherwise the index matches
					if (btn.main_key == main) {
						btn.visible = true;
					}
					if (main_keys.indexOf(btn.sub_key) != -1) {
						btn.off.visible = true;
						// this buttons sub key is the same or less than sub index
						if (main_keys.indexOf(btn.sub_key) <= sub_index) {
							btn.inputEnabled = true;
							btn.input.useHandCursor = true;
							btn.off.visible = false;
						}
					}
				}
			}
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
				// no sub key means main button
				if (!btn.sub_key) {
					this.showGroup(btn.main_key);
					this.current_main = btn.main_key;
					var super_keys = Object.keys(Paigow.rules);
					var current_level = Casino.game.level.main
					var current_index = super_keys.indexOf(current_level);
					var main_index = super_keys.indexOf(btn.main_key);
					var str = '';
					if (main_index <= current_index) {
						str = 'select a level above';
					} else {
						str = 'You have not yet attained this level';
					}
					this.messageBox(str);
				} else {
					this.btn_current_sub = btn;
					this.messageBox(Paigow.rules[this.current_main][btn.sub_key]);
					this.createExampleHand(btn.main_key,btn.sub_key);
				}
			break;
			case 'option':
				console.log('hahahaha');
				break;
			default: this.game.state.start('MainMenu');
			break;
		}
	}
};


