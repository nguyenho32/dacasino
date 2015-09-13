Casino.Game = function(game) {};
Casino.Game.prototype = {
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
	btnDisplay:function(opt) {
		switch(opt) {
			case 'option':
				this.btn_option.visible = true;
				break;
			case 'next':
				this.btn_next.visible = true;
				break;
			default:
				this.btn_next.visible = false;
				this.btn_option.visible = false;
				break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// update a text box
	///////////////////////////////////////////////////////////////////////////////////////////////////
	updateText:function(opts) {
		var str;
		var txt;
		switch(opts.box) {
			case 'main':
				var str = opts.str;
				txt = this.txt_main_info;
				break;
			case 'stat':
				str = 'hands: '+Casino.game.hand.count;
				str += ' - tries: '+Casino.game.hand.tries;
				txt = Casino.game.thing.txt_stat_info;
				opts.rewrite = true;
				break;
		}
		if (!opts.rewrite) {
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
			reset = 30;
		} else {
			this.clock += 1;
			finish = 30;
			reset = 0;
		}
		if (this.clock === finish) {
			this.clock = reset;
			this.txt_clock.text = "done"
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
		/*
			top ui elements
		*/
		// button for returning to the menu
		var btn = this.createButton('menu',this.mainMenu);
		btn.key = 'menu';
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton('start',this.btnHandler);
		this.btn_start = btn;
		btn.key = 'start';
		btn.x = 890;
		btn.y = 0;
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
		var btn = this.createButton('option',this.btnHandler);
		this.btn_option = btn;
		btn.key = 'option';
		btn.x = 0;
		btn.y = 375;
		// button for getting the next hand
		var btn = this.createButton('next',this.btnHandler);
		this.btn_next = btn;
		btn.key = 'next';
		btn.x = 890;
		btn.y = 375;
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
		
		this.initMode(Casino.game.mode);
		this.btnDisplay('hide');
		this.btnDisplay('option');
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// button handler
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function (btn) {
		var key = btn.key;
		switch(key) {
			case 'next':
				this.btnDisplay();
				this.gameCreateHand();
				break;
			case 'start':
				this.gameStart();
				break;
			case 'option':
				if (Casino.game.mode == 'learn') {
					this.game.state.start('LearnMenu');
				}
				break;
			default:
				console.log('btnHandler broke: ',key);
			break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton: function(txt,callback,arg) {
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,1);
		gfx.drawRect(0,0,113,25);
		gfx.name = 'graphic';
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: 100 };
		var text = Casino.game.thing.add.text(50, 4, txt, style);	
		text.anchor.setTo(0.5,0);
		text.inputEnabled = true;
		sprite.addChild(text);
		sprite.inputEnabled = true;
		sprite.input.useHandCursor = true;
		sprite.events.onInputDown.add(callback,this,arg);
		
		return sprite;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createHand:function() {
		var deck = Cards.deckCreate('standard',true,1);
		var hand = Cards.handCreate(deck.splice(0,7));
		hand.poker = Poker.solve(hand.sorted);
		hand.paigow = Paigow.solve(hand.poker);
		return hand;
	},
	/******************************************************************************************************************************************
		MAIN MENU STUFF
	******************************************************************************************************************************************/
	initMode:function (init) {
		// all ui elements created now initialize the game
		switch(Casino.game.mode) {
			case 'learn':
				this.updateText({box:'main',str:'- learn how to play pai-gow       (click start to continue)   --->'});
				
				/*
				// clear any cards / timers etc
				fnResetBoard();
				if (game_learn_main_level == 'mastered') {
					var txt = 'You have already mastered the game of pai-gow\n';
					txt += 'Select another option from above to continue your mastery';
					game_info_box.text = txt;
					return;
				}
				// show the learn group
				group_buttons_level.visible = true;
				// hide the start / next / example buttons
				btn_start.visible = false;
				btn_next.visible = false;
				btn_example.visible = false;
				// set the game mode
				game_mode = 'learn';
				// set the main level
				if (!game_learn_main_level) {
					game_learn_main_level = 'pai-gow';
				}
				// set the sub level
				if (!game_learn_sub_level) {
					game_learn_sub_level = 'nothing';
				}

				// main keys + index
				var main_keys = Object.keys(Paigow.rules);
				var main_index = main_keys.indexOf(game_learn_main_level);
				// sub keys + index
				var sub_keys = Object.keys(Paigow.rules[game_learn_main_level]);
				var sub_index = sub_keys.indexOf(game_learn_sub_level);

				group_buttons_level.visible = true;
				group_buttons_level.forEach(function(btn) {
					btn.visible = false;
					// this buttons key is the same or less than the main index
					if (main_keys.indexOf(btn.main_key) <= main_index) {
						// button has no sub key then show it
						if (!btn.sub_key) {
							btn.visible = true;
						}
						// this buttons sub key is the same or less than sub index
						if (sub_keys.indexOf(btn.sub_key) <= sub_index) {
							btn.visible = true;
						}
					}
				},this);

				// set the message
				this.txt_main_info.text = 'learn how to play pai-gow';
				// give some helpful info
				var txt = 'click the \''+game_learn_sub_level+'\' button in the \''+game_learn_main_level+'\' row on your right to begin\n';
				txt += 'once the game begins, click the \'start\' button to start setting hands\n';
				txt += 'click the \'example\' button if you get stuck\n';
				game_info_box.text = txt;
				hand_info_box.text = 'progress to next level after 10 hands';
				*/
				break;
			case 'practice':
				this.updateText({box:'main',str:'- practice setting hands       (click start to continue)   --->'});
				Casino.game.level.main = 'random';
				Casino.game.level.sub = 'random+random';
				break;
			case 'compare':
				this.updateText({box:'main',str:'- practice comparing hands      (click start to continue)   --->'});
				break;
			case 'speed':
				console.log('modeSpeed');
				this.updateText({box:'main',str:'- do a speed test                 (click start to continue)   --->'});
				break;
			case 'timed':
				this.updateText({box:'main',str:'- as many hands in 30 seconds       (click start to continue) --->'});
				// hide the next button
				this.btn_next.visible = false;
				break;
			case 'debug':
				this.debugCreateMultiple();
				break;
		}
	},
	/******************************************************************************************************************************************
		GAME RELATED FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// start a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameStart:function() {
		this.displayReset();
		
		// reset the stats
		Casino.game.hand.count = 0;
		Casino.game.hand.tries = 0;
		
		switch(Casino.game.mode) {
			case 'learn':
				console.log('set things up for learn mode');
				break;
			case 'practice':
				this.gameCreateHand();
				break;
			case 'compare':
				this.gameCompareHands();
				break;
			case 'speed':
				console.log('set things up for learn mode');
				break;
			case 'timed':
				this.clock = 30;
				this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.updateClock,this,'down');
				this.gameCreateHand();
				break;
		}
	},
	/*
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// select a level
	///////////////////////////////////////////////////////////////////////////////////////////////////
	function fnLevelSelect(btn) {
		// learn mode mastered then return
		if (game_learn_main_level == 'mastered') {
			return;
		}
		// practice mode so set up so it works right
		if (game_mode == 'practice') {
			if (btn.sub_key) {
				game_practice_main_level = btn.main_key;
				game_practice_sub_level = btn.sub_key
				// show the 'start' button
				btn_start.visible = true;
				// hide the 'next' button
				btn_next.visible = false;
				// hide the 'example' button
				btn_example.visible = false;
				// show the rule for this level
				game_info_box.text = 'Creating hands of type: '+game_practice_main_level+' - '+game_practice_sub_level;
			}
		}
		if (game_mode == 'learn') {
			// only do something if a sub button was clicked
			if(btn.sub_key) {
				game_learn_main_level = btn.main_key;
				game_learn_sub_level = btn.sub_key;
				// reset the hand count
				hand_count = 0;
				// show the 'start' button
				btn_start.visible = true;
				// hide the 'next' button
				btn_next.visible = false;
				// show the 'example' button
				btn_example.visible = true;
				// show the rule for this level
				game_info_box.text = Paigow.rules[game_learn_main_level][game_learn_sub_level];
			}
		}
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// show an example hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	function fnShowExample() {
		fnResetBoard();
		game_info_box.text = Paigow.rules[game_learn_main_level][game_learn_sub_level];
		var str = game_learn_sub_level.split('+');
		var chance;
		if (str[1] == 'joker') {
			chance = 100;
		} else {
			chance = 0;
		}
		hand = Cards.handCreate(Poker.create(game_learn_main_level,chance,str[0]));

		// solve for poker
		hand.poker = Poker.solve(hand.sorted);
		// solve for pai-gow
		hand.paigow = Paigow.solve(hand.poker);
		// loop and display the hands
		var cards = hand.shuffled;
		for (var i=0;i<hand.original.length;i++) {
			var card = Cards.cardCreate({card:cards[i],clickable:false});
			if (card) {
				card.x = HAND_X+i*135;
				card.y = HAND_Y;
			}
			group_cards.add(card);
		}
		hand_info_box.text = 'hand becomes '+hand.paigow.desc+'\nclick the '+game_learn_sub_level+' button to try again';
		fnDisplayHouseWay(hand);
	}
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// progress a level
	///////////////////////////////////////////////////////////////////////////////////////////////////
	function fnLevelProgress() {
		fnResetBoard();

		game_level_complete = false;

		// main keys + index
		var main_keys = Object.keys(Paigow.rules);
		var main_index = main_keys.indexOf(game_learn_main_level);
		// sub keys + index
		var sub_keys = Object.keys(Paigow.rules[game_learn_main_level]);
		var sub_index = sub_keys.indexOf(game_learn_sub_level);
		
		// first increase sub_index by 1
		sub_index += 1;
		// sub_index over sub_key length, then increase main_index and reset sub index
		if (sub_index >= sub_keys.length) {
			main_index += 1;
			sub_index = 0;
		}
		// if main_index over length, end the game
		if (main_index >= main_keys.length) {
			fnGameOver();
			return;
		}
		// set new level stuff
		game_learn_main_level = main_keys[main_index];
		var sub_keys = Object.keys(Paigow.rules[game_learn_main_level]);
		game_learn_sub_level = sub_keys[sub_index];

		// show the proper buttons
		group_buttons_level.forEach(function(btn) {
			if (btn.main_key == game_learn_main_level && !btn.sub_key) {
				btn.visible = true;
			}
			if (btn.main_key == game_learn_main_level && btn.sub_key == game_learn_sub_level) {
				btn.visible = true;
			}
		},this);
		game_info_box.text = 'Congratultions you passed that level!\nClick the '+game_learn_sub_level+' button to continue';
	}
	*/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// compare 2 hands?
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameCompareHands:function() {
		// create a deck
		var deck = Cards.deckCreate('standard',true,1);

		// first show the hand normally

		// hand set then show the next hand
		
		// this hand set now show both hands
		var hand = Cards.handCreate(deck.splice(0,7));
		hand.poker = Poker.solve(hand.sorted);
		hand.paigow = Paigow.solve(hand.poker);
		this.displayHand({type:'houseway',opt:{mode:'small',hand:hand}});

		var hand = Cards.handCreate(deck.splice(0,7));
		hand.poker = Poker.solve(hand.sorted);
		hand.paigow = Paigow.solve(hand.poker);
		this.displayHand({type:'bank',reset:'none',opt:{hand:hand}});

	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create and display a hand of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	gameCreateHand:function() {
		var type = 'random'

		var hand;
		switch(Casino.game.mode) {
			case 'learn':
				var str = game_learn_sub_level.split('+');
				var chance;
				if (str[1] == 'joker') {
					chance = 100;
				} else {
					chance = 0;
				}
				hand = Cards.handCreate(Poker.create(game_learn_main_level,chance,str[0]));
				break;
			case 'practice':
				var str = Casino.game.level.sub.split('+');
				var chance;
				if (str[1] == 'joker') {
					chance = 100;
				} else {
					chance = 0;
				}
				if (str[1] == 'random') {
					chance = Math.random()*100;
				}
				// a specific hand to play with
				// display broken
				var set = ["queen_club","queen_diamond","queen_heart","queen_spade","seven_club","seven_spade","joker_one"];
				hand = Cards.handCreate(set);
//				hand = Cards.handCreate(Poker.create(Casino.game.level.main,chance,str[0]));
			
				break;
			case 'timed':
				hand = Cards.handCreate(Poker.create('random',50,'random'));
				break;
			default:
				var type = 'random'
				hand = Cards.handCreate(Poker.create('random',50,'random'));
				break;
		}
		// create an array to hold chosen hair cards
		Casino.game.hair_chosen = [];
		// solve for poker
		hand.poker = Poker.solve(hand.sorted);
		// solve for pai-gow
		hand.paigow = Paigow.solve(hand.poker);
		// set the hand data
		Casino.game.hand_data = hand;
		// display the hand
		Casino.game.thing.displayHand({type:'normal',opt:{hand:hand}});
		// increment the hand count 
		Casino.game.hand.count += 1;
		// reset the tries counter
		Casino.game.hand.tries = 0;
		this.updateText({box:'stat',str:'default'});
		console.log('\nhand created: ',hand);
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
			// place the cards
			this.displayHand({type:'houseway',opt:{hand:hand,chosen:chosen}});
			// show the 'next' button
			Casino.game.thing.btnDisplay('next');
		} else {
			Casino.game.hand.tries += 1;
			this.updateText({box:'stat',str:'default'});
			var txt;
			if (Casino.game.hand.tries > 5) {
				txt = 'slow down & try reading the rule above again!';
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
		str += 'You got '+Casino.game.hand.count+' hands correct';
		this.messageBox('show',str);
		/*
		btn_next.visible = false;
		group_cards.destroy();
		
		// learn mode then display grats and return
		if (game_mode == 'learn') {
			btn_example.visible = false;
			game_learn_main_level = 'mastered';
			game_info_box.text = 'Congratulations you have mastered the game of pai-gow!';
			hand_info_box.text = 'Wooooo!!!';
			return;
		}
		var txt = 'Game Over!!!\n';
		if (game_mode == 'timed') {
			txt += 'You got '+hand_count+' hands correct!\n\n';
		}
		txt += 'Click start to go again!';
		game_info_box.text = txt;
		hand_info_box.text = '';
		btn_start.visible = true;
		*/
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
				Casino.game.group_player.destroy();
				Casino.game.group_bank.destroy();
				break;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayHand:function(opts){
		// reset the player and bank groups
		if (opts.reset !== 'none') {
			this.displayReset();
		}
		switch(opts.type) {
			case 'bank':
				this.messageBox('hide');
				this.displayBankHand(opts.opt);
				break;
			case 'houseway':
				this.messageBox('hide');
				this.displayHouseWay(opts.opt);
				break;
			default:
				this.messageBox('show','default');
				this.displayNormalWay(opts.opt);
				break;
		}
	},
	createCard:function(key) {
		var that = Casino.game.thing;
		var card = that.add.sprite();
		var shadow = that.add.sprite(-1, -2,'cards',key);
		shadow.scale.setTo(1.025);
		shadow.tint = 0x000000;
		shadow.alpha = 0.8;
		card.addChild(shadow);
		var actual = that.add.sprite(0,0,'cards',key);
		card.addChild(actual);
		return card;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to disply the hand normally
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayNormalWay:function(opts){
		// create the 'player' layout
		Casino.game.group_player = Casino.game.thing.add.group();

		var hand = opts.hand;
		var cards = hand.shuffled;
		var card_x = 30;
		var card_y = 190;
		var spacer_x = 135;
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i]
			var card = that.prototype.createCard(key);
			card.key = key;
			card.inputEnabled = true;
			card.input.useHandCursor = true;
			card.events.onInputDown.add(this.gameSelectHair,card);
			if (card) {
				card.x = card_x+i*spacer_x;
				card.y = card_y;
				Casino.game.group_player.add(card);
			}
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display the hand set correctly
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayHouseWay:function(opts) {
		Casino.game.group_player = Casino.game.thing.add.group();

		var hand = opts.hand;
		if (opts.chosen) {
			var extras = this.arrayDiff(hand.paigow.hair,opts.chosen);
		}
		var hair = (!opts.chosen) ? hand.paigow.hair : opts.chosen;
		// if 1st hair is joker then reverse
		if (Cards.isJoker(hair[0])) {
			hair.reverse();
		}
		// if 1st hair is lower than 2nd (due to selected)
		if (Cards.getRank(hair[0]) < Cards.getRank(hair[1])) {
			hair.reverse();
		}
		// setup the back
		var back;
		// default back comes from paigow data
		if (!opts.chosen) {
			back = hand.paigow.back;
		} else {
			back = hand.paigow.back;
			// hair length is 3 so we might need to replace something in the back
			if (hand.paigow.hair.length > 2) {
				// hair bigger than 2 always means pair / trip / quad / joker so use the first hair card
				var name;
				if (Cards.getName(hair[0]) == Cards.getName(hair[1])) {
					name = Cards.getName(hair[0]);
				} else {
					name = Cards.getName(hair[1]);
				}
				// find the position of the card to replace
				for (var i=0; i<back.length;i++) {
					if (Cards.getName(back[i]) == name) {
						if (extras.length > 0) {
							back[i] = extras[0];
							extras.splice(0,1);
						}
					}
				}
			}
		}
		if (opts.mode != 'small') {
			var scale = 0.90;
			var hand_x = 5;
			var hand_y = 50;
			var space_x = 115;
			var space_y = 160;
		} else {
			var scale = 0.7;
			var hand_x = 5;
			var hand_y = 75;
			var space_x = 90;
			var space_y = 130;
		}
		var cards = hand.shuffled;
		// finally create the actual cards for display
		for (var i=0;i<cards.length;i++) {
			var key = cards[i]
			var card = that.prototype.createCard(key);
			card.scale.setTo(scale,scale);
			card.key = key;
			if (card.key == hair[0]) {
				card.x = hand_x;
				card.y = hand_y;
			}
			if (card.key == hair[1]) {
				card.x = hand_x+space_x*1;
				card.y = hand_y;
			}
			if (card.key == back[0]) {
				card.x = hand_x;
				card.y = hand_y+space_y;
			}
			if (card.key == back[1]) {
				card.x = hand_x+space_x*1;
				card.y = hand_y+space_y;
			}
			if (card.key == back[2]) {
				card.x = hand_x+space_x*2;
				card.y = hand_y+space_y;
			}
			if (card.key == back[3]) {
				card.x = hand_x+space_x*3;
				card.y = hand_y+space_y;
			}
			if (card.key == back[4]) {
				card.x = hand_x+space_x*4;
				card.y = hand_y+space_y;
			}
			Casino.game.group_player.add(card);
		}
		// create a text box for hand related information
		var sprite = Casino.game.thing.add.sprite(0,0);
		sprite.x = hand_x+space_x*2;
		sprite.y = hand_y;
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,space_x*3-5,space_y-5);
		sprite.addChild(gfx);
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: space_x*3-5 };
		var txt = 'rule: '+hand.paigow.rule+'\n';
		txt += 'bonus: '+hand.paigow.bonus+'\n';
		txt += 'desc: '+hand.paigow.desc+'\n'
		var text = Casino.game.thing.add.text(0,0, txt, style);	
		sprite.addChild(text);
		Casino.game.group_player.add(sprite);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display the bank hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayBankHand:function(opts) {
		Casino.game.group_bank = Casino.game.thing.add.group();

		var hand = opts.hand;
		var scale = 0.7;
		var hand_x = 545;
		var hand_y = 75;
		var space_x = 90;
		var space_y = 130;
		var hair = hand.paigow.hair;
		var back = hand.paigow.back;;
		var cards = hand.sorted;
		for (var i=0;i<hand.original.length;i++) {
			var key = hand.original[i]
			var card = that.prototype.createCard(key);
			card.scale.setTo(scale,scale);
			card.key = key;
			if (card.key == hair[0]) {
				card.x = hand_x;
				card.y = hand_y;
			}
			if (card.key == hair[1]) {
				card.x = hand_x+space_x*1;
				card.y = hand_y;
			}
			if (card.key == back[0]) {
				card.x = hand_x;
				card.y = hand_y+space_y;
			}
			if (card.key == back[1]) {
				card.x = hand_x+space_x*1;
				card.y = hand_y+space_y;
			}
			if (card.key == back[2]) {
				card.x = hand_x+space_x*2;
				card.y = hand_y+space_y;
			}
			if (card.key == back[3]) {
				card.x = hand_x+space_x*3;
				card.y = hand_y+space_y;
			}
			if (card.key == back[4]) {
				card.x = hand_x+space_x*4;
				card.y = hand_y+space_y;
			}
			Casino.game.group_bank.add(card);
		}
		// create a text box for hand related information
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,space_x*3-5,space_y-5);
		sprite.addChild(gfx);
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: space_x*3-5 };
		var txt = 'bank hand:\n';
		txt += 'rule: '+hand.paigow.rule+'\n';
		txt += 'bonus: '+hand.paigow.bonus+'\n';
		txt += 'desc: '+hand.paigow.desc+'\n'
		var text = Casino.game.thing.add.text(0,0, txt, style);	
		sprite.addChild(text);
		Casino.game.group_player.add(sprite);
		sprite.x = hand_x+space_x*2;
		sprite.y = hand_y;

		// create a text box for menu related information
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu
	///////////////////////////////////////////////////////////////////////////////////////////////////
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// start a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	mainMenu: function(pointer) {
		this.game.state.start('MainMenu');
	}
};
that = Casino.Game;
