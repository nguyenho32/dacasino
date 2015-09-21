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
	createCard:Casino.createCard,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		Casino.game.thing = this;
		console.log('debug mode');
		
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
		// button for showing the default view for this state
		this.btn_back = this.createButton({name:'back',callback:this.btnHandler});
		this.btn_back.x = 0;
		this.btn_back.y = 375;
		this.btn_back.visible = false;

		
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
		var hands = [];
		for (var i=0; i<game.hands.length; i++) {
			if (game.hands[i].set) {
				hands.push(game.hands[i]);
			}
		}
		console.log('hands: ',hands);
		
		var display = Display.iconify({hands:hands});
		console.log('display: ',display);
		
		for (var i=0; i<hands.length; i++) {
			var hand = hands[i];
			var key = hand.shuffled[0];
			var card = this.createCard({key:key,callback:this.viewHand});
			if (hand.hair_correct) {
				card.activate('right');
			} else {
				card.activate('wrong');
			}
			card.uid = i;
			card.scale.setTo(display[i].scale);
			card.x = display[i].x;
			card.y = display[i].y;
		}

		Casino.game = game;
	},
	viewHand:function() {
		var thing = Casino.game.thing;
		thing.btn_back.visible = true;
		thing.cards.destroy();
		thing.cards = thing.add.group();
		var game = Casino.game;
		console.log('viewing hand...',game.hands[this.uid]);
		var hand = game.hands[this.uid];

		var display = Display.houseway({hand:hand,mode:'review',chosen:hand.hair_chosen});
		console.log(display);
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			var card = thing.createCard({key:key,disabled:true});
			card.scale.setTo(display[key].scale);
			card.x = display[key].x;
			card.y = display[key].y;
			thing.cards.add(card);
		}

		
		Casino.game = game;
	},
	btnHandler:function(btn) {
		switch(btn.name) {
			case 'return':
				console.log('return to the game');
				break;
			case 'back':
				btn.visible = false;
				this.viewDefault();
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