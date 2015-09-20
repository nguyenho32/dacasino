Casino.LevelMenu = function(game) {};
Casino.LevelMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		
		this.clock = 0;
		this.clockEvent;
		// active button color
		this.btn_color_active = 0x0000FF;
		// inactive button color
		this.btn_color_inactive = 0xFF0000;
		// available button color
		this.btn_color_available = 0x00FF00;
		
		// start / rules
		this.buttons = {};
		// all the level buttons
		this.levels = this.add.group();
		// the cards
		this.cards = this.add.group();
		
		this.current = {main:'',sub:''};

		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton({name:'start',callback:this.btnHandler});
		this.buttons['start'] = btn;
		btn.x = 890;
		btn.y = 375;
		// button for ruless
		var btn = this.createButton({name:'rules',callback:this.btnHandler});
		this.buttons['rules'] = btn;
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
		var txt;
		if (Casino.game.active) {
			txt = '<--- click to return to the game';
		} else if (Casino.game.mastery) {
			txt = 'you are a master';
		} else {
			txt = '<--- click to return to this menu            click to begin setting hands --->';
		}
		this.txt_main_info = this.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);		
		sprite.x = 120;
		sprite.y = 375;


		// the level buttons
		var levels = [];
		var i = 0;
		for (var main in Paigow.rules) {
			var value = Paigow.rules[main];
			var btn = this.createButton({name:main,callback:this.btnHandler,size:'large',levels:true});
			btn.type = 'main';
			btn.key = main;
			btn.x = 15 +(i*140);
			btn.y = 30;
			this.levels.add(btn);
			i++;
		}
		for (var i=0; i<Paigow.levels.length; i++) {
			var sub = Paigow.levels[i];
			var btn = this.createButton({name:sub,callback:this.btnHandler,size:'large',levels:true});
			btn.type = 'sub';
			btn.key = sub;
			btn.visible = false;
			this.levels.add(btn);
		}
		/*

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
		*/
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
		if (!Casino.game.mastery) {
			if (Casino.game.active) {
				this.buttons['start'].visible = false;
			}
			this.showGroup(Casino.game.level.main);
			this.current_main = Casino.game.level.main;
			this.current_sub = Casino.game.level.sub;
			this.messageBox(Paigow.rules[Casino.game.level.main][Casino.game.level.sub]);
			this.createExampleHand(Casino.game.level.main,Casino.game.level.sub);
		} else {
			this.showGroup(Casino.game.level.main);
			this.messageBox('You have mastered the game of pai-gow. Go practice some hands or select options above to review hands');
			this.buttons['start'].visible = false;
			this.buttons['rules'].visible = false;
			
		}
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
		var display = Display.normal({hand:hand,mode:'small'});
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			var card = this.createCard(key);
			card.key = key;
			this.cards.add(card);
			card.x = display[key].x;
			card.y = display[key].y;
			card.scale.setTo(display[key].scale);
			if (display[key].outline) {
				card.y -=20;
				card.outline.visible = true;
			}
		}
		// display the hand
		console.log('created hand for learn display...',hand);
	},
	createCard:function(key) {
		var card = this.add.sprite();

		var shadow = this.add.sprite(-2, -2,'cards',key);
		shadow.scale.setTo(1.025);
		shadow.tint = 0x000000;
		shadow.alpha = 0.8;
		card.addChild(shadow);

		var actual = this.add.sprite(0,0,'cards',key);
		card.addChild(actual);

		var outline = this.add.sprite(-3, -3,'cards',key);
		outline.scale.setTo(1.05);
		outline.tint = 0x2F4F2F;
		outline.alpha = 0.15;
		outline.visible = false;
		card.addChild(outline);
		card.outline = outline;

		return card;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton: function(opts) {
		var btn_width = (opts.size != 'large') ? 113 : 130;
		var font_size = (opts.size != 'large') ? '12pt ' : '10pt ';

		var sprite = this.add.sprite(0,0);
		
		if (opts.levels) {
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
		gfx.beginFill(Casino._BTN_BG,0.5);
		gfx.drawRect(0,0,btn_width,25);
		sprite.addChild(gfx);

		var style = { font: font_size+'Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: btn_width };
		var text = this.add.text(btn_width / 2, 4, opts.name, style);	
		text.anchor.setTo(0.5,0);
		if (!opts.disabled) {
			sprite.addChild(text);
			sprite.inputEnabled = true;
			sprite.input.useHandCursor = true;
			sprite.events.onInputDown.add(opts.callback,this);
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
		sprite.name = (opts.levels) ? 'levels' : opts.name;
		
		return sprite;
	},
	
	showGroup:function(key) {
		var main = Casino.game.level.main;
		var sub = Casino.game.level.sub;
		
		var super_keys = Object.keys(Paigow.rules);

		if (this.current.main == '') {
			this.current.main = Casino.game.level.main;
		}
		if (this.current.sub == '') {
			this.current.sub = Casino.game.level.sub;
		}
		// loop the rules of this group
		var keys = [];
		for (var key in Paigow.rules[this.current.main]) {
			keys.push(key);
		}
		// now loop the levels and do fun shit
		n = 0;
		for (var i=0; i<this.levels.children.length; i++) {
			var btn = this.levels.children[i];
			if (btn.type == 'main') {
				if (super_keys.indexOf(btn.key) <= super_keys.indexOf(main)) {
					btn.activate('available');
				} else {
					btn.activate('inactive');
				}
				if (btn.key == this.current.main) {
					btn.activate('active');
				}
			} else {
				// if the current main is below the game main then show everything for this level
				if (super_keys.indexOf(this.current.main) < super_keys.indexOf(main)) {
					if (keys.indexOf(btn.key) != -1) {
						btn.visible = true;
						btn.x = Casino._WIDTH / 2 - (keys.length * 140 / 2 )+ 140 *n;
						btn.y = 65;
						n++;
						btn.activate('available');
					} else {
						btn.visible = false;
					}
				// if the current main is below the game main then show everything for this level
				} else if (super_keys.indexOf(this.current.main) == super_keys.indexOf(main)) {
					console.log('levels match');
					console.log('sub level: ',sub);
					if (keys.indexOf(btn.key) != -1) {
						btn.visible = true;
						btn.x = Casino._WIDTH / 2 - (keys.length * 140 / 2 )+ 140 *n;
						btn.y = 65;
						n++;
						if (keys.indexOf(btn.key) < keys.indexOf(sub)) {
							btn.activate('available');
						}
						if (keys.indexOf(btn.key) > keys.indexOf(sub)) {
							btn.activate('inactive');
						}
						console.log('sub...',this.current.sub);
						if (btn.key == this.current.sub) {
							btn.activate('active');
						}
					} else {
						btn.visible = false;
					}
				// otherwise just deal with this level
				} else {
					if (keys.indexOf(btn.key) != -1) {
						btn.activate('inactive');
						btn.visible = true;
						btn.x = Casino._WIDTH / 2 - (keys.length * 140 / 2 )+ 140 *n;
						btn.y = 65;
						n++;
					} else {
						btn.visible = false;
					}
				}
			} 
		}
	},
	/*
	showGroup:function(main) {
		var super_keys = Object.keys(Paigow.rules);
		var current_level = Casino.game.level.main
		var current_index = super_keys.indexOf(current_level);

		// main keys / index + sub index
		var main_keys = Object.keys(Paigow.rules[main]);
		var main_index = super_keys.indexOf(main);
		var sub_index = main_keys.indexOf(Casino.game.level.sub);

		this.levels.forEach(function(btn) {
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
	*/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu or start a game state
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler:function(btn) {
		
		switch(btn.name) {
			case 'start': this.game.state.start('Game');
			break;
			case 'levels':
				console.log(btn.key);
				if (btn.type != 'sub') {
					this.current.main = btn.key;
				} else {
					this.current.sub = btn.key;
				}
				this.showGroup(btn.key);
			/*
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
						str = 'select a category from above';
					} else {
						str = 'You have not yet attained this level';
					}
					this.messageBox(str);
				} else {
					this.btn_current_sub = btn;
					this.messageBox(Paigow.rules[this.current_main][btn.sub_key]);
					this.createExampleHand(btn.main_key,btn.sub_key);
				}
				*/
			break;
			case 'rules':
					if (Casino.game.active) {
						this.game.state.start('Game');
					} else {
						this.clock = 3;
						this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.clockHandler,this);
						this.messageBox('you are already in the ruless menu, use the button to return here from the game');
					}
				break;
			default: this.game.state.start('MainMenu');
			break;
		}
	},
	clockHandler:function() {
		this.clock -= 1;
		if (this.clock === 0) {
			this.time.events.remove(this.clockEvent);
			this.messageBox('select a category from above');
		}
	}
};


