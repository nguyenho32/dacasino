Casino.Game = function(game) {};
Casino.Game.prototype = {
	btn_next:{},
	btnDisplay:function(opt) {
		switch(opt) {
			case 'next':
				this.btn_next.visible = true;
				break;
			default:
				this.btn_next.visible = false;
				this.btn_help.visible = false;
				break;
		}
	},
	// text stuff
	txtMainInfo:function(str,opt) {
		var txt = this.txt_main_info;
		if (opt) {
			txt.text = txt.text+' '+str;
		} else {
			txt.text = str;
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// clock stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	txt_clock:{},
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
	/*
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// update stats
	///////////////////////////////////////////////////////////////////////////////////////////////////
	function fnUpdateStats() {
		var txt = 'stats\n';
		txt += 'hands: '+hand_count+'\n';
		txt += 'tries: '+hand_tries+'\n';
		stat_info_box.text = txt;
	}
	*/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create:function() {
		// holy fuckity fuck!!!
		Casino.game.thing = this;
		// create some display groups
		Casino.game.group_bank = Casino.game.thing.add.group();
		Casino.game.group_player = Casino.game.thing.add.group();
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
		// button to get help
		var btn = this.createButton('help',this.btnHandler);
		this.btn_help = btn;
		btn.key = 'help';
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
		sprite.x = 120;
		sprite.y = 375;
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		// stat information box
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 400 };
		var txt = 'total hands: 0 || tries per hand: ';
		stat_info_box = Casino.game.thing.add.text(5, 5, txt, style);
		sprite.addChild(stat_info_box);

		// clock information box
		var gfx = Casino.game.thing.add.graphics(0,0);
//		gfx.beginFill(0xCC0000,1);
//		gfx.drawRect(630,0,130,25);
//		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'right', wordWrap: true, wordWrapWidth: 160 };
		var txt = 'clock: 00:00:00';
		this.txt_clock = Casino.game.thing.add.text(610, 5, txt, style);
		sprite.addChild(this.txt_clock);

		// group for holding player stuff
		this.group_player = Casino.game.thing.add.group();
		// group for holding bank stuff
		this.group_bank = Casino.game.thing.add.group();

		/*
		// button for showing normal way
		var btn = this.createButton('normal',this.btnDisplayHand);
		btn.key = 'normal';
		btn.x = 200;
		btn.y = 0;
		// button for showing house way
		var btn = this.createButton('houseway',this.btnDisplayHand);
		btn.key = 'houseway';
		btn.x = 350;
		btn.y = 0;
		// button for showing comparison
		var btn = this.createButton('compare',this.btnDisplayHand);
		btn.key = 'compare';
		btn.x = 500;
		btn.y = 0;
		*/
		
		this.initMode(Casino.game.mode);
		this.btnDisplay('hide');
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// button handler
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function (btn) {
		var key = btn.key;
		switch(key) {
			case 'next':
				this.gameCreateHand();
				break;
			case 'start':
				this.gameStart();
				break;
			case 'help':
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
				console.log('modeLearn');
				this.txtMainInfo('- learn how to play pai-gow','a');
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
				this.txtMainInfo('- practice setting random hands','a');
				Casino.game.level.main = 'random';
				Casino.game.level.sub = 'random+random';
				break;
			case 'compare':
				this.txtMainInfo('- practice comparing hands','a');
				break;
			case 'speed':
				console.log('modeSpeed');
				this.txtMainInfo('- take a speed test','a');
				break;
			case 'timed':
				this.txtMainInfo('- how many hands can you read in 30 seconds','a');
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
//				var set = ["king_heart","queen_diamond","nine_spade","seven_spade","six_spade","five_spade","two_spade"];
//				hand = Cards.handCreate(set);
				hand = Cards.handCreate(Poker.create(Casino.game.level.main,chance,str[0]));
			
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
			var txt = 'You chose the correct hair!\n';
			txt += 'rule: '+hand.paigow.rule+'\n';
			txt += 'bonus: '+hand.paigow.bonus+'\n';
			txt += 'desc: '+hand.paigow.desc+'\n'
			// place the cards
			console.log('set the hand houseway');
			this.displayHand({type:'houseway',opt:{hand:hand}});
			Casino.game.thing.btnDisplay('next');
		} else {
			/*
			hand_tries++;
			fnUpdateStats();
			if (hand_tries > 5) {
				var txt = 'slow down & try reading the rule above again!\n';
				txt += '* sometimes straights / flushes sneak into hands they shouldnt *\n';
				txt += '* this is especially a problem with joker hands *';
				txt += '* will be fixed in the next few days *';
				hand_info_box.text = txt;
			} else {
				hand_info_box.text = 'Hair incorrect, try again :(';
			}
			*/
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
		console.log('gameEnd');
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
	/******************************************************************************************************************************************
		DISPLAY FUNCTIONS
	******************************************************************************************************************************************/
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
			case 'both':
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
			console.log('reset');
			this.displayReset('both');
		}
		switch(opts.type) {
			case 'bank':
				this.displayBankHand(opts.opt);
				break;
			case 'houseway':
				this.displayHouseWay(opts.opt);
				break;
			default:
				this.displayNormalWay(opts.opt);
				break;
		}
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
		var card_y = 180;
		var spacer_x = 135;
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i]
			var card = Casino.game.thing.add.sprite(0,0,'cards',key);
			card.key = key;
			card.inputEnabled = true;
			card.input.useHandCursor = true;
			card.events.onInputDown.add(this.gameSelectHair,card);
//			card.events.onInputDown.add(function() {this.gameSelectHair(key)},this);
			if (card) {
				card.x = card_x+i*spacer_x;
				card.y = card_y;
				Casino.game.group_player.add(card);
			}
		}
		/*
		// opt is set means we are doing debug stuff
		if (opt) {
			var n = (!opt.row) ? 0 : opt.row;
			// loop and display the hands
			for (var i=0;i<hand.shuffled.length;i++) {
				var key = hand.shuffled[i]
				var card = Casino.game.thing.add.sprite(0,0,'cards',key);
				card.key = key;
				console.log(key);
				if (card) {
					card.x = HAND_X+i*130;
					card.y = HAND_Y+(200*n);
				}
				group_debug.add(card);
			}
			// add some information for debugging yeah baby!
			// create a text box for game related information
			var sprite = game.add.sprite(0,0);
			var gfx = game.add.graphics(0,0);
			gfx.beginFill(INFO_BG,1);
			gfx.drawRect(0,0,600,175);
			sprite.addChild(gfx);
			var style = { font: '10pt Courier', fill: INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 600 };
			// no pai-gow info, show poker debug
//			var	str = (!hand.paigow) ? hand.poker.debug : hand.paigow.debug;
			// show both debug
			var str = '';
			if (hand.type && hand.opt) {
				str += 'created: '+hand.type+' - '+hand.opt+'\n';
			}
			str += hand.paigow.debug;
			var text = game.add.text(0,0, str, style);	
			sprite.addChild(text);
			group_debug.add(sprite);
			sprite.x = 920;
			sprite.y = HAND_Y+(200*n);
		} else {
			// no options, display normally
			var cards = hand.shuffled;
			for (var i=0;i<hand.original.length;i++) {
				var card = Cards.cardCreate({card:cards[i],clickable:true,callback:gameSelectHair});
				if (card) {
					card.x = HAND_X+i*135;
					card.y = HAND_Y;
				}
				group_cards.add(card);
			}
		}
		*/
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display the hand set correctly
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayHouseWay:function(opts) {
		Casino.game.group_player = Casino.game.thing.add.group();

		var hand = opts.hand;
		if (opts.chosen) {
			var extras = arrayDiff(hand.paigow.hair,opts.chosen);
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
			var card = Casino.game.thing.add.sprite(0,0,'cards',key);
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
			var card = Casino.game.thing.add.sprite(0,0,'cards',key);
			card.scale.setTo(scale,scale);
			card.key = key;
//			card.inputEnabled = true;
//			card.input.useHandCursor = true;
//			card.events.onInputDown.add(Cards.cardClicked,card);
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
		/*
		// create a text box for menu related information
		var sprite = Casino.game.thing.add.sprite(0,0);
		var gfx = Casino.game.thing.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,375,175);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 650 };
		var txt = 'Welcome to Da Casino (alpha 1.0)'
		this.txt_main_info = Casino.game.thing.add.text(0, 0, txt, style);	
		sprite.addChild(this.txt_main_info);
		sprite.x = 275;
		// place the information area
		sprite.y = 40;
		*/
	},
	/******************************************************************************************************************************************
		GENERIC UTILITIES
	******************************************************************************************************************************************/
	/*
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get the difference between 2 arrays
	///////////////////////////////////////////////////////////////////////////////////////////////////
	function arrayDiff(big,small) {
		var diff = [];
		big.forEach(function(key) {
			if (-1 === small.indexOf(key)) {
				diff.push(key);
			}
		},this);
		return diff;
	}
	*/
	
	/******************************************************************************************************************************************
		DEBUG FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create multiple hands of paigow
	///////////////////////////////////////////////////////////////////////////////////////////////////
	debugCreateMultiple:function(sprite,pointer) {
//		fnResetBoard();
		// hide the start / next / example buttons
		/*
		btn_start.visible = false;
		btn_next.visible = false;
		btn_example.visible = false;
		
		// hide the level / compare buttons
		group_buttons_level.visible = false;
		group_buttons_compare.visible = false;
*/

		/*
		// create a shuffled deck for use in our game
		deck = Deck.create('standard',true,1);

		// show the deck
		for (var i=0;i<deck.length;i++) {
			var card = Cards.cardCreate({card:deck[i]});
			group.addChild(card);
			card.x = 5+i*25;
		}
		*/
		// create some hands
		if (!DEBUG_COUNT) {
			DEBUG_COUNT = 25;
		}
		for (var n=0;n<DEBUG_COUNT;n++) {
			// create a specific type of hand
			if (!DEBUG_MAIN) {
				DEBUG_MAIN = 'random';
			}
			if (!DEBUG_SUB) {
				DEBUG_SUB = 'random';
			}
			var hand = Cards.handCreate(Poker.create(DEBUG_MAIN,DEBUG_JOKER,DEBUG_SUB));
			this.txt_main_info.text = 'creating '+DEBUG_COUNT+' '+DEBUG_MAIN+' - '+DEBUG_SUB+' hands';

			//**********************************************************************************************************
			//
			//	This section for hands that are not being set correctly
			//
			//
			/* FIXED
				wheel straight w/ joker
			var set = ["ace_diamond","seven_diamond","six_heart","five_heart","four_spade","two_club","joker_one"];
			*/
			// wheel straights w/joker
			/* FIXED
				not finding the joker high straight? joker,queen,10,9,8...but this would make it 9,8 straight instead of
				pair of 9, queen high straight. So this hand is correct
			var set = ["queen_heart","jack_spade","ten_club","nine_spade","nine_heart","eight_club","joker_one"];
 			*/
			/* FIXED
				reading the 6 high straight twice (due to the pairs)
			var set = ["seven_heart","six_heart","six_club","five_club","four_diamond","two_spade","joker_one"];
			*/
			/* FIXED
				this hand should be pair with a joker high straight
			var set = ["seven_diamond","six_heart","five_heart","four_club","three_diamond","three_club","joker_one"];
			*/
			/* FIXED
				this hand should be pair queen straight
				jack, 10, 9, joker, 7
			var set = ["queen_spade","queen_diamond","jack_club","ten_diamond","nine_heart","seven_heart","joker_one"];
			*/
			/* FIXED
				this hand should be pair king natural straight
			var set = ["king_club","nine_spade","eight_spade","seven_heart","six_diamond","five_club","joker_one"];
			*/
			/* FIXED
				this is broken for some reason
				should be pair queen / natural straight
				hair should contain queen-diamond, queen-heart, joker
			var set = ["queen_club","queen_diamond","jack_heart","ten_club","nine_spade","eight_diamond","joker_one"];
			*/
			/* FIXED
				incorrectly set as 9, 8 - 7 high straight (7,6,5,joker,3)
				should be pair 3 - 9 high natural straight
				bonus of straight not being set
			var set = ["nine_club","eight_diamond","seven_heart","six_club","five_diamond","three_club","joker_one"];
			*/
			/* FIXED
				incorrectly set as jack,nine - 10 high straight
				should be pair / pair 9's & jacks
				bonus of straight not being set
			var set = ["jack_heart","ten_heart","nine_heart","nine_club","eight_club","six_spade","joker_one"];
			*/
			/* FIXED
				this correctly set as pair / pair jacks & queens
				bonus of straight not being set
			var set = ["queen_diamond","jack_club","jack_diamond","ten_club","nine_club","five_heart","joker_one"];
			*/
			/* FIXED
				correctly set as this hand is pair 5, nine high straight
				needs to have the trip 5's in the hair
			var set = ["eight_heart","seven_heart","six_club","five_heart","five_club","five_diamond","joker_one"];
			*/
			/* FIXED
				bugs out 
				should be queen, jack...joker, 9, 8, 7, 6
			var set = ["queen_club", "jack_diamond", "nine_heart", "eight_spade", "seven_club", "six_club", "joker_one"];
			*/
			/* FIXED
				hand is incorrectly set 8,4 - flush
				should be set full house solvePair
			var set = ["ten_diamond","eight_spade","eight_diamond","four_spade","four_diamond","three_diamond","joker_one"];
			*/
			/* FIXED
				hand incorrectly set as 5, 4 - queen high straight flush
				should be queen 5, jack high flush (with straight-flush bonus)
			var set = ["queen_club","jack_club","ten_club","nine_club","eight_club","five_heart","four_club"];
			*/
			/* FIXED
				hand incorrectly set as jack, 6 - pair of 3
				should be pair 3 flush, with a straight-flush bonus
			var set = ["jack_club","six_club","five_club","four_club","three_heart","three_club","two_club"];
			*/
			/* FIXED
				hand correctly set as as pair 9, jack high straight flush
				bonus incorrect as 4 of a kind, should be straight flush
				description reads joker high straight flush
			var set = ["ten_spade","nine_spade","nine_heart","nine_club","eight_spade","seven_spade","joker_one"];
			*/
			/* FIXED
				hand correctly set as pair 6, 6 high straight flush
				need to remove the 6 spade from possible hair
			var set = ["six_spade","six_heart","five_spade","four_spade","three_spade","two_spade","joker_one"];
			*/
			/* FIXED
				hand incorrectly set 10,7 pair of 6
				should be 10, 6 - 7 high straight flush
			var set = ["ten_club","seven_diamond","six_spade","six_diamond","five_diamond","four_diamond","three_diamond"];
			*/
			/* FIXED
				hand correctly set, not setting as straight flush
			var set = ["eight_heart","seven_spade","six_spade","five_spade","five_diamond","four_spade","three_spade"];
			*/
			/* FIXED
				hand correctly set pair king, queen high flush
				bonus straight flush not set
			var set = ["king_club","queen_heart","jack_heart","ten_heart","nine_heart","six_heart","joker_one"];
			*/
			/* FIXED
				hand incorrectly set 7,2 - ace high flush
				should be pair 2 / pair ace (solvePair)
			var set = ["ace_heart","ten_heart","seven_club","four_heart","two_spade","two_heart","joker_one"];
			*/
			/* FIXED
				hand correctly set pair king, quad 2's
				need to put trip kings in the hair
			var set = ["king_spade","king_heart","king_club","two_heart","two_club","two_diamond","joker_one"];
			*/
			/* FIXED
				hand incorrectly set pair six, jack high straight
				should be pair jack, 10 high straight
//			var set = ["jack_diamond","ten_diamond","nine_club","eight_club","seven_diamond","six_club","joker_one"];
			*/
			/* FIXED
				hand set correctly, possible hair not correct
				should be trip queens
			var set = ["queen_heart","queen_club","queen_diamond","two_spade","two_heart","two_club","two_diamond"];
			*/
			/* FIXED
				hand set almost correctly, desc incorrect
				should be ace (joker) high flush
			var set = ["queen_club","nine_heart","nine_club","five_club","three_club","two_club","joker_one"];
			// this is almost the same thing, should put the natural in front with joker based flush behind
			var set = ["ace_spade","ace_heart","jack_spade","seven_spade","five_spade","four_spade","joker_one"];
			*/
			/*
				hand set correctly, hair incorrect
				should be five_diamond, followed by both nines (five is required)
			var set = ["jack_club","ten_club","nine_spade","nine_diamond","eight_heart","seven_heart","five_diamond"];
			*/
			/* FIXED
				hand set incorrectly
				should be pair 8 (natural) with joker based flush behind
			var set = ["king_heart","jack_heart","nine_heart","eight_spade","eight_club","six_heart","joker_one"];
			var set = ["king_heart","jack_heart","nine_heart","eight_diamond","eight_club","six_heart","five_heart"];
			*/
			/* FIXED
				hand set correctly
				should have king and both 9's in the hair
			var set = ["king_club","queen_club","jack_heart","ten_diamond","nine_heart","nine_club","eight_heart"];
			*/
			/* FIXED
				incorrectly set as 7,6 - ace (joker) high flush
				should be pair 3, ten high straight
			var set = ["ten_club","nine_club","eight_club","seven_heart","six_spade","three_club","joker_one"];
			*/
			/* FIXED
				incorrectly set as pair / pair
				should be pair 8, nine high straight (bonus: straight-flush)
			var set = ["nine_diamond","eight_diamond","eight_spade","seven_diamond","six_diamond","five_heart","joker_one"];
			*/
			/* FIXED
				hand set correctly, desc straight-flush not set
			var set = ["king_diamond","seven_spade","six_spade","five_spade","four_spade","three_spade","joker_one"];
			*/
			
			//
			//
			//
			//**********************************************************************************************************
			//
			/*
				hand contains a flush, automatic check in Poker.create() should rebuild the hand until there is no flush
			*/
			var set = ["jack_heart","jack_diamond","ten_heart","ten_diamond","nine_heart","eight_heart","joker_one"];


			//
			//
			//
			//**********************************************************************************************************
			if (typeof set !== 'undefined') {
				var hand = Cards.handCreate(set);
			}
			//
			//
			//
			// solve for poker
//			console.log('hand: ',n,hand);
			hand.poker = Poker.solve(hand.sorted);
//			console.log('hand poker: ',n,hand.poker)
			// solve for pai-gow
			hand.paigow = Paigow.solve(hand.poker);
//			console.log('hand paigow: ',n,hand.paigow);
			// display the hand (debug);
			this.displayNormalWay(hand,{debug:true,row:n});
			
			// break out of the loop if we are setting 1 hand
			if (typeof set !== 'undefined') {
				break;
			}
		}

/*		
		// match the hand to an exist card on the screen so we can move it (do this instead of creating a new one each time)
		var num = 0;
		group.forEach(function(card) {
			if (hand.indexOf(card.key) != -1) {
				card.x = 5+135*num;
				card.y = 200;
				num++;
			}
		},this);
*/
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
