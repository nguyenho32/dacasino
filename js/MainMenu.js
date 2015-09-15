Casino.MainMenu = function(game) {};
Casino.MainMenu.prototype = {
	updateTimer:function() {
		this.clock -= 1;

		if (this.clock === 0) {
			this.clock = Math.round(Math.random()*(5 - 2) + 2);
			this.createHand();
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		this.clock;
		this.clockEvent;
		this.cards = this.add.group();
		// create buttons for the main menu
		var menu = ["info","learn","practice","compare","speed","timed","debug"];
		var sprite = this.add.sprite(0,0);
		var width;
		for (var i=0; i<menu.length; i++) {
			var btn = this.createButton(menu[i],this.btnHandler);
			btn.key = menu[i];
			btn.x = 750;
			btn.y = 40+i*50;
			sprite.addChild(btn);
			if (menu[i] == 'debug') {
				this.btn_debug = btn;
				btn.visible = false;
			}
		}

		// create a text box for menu related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,375,175);
		sprite.addChild(gfx);
		var style = { font: '11pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 370 };
		var txt = 'Welcome to Da Casino (beta 2.0)\n\n';
		txt += '*** this is a work in progress ***\n';
		txt += 'some of the rules might not make sense they will be rewritten soon\n\n';
		txt += 'select an option from the menu to your right';
		main_info_box = this.add.text(4, 4, txt, style);	
		sprite.addChild(main_info_box);
		sprite.x = 275;
		// place the information area
		sprite.y = 30;
		
		var dbg = this.input.keyboard.addKey(Phaser.Keyboard.D);
		dbg.onDown.add(this.debugMode,this);

		
		this.createHand();

		this.clock = 3;
		this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.updateTimer,this);
	},
	debugMode:function() {
		this.btn_debug.visible = (this.btn_debug.visible) ? false : true;
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
		var text = this.add.text(113/2, 4, txt, style);	
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
//		this.displayHand(hand);
		this.cards.destroy();
		this.cards = this.add.group();
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			var card = this.createCard(key);
			card.key = key;
			this.cards.add(card);
		}
		Display.master(this.cards,{hand:hand});
//		console.log('displaying...',hand);
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
	// button handler
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function(pointer) {
		Casino.game.mode = pointer.key;
		switch(Casino.game.mode) {
			case 'debug': this.game.state.start('Debug');
			break;
			case 'info': this.createHand();
			break;
			case 'learn': this.game.state.start('LearnMenu');
			break;
			default: this.game.state.start('Game');
			break;
		}
	}
};


