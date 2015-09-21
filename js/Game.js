/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
Casino.Game = function(game) {};
Casino.Game.prototype = {
	debugHand:Casino.debugHand,
	debugBank:Casino.debugBank,
	debugPlayer:Casino.debugPlayer,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// common stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:Casino.createButton,
	createCard:Casino.createCard,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create:function() {
		// holy fuckity fuck!!!
		Casino.game.thing = this;
		// create some display groups
		Casino.game.group_bank = Casino.game.thing.add.group();
		Casino.game.group_player = Casino.game.thing.add.group();
		// clock stuff
		this.clock = 0;
		this.clockEvent;
		
		// buttons
		this.buttons = {};
		/*
			top ui elements
		*/
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.mainMenu});
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton({name:'start',callback:this.btnHandler});
		btn.x = 890;
		btn.y = 0;
		this.buttons['start'] = btn;
		// create a text box for game related information
		var sprite = Casino.game.thing.add.sprite(0,0);
		sprite.x = 120;
		sprite.y = 0;
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = 'mode: '+Casino.game.mode;
		this.txt_main_info = Casino.game.thing.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);

		/*
			bottom ui elements
		*/
		// button for ruless
		var btn = this.createButton({name:'rules',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 375;
		this.buttons['rules'] = btn;
		// button for getting the next hand
		var btn = this.createButton({name:'next',callback:this.btnHandler});
		btn.x = 890;
		btn.y = 375;
		this.buttons['next'] = btn;
		// create a text box for stat related information
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._STAT_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		// stat information box
		var style = { font: '12pt Courier', fill: Casino._STAT_TXT, align: 'left', wordWrap: true, wordWrapWidth: 400 };
		var txt = '';
		this.txt_stat_info = Casino.game.thing.add.text(5, 5, txt, style);
		sprite.addChild(this.txt_stat_info);
		// clock information box
		var gfx = Casino.game.thing.add.graphics(0,0);
//		gfx.beginFill(0xCC0000,1);
//		gfx.drawRect(630,0,130,25);
//		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'right', wordWrap: true, wordWrapWidth: 160 };
		var txt = 'clock: 00:00:00';
		this.txt_clock = Casino.game.thing.add.text(610, 5, txt, style);
		sprite.addChild(this.txt_clock);
		sprite.x = 120;
		sprite.y = 375;

		var wide = 60;
		var btn = this.createButton({name:'win',callback:this.btnHandler,wide:wide});
		btn.x = Casino._WIDTH / 2 - wide / 2;
		btn.y = 150;
		this.buttons['win'] = btn;
		var btn = this.createButton({name:'lose',callback:this.btnHandler,wide:wide});
		btn.x = Casino._WIDTH / 2 - wide / 2;
		btn.y = 225;
		this.buttons['lose'] = btn;
		var btn = this.createButton({name:'push',callback:this.btnHandler,wide:wide});
		btn.x = Casino._WIDTH / 2 - wide / 2;
		btn.y = 300;
		this.buttons['push'] = btn;

		/*
			general messages
		*/
		// create a text box for messages
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._MESSAGE_BG,1);
		gfx.drawRect(0,0,500,100);
		sprite.addChild(gfx);
		// stat information box
		var style = { font: '10pt Courier', fill: Casino._MESSAGE_TXT, align: 'center', wordWrap: true, wordWrapWidth: 500 };
		var txt = 'nifty message box';
		this.txt_message = Casino.game.thing.add.text(250, 50, txt, style);
		this.txt_message.anchor.setTo(0.5,0.5);
		sprite.addChild(this.txt_message);
		sprite.x = (Casino._WIDTH / 2) - 250;
		sprite.y = 60;
		this.box_message = sprite;
		
		// group for holding player stuff
		this.group_player = Casino.game.thing.add.group();
		// group for holding bank stuff
		this.group_bank = Casino.game.thing.add.group();

		// update the message box
		this.messageBox('hide');
		
		// update the stat box
		this.updateText({box:'stat'});
		
		this.btnDisplay();
		this.initMode(Casino.game.mode);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get the difference between 2 arrays
	///////////////////////////////////////////////////////////////////////////////////////////////////
	arrayDiff:function(big,small) {
		var diff = [];
		big.forEach(function(key) {
			if (-1 === small.indexOf(key)) {
				diff.push(key);
			}
		},this);
		return diff;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// what buttons to display
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnDisplay:function(options) {
		if (typeof this.buttons === 'undefined') {
			this.buttons = Casino.game.thing.buttons;
		}
		this.buttons['next'].visible = false;
		this.buttons['start'].visible = false;
		this.buttons['rules'].visible = false;
		
		this.buttons['win'].visible = false;
		this.buttons['lose'].visible = false;
		this.buttons['push'].visible = false;
		
		if (typeof options === 'undefined') {
			return;
		}
		var options = options.split(',');
		var minus = false;
		for (var i=0; i<options.length; i++) {
			var option = options[i];
			if (option[0] == '-') {
				option = option.replace('-','');
				minus = true;
			}
			if (this.buttons.hasOwnProperty(option)) {
				this.buttons[option].visible = (minus) ? false : true;
			}
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// update a text box
	///////////////////////////////////////////////////////////////////////////////////////////////////
	updateText:function(options) {
		var str;
		var txt;
		switch(options.box) {
			case 'main':
				str = options.str;
				txt = this.txt_main_info;
				break;
			case 'stat':
				if (Casino.game.mode != 'compare') {
					str = 'hands: '+Casino.game.stat.count;
					if (Casino.game.mode == 'learn') {
						str += ' / '+Casino.settings.hands_per_level;
					}
					str += ' - tries: '+Casino.game.stat.tries;
				} else {
					str = 'hands correct: '+Casino.game.stat.correct;
					str += ' - hands total: '+Casino.game.stat.total;
				}
				if (Casino.game.mode == 'speed') {
					var set = 0;
					for (var i=0;i<Casino.game.hands.length;i++) {
						if (Casino.game.hands[i].set) {
							set += 1;
						}
					}
					str = 'hand: '+(set)+' of 7';
					str += ' - tries: '+Casino.game.stat.tries;
				}
				options.rewrite = true;
				txt = Casino.game.thing.txt_stat_info;
				break;
		}
		if (!options.rewrite) {
			txt.text = txt.text+' '+str;
		} else {
			txt.text = str;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// update the message box
	///////////////////////////////////////////////////////////////////////////////////////////////////
	messageBox:function(vis,str) {
		Casino.game.thing.box_message.visible = (vis != 'hide') ? true : false;
		
		var txt;
		if (str) {
			switch(str) {
				case 'default':
					txt = 'click the cards you think belong in the hair';
					break;
					
				default:
					txt = str;
					break;

			}
			Casino.game.thing.txt_message.text = txt;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// clock stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	updateClock:function(dir) {
		var finish;
		var reset;
		var clock = this.clock;
		if (dir == 'down') {
			this.clock -= 1;
			finish = 0;
			reset = Casino.settings.timer_amount;
		} else {
			this.clock += 1;
			finish = 300;
			reset = 0;
		}
		if (this.clock === finish) {
			this.time.events.remove(this.clockEvent);
			this.txt_clock.text = "clock: done"
			this.gameEnd();
			this.clock = reset;
		} else {
			this.txt_clock.text = 'clock:' + this.clock;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// handle buttons
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function (btn) {
		var name = btn.name;
		this.btnDisplay('-'+name);
		switch(name) {
			case 'next':
				// attempt to run the game
				this.gameRun();
				break;
			case 'start':
				this.gameStart();
				break;
			case 'rules':
				if (Casino.game.mode == 'learn') {
					Casino.game.active = true;
					this.game.state.start('LevelMenu');
				}
				break;
			case 'win':
			case 'lose':
			case 'push':
				this.btnDisplay('next');
				Casino.game.hands[Casino.game.hand_number].choice = name;
				this.gameRun();
				break;
			default:
				console.log('btnHandler broke: ',name);
			break;
		}
	},
	/******************************************************************************************************************************************
		INIT THE GAME
	******************************************************************************************************************************************/
	initMode:function (init) {
		var game = Casino.game;
		// reset the games 'active' mode unless learning
		if (game.mode != 'learn') {
			game.active = false;
		}
		// reset some things
		game.hands = [];
		game.hands_set = [];
		game.hand = {};
		// reset the stats
		if (!game.active) {
			game.stat.count = 0;
			game.stat.tries = 0;
		}
		game.stat.total = 0;
		game.stat.correct = 0;
		this.updateText({box:'stat',str:'default'});
		// all ui elements created now initialize the game
		switch(game.mode) {
			case 'learn':
				if (!game.mastery) {
					this.updateText({box:'main',str:'- learning '+game.levels.now_main+' - '+game.levels.now_sub});
					this.btnDisplay('start');
					this.gameStart();
				} else {
					this.updateText({box:'main',str:'You have mastered the game of pai-gow. Go practice some hands!',rewrite:true});
				}
				break;
			case 'practice':
				this.updateText({box:'main',str:'- practice setting hands'});
				this.btnDisplay('start');
				break;
			case 'compare':
				this.updateText({box:'main',str:'- practice comparing hands'});
				this.btnDisplay('start');
				break;
			case 'speed':
				this.updateText({box:'main',str:'- try a speed test'});
				this.btnDisplay('start');
				break;
			case 'timed':
				this.updateText({box:'main',str:'- as many hands in 30 seconds'});
				this.btnDisplay('start');
				break;
		}
//		Casino.game = game;
	},
	/******************************************************************************************************************************************
		GAME RELATED FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// start a new game by resetting everything to a default condition
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameStart:function() {
		var game = Casino.game;
		// clean the display
		this.displayReset();


		game.hand_number = 0;
		game.hands = [];
		game.hands_set = [];
		game.hand = {};
		// reset the stats
		if (!game.active) {
			game.stat.count = 0;
			game.stat.tries = 0;
		}
		game.stat.total = 0;
		game.stat.correct = 0;
		game.skip_houseway = false;
		switch(game.mode) {
			case 'timed':
				game.skip_houseway = true;
				this.updateText({box:'main',str:'mode: timed - as many hands in 30 seconds',rewrite:true});
				this.clock = Casino.settings.timer_amount;
				this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.updateClock,this,'down');
				break;
			case 'speed':
				// create a deck
				game.deck = Cards.deckCreate('standard',true,1);
				// draw out 7 hands into game.hands
				for (var i=0; i<7; i++) {
					var hand = Cards.handCreate(game.deck.splice(0,7));
					this.gameCreateHand(hand);
					game.hands.push(hand);
				}
				game.hands.push(game.deck);
				break;
			case 'compare':
				game.step = 'boot';
				break;
		}
		
		// run the game
		Casino.game = game;
		this.gameRun();
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameRun:function() {
		var thing = Casino.game.thing;
		var game = Casino.game;
		switch(game.mode) {
			case 'learn':
				thing.btnDisplay('rules');
				thing.runModeLearn();
				break;
			case 'practice':
				// display broken
				if (typeof thing.debugHand !== 'undefined') {
					hand = Cards.handCreate(thing.debugHand);
				// otherwise just build a hand
				} else {
				var str = game.practice_mode.sub.split('+');
				var chance;
				if (str[1] == 'joker') {
					chance = 100;
				} else {
					chance = 0;
				}
				if (str[1] == 'random') {
					chance = Math.random()*100;
				}
					hand = Cards.handCreate(Poker.create({main:game.practice_mode.main,joker:chance,sub:str[0]}));
				}
				thing.gameCreateHand(hand);
				thing.displayHand({type:'normal',hand:hand});
				break;
			case 'compare':
				console.log('pre',game.step);
				var index = game.steps.compare.indexOf(game.step);
				game.step = game.steps.compare[index+1];
				console.log('post',game.step);
				thing.runModeCompare();
				break;
			case 'speed':
				console.log('running speed mode...');
				thing.runModeSpeed();
				break;
			case 'timed':
				hand = Cards.handCreate(Poker.create({main:'random',joker:50,sub:'random'}));
				thing.gameCreateHand(hand);
				thing.displayHand({type:'normal',hand:hand});
				game.hands.push(hand);
				game.hand_number = game.hands.length-1;
				break;
		}
		Casino.game = game;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run the learn mode
	///////////////////////////////////////////////////////////////////////////////////////////////////
	runModeLearn:function() {
		var game = Casino.game;
		if (game.stat.count < Casino.settings.hands_per_level) {
			console.log('game levels: ',game.levels);
			var str = game.levels.now_sub.split('+');
			var chance;
			if (str[1] == 'joker') {
				chance = 100;
			} else {
				chance = 0;
			}
			var hand = Cards.handCreate(Poker.create({main:game.levels.now_main,joker:chance,sub:str[0]}));
			this.gameCreateHand(hand);
			this.displayHand({type:'normal',hand:hand});

		} else {
			
			// main keys + index
			var main_keys = Object.keys(Paigow.rules);
			var main_index = main_keys.indexOf(game.levels.now_main);
			// sub keys + index
			var sub_keys = Object.keys(Paigow.rules[game.levels.now_main]);
			var sub_index = sub_keys.indexOf(game.levels.now_sub);
			
			if (main_keys.indexOf(game.levels.now_main) < main_keys.indexOf(game.levels.high_main)) {
				this.game.state.start('LevelMenu');
				return;
			}
			if (main_keys.indexOf(game.levels.now_main) == main_keys.indexOf(game.levels.high_main)) {
				if (sub_keys.indexOf(game.levels.now_sub) < sub_keys.indexOf(game.levels.high_sub)) {
					this.game.state.start('LevelMenu');
					return;
				}
			}
			// first increase sub_index by 1
			sub_index += 1;
			// sub_index over sub_key length, then increase main_index and reset sub index
			if (sub_index >= sub_keys.length) {
				main_index += 1;
				sub_index = 0;
			}
			// if main_index over length, end the game
			if (main_index >= main_keys.length) {
				this.gameEnd();
				return;
			}
			// set new level stuff
			game.levels.high_main = main_keys[main_index];
			game.levels.now_main = main_keys[main_index];
			var sub_keys = Object.keys(Paigow.rules[game.levels.high_main]);
			game.levels.high_sub = sub_keys[sub_index];
			game.levels.now_sub = sub_keys[sub_index];

			game.toast = true;
			this.game.state.start('LevelMenu');
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run the compare mode
	///////////////////////////////////////////////////////////////////////////////////////////////////
	runModeCompare:function(options) {
		var thing = Casino.game.thing;
		console.log('runModeCompare() all hands!!! ',Casino.game.hands);

		var game = Casino.game;
		var step = game.step;

		game.deck = Cards.deckCreate('standard',true,1);
		var deck = game.deck;
		thing.updateText({box:'stat'});

		// init some shit
		console.log('runModeCompare() - step: ',step);
		switch(step) {
			case 'init':
				console.log('runModeCompare() init some shit,');
				// debug compare so drop random hands, then jump to the choice step
				if (typeof Casino.debugCompare !== 'undefined') {
					var hand = Cards.handCreate(deck.splice(0,7));
					thing.gameCreateHand(hand);
					game.hands.push(hand);

					var hand = Cards.handCreate(deck.splice(0,7));
					thing.gameCreateHand(hand);
					game.hands.push(hand);
				// debug player and bank set, set both
				} else if (typeof Casino.debugBank !== 'undefined' && typeof Casino.debugPlayer !== 'undefined') {
					var hand = Cards.handCreate(Casino.debugBank);
					thing.gameCreateHand(hand);
					game.hands.push(hand);

					var hand = Cards.handCreate(Casino.debugPlayer);
					thing.gameCreateHand(hand);
					game.hands.push(hand);
				} else {
					game.hands = [];
					// bank hand
					var hand = Cards.handCreate(deck.splice(0,7));
					thing.gameCreateHand(hand);
					game.hands.push(hand);
					
					// player hand
					var hand = Cards.handCreate(deck.splice(0,7));
					thing.gameCreateHand(hand);
					game.hands.push(hand);
				}
				Casino.game = game;
				thing.gameRun();
				break;
			// set the bank hand
			case 'set-bank':
				console.log('runModeCompare() - set the bank hand now');
				// disply the bank hand
				game.hair_chosen = [];
				game.stat.count = 0;
				game.stat.tries = 0;
				game.hand_number = 0;
				var hand = game.hands[0];
				game.hand = hand;
				thing.displayHand({type:'normal',hand:hand});
				thing.messageBox('show','set the bank hand');
				break;
			// set the player hand
			case 'set-player':
				console.log('runModeCompare() - set the player hand now');
				if (game.mode != 'speed') {
					game.hand_number += 1;
				}
				thing.btnDisplay('-next');
				// display the player hand
				game.hair_chosen = [];
				game.stat.count = 0;
				game.stat.tries = 0;
				var hand = game.hands[game.hand_number];
				game.hand = hand;
				thing.displayHand({type:'normal',hand:hand});
				thing.messageBox('show','set the player');
				break;
			// compare the 2 hands
			case 'compare':
				console.log('runModeCompare() - compare the hands');
				// display both hands
				thing.displayHand({type:'houseway',mode:'small',hand:game.hands[game.hand_number]});
				thing.displayHand({type:'bank',reset:'none',hand:game.hands[0]});
//				that.prototype.displayHand({type:'houseway',mode:'small',hand:game.hands[game.hand_number]});
//				that.prototype.displayHand({type:'bank',reset:'none',hand:game.hands[0]});
				// display choice buttons
				thing.btnDisplay('win,lose,push');
				break;
			// final result
			case 'result':
				console.log('runModeCompare() - show result');
				// display both hands with a message
				if (typeof game.hand.choice !== 'undefined') {
					game.hand = game.hands[game.hand_number];
					var result = Paigow.compareHands(game.hands[game.hand_number],game.hands[0]);
					console.log('result: ',result);
					var correct = false;
					var str = '';
					if (result == game.hand.choice) {
						str = 'You chose correctly\nthe hand does indeed '+game.hand.choice;
						game.stat.correct++;
						correct = true;
					} else {
						str = 'You are incorrect!!!\nthe hand is actually a '+result;
					}
					game.hand.actual = result;
					game.hand.correct = correct;
					game.stat.total++;
					thing.updateText({box:'stat'})
					// normal compare mode show stuff
					if (game.mode != 'speed') {
						thing.btnDisplay('next');
						thing.displayHand({type:'houseway',mode:'toast',hand:game.hands[game.hand_number]});
						thing.displayHand({type:'bank',mode:'toast',reset:'none',hand:game.hands[0]});
						console.log('comparison result...',result);
						thing.messageBox('show',str);
					// speed mode just go to next hand
					} else {
						console.log('just go to next hand...');
						thing.displayReset();
						thing.btnDisplay();
						thing.runModeCompare();
					}
					// since the game always increases the step prior to running, restart with boot (so init gets going)
					game.step = 'boot';
				}
				break;
			default:
				console.log('runModeCompare() - no step');
				game.step = game.steps[0];
				break;
		}
		Casino.game = game;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run the speed mode
	///////////////////////////////////////////////////////////////////////////////////////////////////
	runModeSpeed:function() {
		var thing = Casino.game.thing;
		var game = Casino.game;
		console.log('\n\nrunning speed mode...');
		/*
		console.log('pre',game.step);
		var index = game.steps.compare.indexOf(game.step);
		game.step = game.steps.compare[index+1];
		console.log('post',game.step);
		*/
		thing.updateText({box:'stat'});
//		console.log('speed mode options: ',options);
		
		// bank hand not set
		if (game.hands[0].set !== true) {
			console.log('bank hand not set');
			game.step = 'set-bank';
		// bank hand is set so deal with player hands
		} else {
			// first time here so start the clock
			/*
			if (typeof this.clockEvent === 'undefined') {
				game.thing.clock = 0;
				game.thing.clockEvent = game.thing.time.events.loop(Phaser.Timer.SECOND,this.updateClock,this,'up');
			}
			*/
			// skip the houseway display in checkHair
			game.skip_houseway = true;
			for (var i=1;i<game.hands.length;i++) {
				console.log('processing hand...',i,game.hands[i]);
				game.hand_number = i;
				// hand is not set
				if (game.hands[i].set != true) {
					console.log('player hand not set',i);
					game.step = 'set-player';
					break;
				} else {
					// hand is set, no choice
					console.log('player hand: ',i,'is set');
					console.log('choice: ',game.hands[i].choice);
					if (typeof game.hands[i].choice === 'undefined') {
						console.log('hand set, no choice');
						game.step = 'compare';
						break;
					// hand set with choice, no actual
					} else {
						if (typeof game.hands[i].actual === 'undefined') {
							var result = Paigow.compareHands(game.hands[game.hand_number],game.hands[0]);
							console.log('result: ',result);
							var correct = false;
							if (result == game.hands[i].choice) {
								game.stat.correct++;
								correct = true;
							}
							game.hand.actual = result;
							game.hand.correct = correct;
							game.stat.total++;
							thing.updateText({box:'stat'})
						}
					}
				}
			}
		}
		// check the last hand for 'set' & 'choice'
		var last = game.hands[game.hands.length-2];
		if (last.set && last.choice ) {
			thing.gameEnd();
			return;
		}
		Casino.game = game;
		thing.runModeCompare();
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a hand of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameCreateHand:function(hand) {
		// create an array to hold chosen hair cards
		Casino.game.hair_chosen = [];
		// solve for poker
		hand.poker = Poker.solve(hand.sorted);
		// solve for pai-gow
		hand.paigow = Paigow.solve(hand.poker);

		this.updateText({box:'stat',str:'default'});
		// set the hand data for use throughout
		Casino.game.hand = hand;
		console.log('\nhand created: ',Casino.game.hand);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// handle selection of hair cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameSelectHair:function(card) {
		var hair_chosen = Casino.game.hair_chosen;
		// this card already selected, so unselect and remove it
		if (hair_chosen.indexOf(card) != -1) {
			card.y += 15;
			hair_chosen.splice(hair_chosen.indexOf(card),1); 
		} else {
			card.y -= 15;
			hair_chosen.push(card);
		}
		// selected 2 cards, check hair for correctness
		if (hair_chosen.length == 2) {
			that.prototype.gameCheckHair(hair_chosen);
		}
		// if hair not correct we are here so unselect the first in line
		if (hair_chosen.length > 2) {
			hair_chosen[0].y += 15;
			hair_chosen.splice(0,1); 
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// check hair selection for correctness
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameCheckHair:function(hair_chosen) {
		var game = Casino.game;
		
		var hand = Casino.game.hand;
//		console.log('checkHair() ',hair_chosen);
//		console.log('actual: ',hand.paigow.hair);

		// chosen hair cards
		var chosen = [hair_chosen[0].key,hair_chosen[1].key];
		// actual hair cards
		var hair = hand.paigow.hair;
		// required is true by default
		var required = true;
		// hair is more than 2 cards and 1st one does not match 2nd one
		if (hair.length > 2 && Cards.getName(hair[0]) != Cards.getName(hair[1])) {
			if (chosen.indexOf(hair[0]) == -1) {
				required = false;
			}
		}
		if (required && (hair.indexOf(chosen[0]) != -1 && hair.indexOf(chosen[1]) != -1)) {
			console.log('hair is correct so do neato stuff!!');
			if (game.hands.length != 0) {
				console.log('checkHair() - hand number: ',game.hand_number);
				console.log('checkHair() - all hands: ',game.hands);
				game.hands[game.hand_number].hair_chosen = chosen;
				game.hands[game.hand_number].hair_correct = true;
				if (game.mode == 'timed') {
					game.stat.correct++;
				}
			}
			// complete the hand
			this.handComplete();

			// skip houseway (timed / speed modes)
			if (!game.skip_houseway) {
				console.log('showing houseway');
				// display the hand
				game.thing.displayHand({type:'houseway',hand:hand,chosen:chosen});
				// show the 'next' button
				if (game.mode != 'learn') {
					game.thing.btnDisplay('next');
				} else {
					game.thing.btnDisplay('rules,next');
				}
			} else {
				console.log('skipping houseway');
				this.gameRun();
			}
		} else {
			// all modes must be set correctly (except timed can continue with wrong hair)
			if (!game.mode != 'timed') {
				var txt;
				var main = game.levels.now_main;
				var sub = game.levels.now_sub;
				if (game.stat.tries > Casino.settings.min_hint_count && game.stat.tries <= Casino.settings.max_hint_count) {
					txt = Paigow.rules[main][sub];
				} else if (game.stat.tries > Casino.settings.max_hint_count) {
					game.hint = true;
					if (game.mode != 'learn') {
						txt = 'slow down and maybe try the ones that are highlighted';
					} else {
						txt = Paigow.rules[main][sub];
					}
					game.group_player.forEach(function(btn) {
						if(hair.indexOf(btn.key) != -1)
							btn.outline.visible = true;
					},this);
				} else {
					txt = 'Hair incorrect, try again :(';
				}
				this.messageBox('show',txt);
			// timed mode continue with wrong hair
			} else {
				if (game.hands.length != 0) {
					console.log('checkHair() - hand number: ',game.hand_number);
					console.log('checkHair() - all hands: ',game.hands);
					game.hands[game.hand_number].hair_chosen = chosen;
					game.hands[game.hand_number].hair_correct = false;
				}
			}
			// reset the chosen hair cards
			game.hair_chosen[0].y += 15;
			game.hair_chosen.splice(0,1); 
			game.hair_chosen[0].y += 15;
			game.hair_chosen.splice(0,1);
			// complete the hand
			this.handComplete('fail');
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// hand complete so do stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	handComplete:function(status) {
		console.log(status);
		var game = Casino.game;
		
		// only if we are tracking hands (ie speed / compare / timed modes)
		if (game.hands.length != 0) {
			console.log('handComplete() - hand number: ',game.hand_number);
			console.log('handComplete() - all hands: ',game.hands);
			game.hands[game.hand_number].set = true;
		}
		
		// no status means hand was correct
		if (typeof status === 'undefined') {
			// increment the hand count 
			if (!game.hint) {
				game.stat.count += 1;
			} else {
				game.hint = false;
			}

			// reset the tries counter
			game.stat.tries = 0;
		// any status means the hand was wrong
		} else {
			game.stat.tries += 1;
			this.updateText({box:'stat',str:'default'});
			
		}
		if (game.mode == 'timed') {
			this.gameRun();
		}
		Casino.game = game;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// end a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameEnd:function() {
		this.game.state.start('Review');
	},
	/******************************************************************************************************************************************
		DISPLAY FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to reset the display
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayReset:function(opt) {
		switch(opt) {
			case 'player':
				// destroy the 'player' layout
				Casino.game.group_player.destroy();
				break;
			case 'bank':
				// destroy the 'bank' layout
				Casino.game.group_bank.destroy();
				break;
			default:
				// destroy the 'player' layout
				Casino.game.group_player.visible = false;
				Casino.game.group_player.destroy();
				Casino.game.group_bank.destroy();
				break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayHand:function(options){
		// reset the player and bank groups
		if (options.reset !== 'none') {
			this.displayReset();
		}
		switch(options.type) {
			case 'bank':
				this.messageBox('hide');
				Casino.game.group_bank.destroy();
				Casino.game.group_bank = Casino.game.thing.add.group();
				var hand = options.hand;
				var display = Display.bank(options);

				if (typeof display['txt'] !== 'undefined') {
					// create a text box for hand related information
					var sprite = Casino.game.thing.add.sprite(0,0);
					var gfx = Casino.game.thing.add.graphics(0,0);
					gfx.beginFill(Casino._INFO_BG,1);
					gfx.drawRect(0,0,display['txt'].width,display['txt'].height);
					sprite.addChild(gfx);
					var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: display['txt'].width };
					var txt = 'bank hand:\n';
					txt += 'rule: '+hand.paigow.rule+'\n';
					txt += 'bonus: '+hand.paigow.bonus+'\n';
					txt += 'desc: '+hand.paigow.desc+'\n'
					var text = Casino.game.thing.add.text(0,0, txt, style);	
					sprite.addChild(text);
					Casino.game.group_bank.add(sprite);
					sprite.x = display['txt'].x;
					sprite.y = display['txt'].y;
				}

				for (var i=0;i<hand.shuffled.length;i++) {
					var key = hand.shuffled[i];
					var card = this.createCard({key:key,disabled:true});
					card.scale.setTo(display[key].scale);
					card.x = display[key].x;
					card.y = display[key].y;
					Casino.game.group_bank.add(card);
				}
				break;
			case 'houseway':
				this.messageBox('hide');
				Casino.game.group_player.destroy();
				Casino.game.group_player = Casino.game.thing.add.group();
				var hand = options.hand;
				var display = Display.houseway(options);

				if (typeof display['txt'] !== 'undefined') {
					// create a text box for hand related information
					var sprite = Casino.game.thing.add.sprite(0,0);
					var gfx = Casino.game.thing.add.graphics(0,0);
					gfx.beginFill(Casino._INFO_BG,1);
					gfx.drawRect(0,0,display['txt'].width,display['txt'].height);
					sprite.addChild(gfx);
					var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: display['txt'].width };
					var txt = 'rule: '+hand.paigow.rule+'\n';
					txt += 'bonus: '+hand.paigow.bonus+'\n';
					txt += 'desc: '+hand.paigow.desc+'\n'
					var text = Casino.game.thing.add.text(0,0, txt, style);	
					sprite.addChild(text);
					Casino.game.group_player.add(sprite);
					sprite.x = display['txt'].x;
					sprite.y = display['txt'].y;
				}

				for (var i=0;i<hand.shuffled.length;i++) {
					var key = hand.shuffled[i];
					var card = this.createCard({key:key,disabled:true});
					card.scale.setTo(display[key].scale);
					card.x = display[key].x;
					card.y = display[key].y;
					Casino.game.group_player.add(card);
				}
				break;
			default:
				this.messageBox('show','default');
				Casino.game.group_player.destroy();
				Casino.game.group_player = Casino.game.thing.add.group();
				var hand = options.hand;
				var display = Display.normal(options);
				for (var i=0;i<hand.shuffled.length;i++) {
					var key = hand.shuffled[i];
					var card = this.createCard({key:key,disabled:display[key].disabled,callback:this.gameSelectHair});
					card.x = display[key].x;
					card.y = display[key].y;
					Casino.game.group_player.add(card);
				}
				break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu
	///////////////////////////////////////////////////////////////////////////////////////////////////
	mainMenu: function(pointer) {
		this.game.state.start('MainMenu');
	}
};
that = Casino.Game;
