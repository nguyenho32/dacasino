Casino.Game = function(game) {};
Casino.Game.prototype = {
	debugHand:Casino.debugHand,
	debugBank:Casino.debugBank,
	debugPlayer:Casino.debugPlayer,
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
		this.buttons['next'].visible = false;
		this.buttons['start'].visible = false;
		this.buttons['option'].visible = false;
		
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
			if (option[0] != '-') {
				
			} else {
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
					str = 'hands: '+Casino.game.hand.count;
					if (Casino.game.mode == 'learn') {
						str += ' / '+Casino.settings.hands_per_level;
					}
					str += ' - tries: '+Casino.game.hand.tries;
				} else {
					str = 'hands correct: '+Casino.game.hand.correct;
					str += ' - hands total: '+Casino.game.hand.total;
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
			finish = 30;
			reset = 0;
		}
		if (this.clock === finish) {
			this.clock = reset;
			this.txt_clock.text = "clock: done"
			this.time.events.remove(this.clockEvent);
			this.gameEnd();
		} else {
			this.txt_clock.text = 'clock:' + this.clock;
		}
	},
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
		// button for options
		var btn = this.createButton({name:'option',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 375;
		this.buttons['option'] = btn;
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
	// handle buttons
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function (btn) {
		var key = btn.key;
		this.btnDisplay('-'+key);
		switch(key) {
			case 'next':
				// attempt to run the game
				this.gameRun(Casino.game.mode);
				break;
			case 'start':
				this.gameStart(Casino.game.mode);
				break;
			case 'option':
				if (Casino.game.mode == 'learn') {
					Casino.game.active = true;
					this.game.state.start('LearnMenu');
				}
				break;
			case 'win':
			case 'lose':
			case 'push':
				this.runModeCompare({choice:key});
				this.btnDisplay('next');
				break;
			default:
				console.log('btnHandler broke: ',key);
			break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:function(option) {
		var txt = option.name;
		var callback = option.callback;
		var arg = option.arg;
		var wide = (typeof option.wide !== 'undefined') ? option.wide : 113;
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,1);
		gfx.drawRect(0,0,wide,25);
		gfx.name = 'graphic';
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: wide };
		var text = Casino.game.thing.add.text(wide/2, 4, txt, style);	
		text.anchor.setTo(0.5,0);
		text.inputEnabled = true;
		sprite.addChild(text);
		sprite.inputEnabled = true;
		sprite.input.useHandCursor = true;
		sprite.events.onInputDown.add(callback,this,arg);
		sprite.key = txt;
		
		return sprite;
	},
	/******************************************************************************************************************************************
		INIT THE GAME
	******************************************************************************************************************************************/
	initMode:function (init) {
		// reset the games 'active' mode unless learning
		if (Casino.game.mode != 'learn') {
			Casino.game.active = false;
		}
		if (!Casino.game.active) {
			Casino.game.hand.count = 0;
			Casino.game.hand.tries = 0;
		}
		this.updateText({box:'stat',str:'default'});
		// all ui elements created now initialize the game
		switch(Casino.game.mode) {
			case 'learn':
				if (!Casino.game.mastery) {
					this.updateText({box:'main',str:'- learning '+Casino.game.level.main+' - '+Casino.game.level.sub});
					this.btnDisplay('start');
					this.gameStart('learn');
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
				this.updateText({box:'main',str:'- try a speed test .:. coming soon .:.'});
				this.btnDisplay();
				break;
			case 'timed':
				this.updateText({box:'main',str:'- as many hands in 30 seconds'});
				this.btnDisplay('start');
				break;
		}
	},
	/******************************************************************************************************************************************
		GAME RELATED FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// start a new game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameStart:function(type) {
		this.displayReset();
		
		Casino.game.hand_data = {};
		// reset the stats
		if (!Casino.game.active) {
			Casino.game.hand.count = 0;
			Casino.game.hand.tries = 0;
		}
		Casino.game.hand.total = 0;
		Casino.game.hand.correct = 0;
		switch(type) {
			case 'timed':
				this.updateText({box:'main',str:'mode: timed - as many hands in 30 seconds',rewrite:true});
				this.clock = Casino.settings.timer_amount;
				this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.updateClock,this,'down');
			break;
		}
		
		// run the game
		this.gameRun(Casino.game.mode);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameRun:function(type) {
		var str = (type != 'learn') ? Casino.game.practice_mode.sub.split('+') : Casino.game.level.sub.split('+');
		var chance;
		if (str[1] == 'joker') {
			chance = 100;
		} else {
			chance = 0;
		}
		if (str[1] == 'random') {
			chance = Math.random()*100;
		}
		switch(type) {
			case 'learn':
				this.btnDisplay('option');
				this.runModeLearn();
				break;
			case 'practice':
				// display broken
				if (typeof this.debugHand !== 'undefined') {
					hand = Cards.handCreate(this.debugHand);
				// otherwise just build a hand
				} else {
					hand = Cards.handCreate(Poker.create({main:Casino.game.practice_mode.main,joker:chance,sub:str[0]}));
				}
				this.gameCreateHand(hand);
				this.displayHand({type:'normal',hand:hand});
				break;
			case 'compare':
				this.runModeCompare();
				break;
			case 'speed':
				console.log('set things up for learn mode');
				break;
			case 'timed':
				hand = Cards.handCreate(Poker.create({main:'random',joker:50,sub:'random'}));
				this.gameCreateHand(hand);
				this.displayHand({type:'normal',hand:hand});
				break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run the learn mode
	///////////////////////////////////////////////////////////////////////////////////////////////////
	runModeLearn:function() {
		if (Casino.game.hand.count < Casino.settings.hands_per_level) {
			var str = Casino.game.level.sub.split('+');
			var chance;
			if (str[1] == 'joker') {
				chance = 100;
			} else {
				chance = 0;
			}
			var hand = Cards.handCreate(Poker.create({main:Casino.game.level.main,joker:chance,sub:str[0]}));
			this.gameCreateHand(hand);
			this.displayHand({type:'normal',hand:hand});

		} else {
			
			// main keys + index
			var main_keys = Object.keys(Paigow.rules);
			var main_index = main_keys.indexOf(Casino.game.level.main);
			// sub keys + index
			var sub_keys = Object.keys(Paigow.rules[Casino.game.level.main]);
			var sub_index = sub_keys.indexOf(Casino.game.level.sub);
			
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
			Casino.game.level.main = main_keys[main_index];
			var sub_keys = Object.keys(Paigow.rules[Casino.game.level.main]);
			Casino.game.level.sub = sub_keys[sub_index];

			Casino.game.toast = true;
			Casino.game.thing.game.state.start('LearnMenu');
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// run the compare mode
	///////////////////////////////////////////////////////////////////////////////////////////////////
	runModeCompare:function(options) {

		Casino.game.deck = Cards.deckCreate('standard',true,1);
		var deck = Casino.game.deck;
		var index = Casino.game.compare.index();
		Casino.game.compare.current = Casino.game.compare.steps[index+1];
		// create an array to hold chosen hair cards
		Casino.game.hair_chosen = [];
		Casino.game.hand.count = 0;
		Casino.game.hand.tries = 0;

		// debug compare so drop random hand into the mix
		if (typeof Casino.debugCompare !== 'undefined') {
			var hand = Cards.handCreate(deck.splice(0,7));
			this.gameCreateHand(hand);
			Casino.game.compare.bank = hand;

			var hand = Cards.handCreate(deck.splice(0,7));
			this.gameCreateHand(hand);
			Casino.game.compare.player = hand;
			index = 2;
		}
		// debug player and bank set, set both
		if (typeof Casino.debugBank !== 'undefined' && typeof Casino.debugPlayer !== 'undefined') {
			var hand = Cards.handCreate(Casino.debugBank);
			this.gameCreateHand(hand);
			Casino.game.compare.bank = hand;

			var hand = Cards.handCreate(Casino.debugPlayer);
			this.gameCreateHand(hand);
			Casino.game.compare.player = hand;

			// go to the third index;
			index = 3;
		}
		switch(index) {
			case 0:
				// create and display the bank hand for setting
				var hand = Cards.handCreate(deck.splice(0,7));
				this.gameCreateHand(hand);
				Casino.game.compare.bank = hand;
				Casino.game.hand_data = hand;
				this.displayHand({type:'normal',hand:hand});
				this.messageBox('show','set the bank hand');
				break;
			case 1:
				// create and display the player hand for setting
				var hand = Cards.handCreate(deck.splice(0,7));
				this.gameCreateHand(hand);
				Casino.game.compare.player = hand;
				// set the hand data for use throughout
				Casino.game.hand_data = hand;
				this.displayHand({type:'normal',hand:hand});
				this.messageBox('show','set the player');
				break;
			case 2:
				// display the player hand
				this.displayHand({type:'houseway',mode:'small',hand:Casino.game.compare.player});
				// display the bank hnd
				this.displayHand({type:'bank',reset:'none',hand:Casino.game.compare.bank});
				// display choice buttons
				this.btnDisplay('win,lose,push');
				break;
			case 3:
				// display both hands with a message
				if (typeof options.choice !== 'undefined') {
					this.displayHand({type:'houseway',mode:'toast',hand:Casino.game.compare.player});
					this.displayHand({type:'bank',mode:'toast',reset:'none',hand:Casino.game.compare.bank});
					this.btnDisplay('next');
					var str = '';
					var result = Paigow.compareHands(Casino.game.compare.player,Casino.game.compare.bank);
					console.log('comparison result...',result);
					if (result == options.choice) {
						str = 'You chose correctly, the hand does indeed '+options.choice;
						Casino.game.hand.correct++;
					} else {
						str = 'You are incorrect, the hand is actually a '+result;
					}
					this.messageBox('show',str);
					Casino.game.hand.total++;
					Casino.game.compare.current = Casino.game.compare.steps[0];
					this.updateText({box:'stat'})
				}
				break;
			default:
				console.log('no step');
				Casino.game.compare.current = Casino.game.compare.steps[0];
				break;
		}
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
		Casino.game.hand_data = hand;
		console.log('\nhand created: ',Casino.game.hand_data);
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
		var hand = Casino.game.hand_data;
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
			// increment the hand count 
			if (!Casino.game.hint) {
				Casino.game.hand.count += 1;
			} else {
				Casino.game.hint = false;
			}
			// reset the tries counter
			Casino.game.hand.tries = 0;
			// display the hand
			Casino.game.thing.displayHand({type:'houseway',hand:hand,chosen:chosen});
			// show the 'next' button
			if (Casino.game.mode != 'learn') {
				Casino.game.thing.btnDisplay('next');
			} else {
				Casino.game.thing.btnDisplay('option,next');
			}
		} else {
			Casino.game.hand.tries += 1;
			this.updateText({box:'stat',str:'default'});
			var txt;
			var main = Casino.game.level.main;
			var sub = Casino.game.level.sub;
			if (Casino.game.hand.tries > 2 && Casino.game.hand.tries <= 5) {
				txt = Paigow.rules[main][sub];
			} else if (Casino.game.hand.tries > 5) {
				Casino.game.hint = true;
				if (Casino.game.mode != 'learn') {
					txt = 'slow down and maybe try the ones that are highlighted';
				} else {
					txt = Paigow.rules[main][sub];
				}
				Casino.game.group_player.forEach(function(btn) {
					if(hair.indexOf(btn.key) != -1)
						btn.outline.visible = true;
				},this);
			} else {
				txt = 'Hair incorrect, try again :(';
			}
			this.messageBox('show',txt);
			// reset the chosen hair cards
			Casino.game.hair_chosen[0].y += 15;
			Casino.game.hair_chosen.splice(0,1); 
			Casino.game.hair_chosen[0].y += 15;
			Casino.game.hair_chosen.splice(0,1);
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// end a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameEnd:function() {
		
		var str = 'Game Over!!!\n';
		if (Casino.game.mode != 'learn') {
			str += 'You got '+Casino.game.hand.count+' hands correct';
			this.btnDisplay('start');
		} else {
			str += 'You have mastered the game of pai-gow, go try some practice hands now!!!';
			Casino.game.mastery = true;
			this.updateText({box:'main',str:'Congrats!!!',rewrite:true});
			this.btnDisplay();
		}
		this.messageBox('show',str);
		this.displayReset();
	},
	/******************************************************************************************************************************************
		DISPLAY FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a card for display
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createCard:function(key,disabled) {
		var card = Casino.game.thing.add.sprite();

		var shadow = Casino.game.thing.add.sprite(-2, -2,'cards',key);
		shadow.scale.setTo(1.025);
		shadow.tint = 0x000000;
		shadow.alpha = 0.8;
		card.addChild(shadow);
		var actual = Casino.game.thing.add.sprite(0,0,'cards',key);
		card.addChild(actual);

		var outline = Casino.game.thing.add.sprite(-3.5, -3.5,'cards',key);
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
			card.events.onInputDown.add(this.gameSelectHair,card);
		}
		return card;
	},
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
					var card = this.createCard(key,display[key].disabled);
					card.key = key;
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
					var card = this.createCard(key,display[key].disabled);
					card.key = key;
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
					var card = this.createCard(key,display[key].disabled);
					card.key = key;
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
