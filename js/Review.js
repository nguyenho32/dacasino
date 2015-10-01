/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
Casino.Review = function(game) {};
Casino.Review.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// common stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:Casino.createButton,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		Casino.game.thing = this;
		// the cards
		this.cards = this.add.group();
		
		/*
			top ui elements
		*/
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 0;
		// button for returning to the game
		var btn = this.createButton({name:'return',callback:this.btnHandler});
		btn.x = 890;
		btn.y = 0;

		
		// create a text box for menu related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,500,70);
		sprite.addChild(gfx);
		var style = { font: '11pt Courier', fill: Casino._INFO_TXT, align: 'center', wordWrap: true, wordWrapWidth: 500 };
		var txt = 'Welcome to review mode\n';
		if (Casino.game.mode == 'speed') {
			txt += 'You got '+Casino.game.stat.correct+' out of 6 correct';
		} else {
			txt += 'You got '+Casino.game.stat.correct+' out of '+Casino.game.hands.length+' correct';
		}
		console.log('stats: ',Casino.game.stat);
		main_info_box = this.add.text(250, 4, txt, style);	
		main_info_box.anchor.setTo(0.5,0);
		sprite.addChild(main_info_box);
		sprite.x = Casino._WIDTH / 2 - 500 / 2;
		
		this.viewDefault();
	},
	viewDefault:function() {
		var game = Casino.game;
		
		console.log('hands to review: ',game.hands);
		var hands = game.hands;

		var display = Display.iconify({hands:hands});
		console.log('display: ',display);
		for (var i=0; i<hands.length; i++) {
			var hand = hands[i];
			var key = hand.shuffled[0];
			var card;
			if (game.mode == 'speed' && i == 0) {
				card = this.createCard({key:key,disabled:true});
//				var card = new Card(this.game,display[key].x,display[key].y,key);
			} else {
				card = this.createCard({key:key,callback:this.viewHand});
//				var card = new Card(this.game,display[key].x,display[key].y,key);
			}
			if (hand.hair_correct) {
				card.activate('right');
			} else {
				card.activate('wrong');
			}
			card.uid = i;
			card.scale.setTo(display[i].scale);
			if (game.mode == 'speed' && i > 0) {
				spacer = 400;
			} else {
				spacer = 0;
			}
			card.x = display[i].x+spacer;
			card.y = display[i].y;
		}
		
		// if speed mode then show the bank hand under the icon
		if (game.mode == 'speed') {
			console.log('speed mode display bank hand');
			var hand = hands[0];
			var display = Display.bank({mode:'review',hand:hand});
			console.log('- hand: ',hand);
			console.log('- display: ',display);
			for (var i=0; i<hand.sorted.length; i++) {
				var key = hand.sorted[i];
				var card = new Card(this.game,display[key].x,display[key].y,key);

				card.scale.setTo(display[key].scale);
			}
		}

		Casino.game = game;
	},
	viewHand:function() {
		var thing = Casino.game.thing;
		thing.cards.destroy();
		thing.cards = thing.add.group();
		var game = Casino.game;
		console.log('viewing hand...',game.hands[this.uid]);
		var hand = game.hands[this.uid];

		var display;
		if (Casino.game.mode != 'speed') {
			display = Display.houseway({hand:hand,mode:'review',chosen:hand.hair_chosen});
		} else { 
			display = Display.houseway({hand:hand,mode:'review-full',chosen:hand.hair_chosen});
		}
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			var card = new Card(this.game,display[key].x,display[key].y,key);
			card.scale.setTo(display[key].scale);
			thing.cards.add(card);
		}

		
		Casino.game = game;
	},
	btnHandler:function(btn) {
		switch(btn.name) {
			case 'return':
				console.log('return to the game');
				break;
			default: this.state.start('MainMenu');
				break;
		}
	},
	/*
		console.log('gameEnd all hands: ',Casino.game.hands);
		var game = Casino.game;
		var str = 'Game Over!!!\n';
		switch(game.mode) {
			case 'learn':
				str += 'You have mastered the game of pai-gow, go try some practice hands now!!!';
				Casino.game.mastery = true;
				this.updateText({box:'main',str:'Congrats!!!',rewrite:true});
				this.btnDisplay();
				break;
			case 'speed':
				var total = 0;
				for (var i=0; i<game.hands.length; i++) {
					if (game.hands[i].correct) {
						total++;
					}
				}
				str += 'You got '+total+' correct out of 6 in '+this.clock;
				this.btnDisplay('start');
				break;
			default:
				str += 'You got '+Casino.game.stat.count+' hands correct';
				this.btnDisplay('start');
				break;
		}
		this.messageBox('show',str);
		this.displayReset();
	*/
}