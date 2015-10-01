/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
Casino.LevelMenu = function(game) {};
Casino.LevelMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// common stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:Casino.createButton,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		var game = Casino.game;
		
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
		this.level_buttons = this.add.group();
		// the cards
		this.cards = this.add.group();
		
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton({name:'start',callback:this.btnHandler});
		this.buttons['start'] = btn;
		btn.x = 890;
		btn.y = 375;
		// button for rules
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
			txt = 'congrats!!! new level: '+game.levels.high_main+' - '+game.levels.high_sub;
		} else {
			txt = 'click the button for an example - current level: '+game.levels.now_main+' - '+game.levels.now_sub;
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
		if (game.active) {
			txt = '<--- click to return to the game';
		} else if (game.mastery) {
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
			var btn = this.createButton({name:main,callback:this.btnHandler,size:'large'});
			btn.name = 'levels';
			btn.type = 'main';
			btn.key = main;
			btn.x = 15 +(i*140);
			btn.y = 30;
			this.level_buttons.add(btn);
			i++;
		}
		for (var i=0; i<Paigow.levels.length; i++) {
			var sub = Paigow.levels[i];
			var btn = this.createButton({name:sub,callback:this.btnHandler,size:'large'});
			btn.name = 'levels';
			btn.type = 'sub';
			btn.key = sub;
			btn.visible = false;
			this.level_buttons.add(btn);
		}
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

		this.showGroup(game.levels.high_main);
		if (!game.mastery) {
			if (game.active) {
//				this.buttons['start'].visible = false;
			}
			/*
			this.showGroup(game.level.main);
			game.lvl_tracker.high_main =
			this.current_main = game.level.main;
			this.current_sub = game.level.sub;
			*/
			this.messageBox(Paigow.rules[game.levels.high_main][game.levels.high_sub]);
			this.createExampleHand(game.levels.high_main,game.levels.high_sub);
		} else {
			this.showGroup(game.level.main);
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
			var card = new Card(this.game,display[key].x,display[key].y,key);
			this.cards.add(card);
			card.scale.setTo(0.25);
			if (display[key].outline) {
				card.y -=20;
				card.outline.visible = true;
			}
		}
		// display the hand
		console.log('created hand for learn display...',hand);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// show a group of level buttons
	///////////////////////////////////////////////////////////////////////////////////////////////////
	showGroup:function(key) {
		var game = Casino.game;
		console.log('showGroup - levels: ',game.levels);
		var main = game.levels.high_main;
		var sub = game.levels.high_sub;
		
		var super_keys = Object.keys(Paigow.rules);

		// loop the rules of this group
		var keys = [];
		for (var key in Paigow.rules[game.levels.now_main]) {
			keys.push(key);
		}
		// now loop the levels and do fun shit
		n = 0;
		for (var i=0; i<this.level_buttons.children.length; i++) {
			var btn = this.level_buttons.children[i];
			// main buttons
			if (btn.type == 'main') {
				if (super_keys.indexOf(btn.key) <= super_keys.indexOf(main)) {
					btn.activate('available');
					if (btn.key == game.levels.now_main) {
						btn.activate('active');
					}
				} else {
					btn.activate('inactive');
				}
			} else {
				// if the current main is below the game main then show everything for this level
				if (super_keys.indexOf(game.levels.now_main) < super_keys.indexOf(main)) {
					if (keys.indexOf(btn.key) != -1) {
						btn.visible = true;
						btn.x = Casino._WIDTH / 2 - (keys.length * 140 / 2 )+ 140 *n;
						btn.y = 65;
						n++;
						btn.activate('available');
						if (btn.key == game.levels.now_sub) {
							btn.activate('active');
						}
					} else {
						console.log('fails this check');
						btn.visible = false;
					}
				// if the current main is equal to the game main then show everything for this level
				} else if (super_keys.indexOf(game.levels.now_main) == super_keys.indexOf(main)) {
					if (keys.indexOf(btn.key) != -1) {
						btn.visible = true;
						btn.x = Casino._WIDTH / 2 - (keys.length * 140 / 2 )+ 140 *n;
						btn.y = 65;
						n++;
						if (keys.indexOf(btn.key) <= keys.indexOf(sub)) {
							btn.activate('available');
						}
						if (btn.key == game.levels.now_sub) {
							btn.activate('active');
						}
						if (keys.indexOf(btn.key) > keys.indexOf(sub)) {
							btn.activate('inactive');
						}
					} else {
						console.log('fails that check');
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
						console.log('fails another check');
						btn.visible = false;
					}
				}
			}
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// check if 'option' is the same or higher than game level
	///////////////////////////////////////////////////////////////////////////////////////////////////
	checkLevel(options) {
		var games = Casino.game;
		if (options.main && !options.sub) {
			var super_keys = Object.keys(Paigow.rules);
			var current_level = games.levels.high_main;
			var current_index = super_keys.indexOf(current_level);
			var main_index = super_keys.indexOf(options.main);
			// check the sub level
			var sub_keys = Object.keys(Paigow.rules[current_level]);
			var game_sub_level = games.levels.high_sub;
			var game_sub_index = sub_keys.indexOf(game_sub_level);
			var sub_index = sub_keys.indexOf(options.sub);
			if (main_index <= current_index) {
				return true;
			} else {
				return false;
			}
		}
		if (options.sub) {
			var super_keys = Object.keys(Paigow.rules);
			var current_level = games.levels.high_main;
			var current_index = super_keys.indexOf(current_level);
			var main_index = super_keys.indexOf(options.main);
			if (main_index <= current_index) {
				return true;
			} else {
				if (sub_index <= game_sub_index) {
					return true;
				} else {
					return false;
				}
			}
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu or start a game state
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler:function(btn) {
		var game = Casino.game;
		console.log(btn);
		switch(btn.name) {
			case 'start': this.game.state.start('Game');
			break;
			case 'levels':
				if (btn.type != 'sub') {
					game.levels.now_main = btn.key;
					game.levels.now_sub = 'reset';
					if (this.checkLevel({main:btn.key})) {
						str = 'select a category from above';
					}
				} else {
					game.levels.now_sub = btn.key;
					if (this.checkLevel({main:game.levels.now_main,sub:btn.key})) {
						str = Paigow.rules[game.levels.now_main][game.levels.now_sub];
						this.createExampleHand(game.levels.now_main,game.levels.now_sub);
					}
				}
				this.messageBox(str);
				this.showGroup(btn.key);
			break;
			case 'rules':
					if (Casino.game.active) {
						this.game.state.start('Game');
					} else {
						this.clock = 3;
						this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.clockHandler,this);
						this.messageBox('you are already in the rules menu, use the button to return here from the game');
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


