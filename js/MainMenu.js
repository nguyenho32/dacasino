Casino.MainMenu = function(game) {};
Casino.MainMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		// create buttons for the main menu
		var menu = ["info","learn","practice","compare","speed","timed","debug"];
		var sprite = this.add.sprite(0,0);
		var width;
		for (var i=0; i<menu.length; i++) {
			var btn = this.createButton(menu[i],this.startGame);
			btn.key = menu[i];
			btn.x = 0 + i*115;
			btn.y = 0;
//			console.log(btn.key,btn.x);
			sprite.addChild(btn);
		}
//		console.log(Casino._WIDTH / 2);
//		console.log(sprite.getChildAt(0));
//		sprite.x = (Casino._WIDTH / 2) - (menu.length*113 / 2);
		
		// create a text box for menu related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,375,175);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 650 };
		var txt = 'Welcome to Da Casino (alpha 1.0)'
		main_info_box = this.add.text(0, 0, txt, style);	
		sprite.addChild(main_info_box);
		sprite.x = 275;
		// place the information area
		sprite.y = 40;
		
		this.createHand();
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a button
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton: function(txt,callback,arg) {
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._BTN_BG,1);
		gfx.drawRect(0,0,113,25);
		gfx.name = 'graphic';
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._BTN_TXT, align: 'center', wordWrap: true, wordWrapWidth: 100 };
		var text = this.add.text(50, 4, txt, style);	
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
		this.displayHand(hand);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	displayHand:function(hand) {

		var BANK_Y = 40;
		var spacer = 190;
		var hair = hand.paigow.hair;
		var back = hand.paigow.back;;
		var cards = hand.sorted;
		for (var i=0;i<hand.original.length;i++) {
			var key = hand.original[i]
			var card = this.add.sprite(0,0,'cards',key);
			card.key = key;
//			card.inputEnabled = true;
//			card.input.useHandCursor = true;
//			card.events.onInputDown.add(Cards.cardClicked,card);
			if (card.key == hair[0]) {
				card.x = 10;
				card.y = BANK_Y;
			}
			if (card.key == hair[1]) {
				card.x = 140;
				card.y = BANK_Y;
			}
			if (card.key == back[0]) {
				card.x = 10;
				card.y = BANK_Y+spacer;
			}
			if (card.key == back[1]) {
				card.x = 140;
				card.y = BANK_Y+spacer;
			}
			if (card.key == back[2]) {
				card.x = 270;
				card.y = BANK_Y+spacer;
			}
			if (card.key == back[3]) {
				card.x = 400;
				card.y = BANK_Y+spacer;
			}
			if (card.key == back[4]) {
				card.x = 530;
				card.y = BANK_Y+spacer;
			}
//			group_cards.add(card);
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// start a game
	///////////////////////////////////////////////////////////////////////////////////////////////////
	startGame: function(pointer) {
		console.log('MainMenu.startGame(): ',pointer.key);
		this.game.state.start('Game');
	}
};


