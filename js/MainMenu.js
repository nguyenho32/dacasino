/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
Casino.MainMenu = function(game) {};
Casino.MainMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// common stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:Casino.createButton,
	createCard:Casino.createCard,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		var background = this.add.tileSprite(0,0,1000,500,'bg');
		// active button color
		this.btn_color_active = 0x0000FF;
		// inactive button color
		this.btn_color_inactive = 0xFF0000;
		// available button color
		this.btn_color_available = 0x00FF00;

		this.clock;
		this.clockEvent;
		this.cards = this.add.group();
		var menu = ["reload","learn","practice","compare","speed","timed"];
		// create buttons for the main menu
		var width;
		for (var i=0; i<menu.length; i++) {
//			var btn = this.createButton({name:menu[i],callback:this.btnHandler});
			var btn = this.add.button(750,30+i*40,'buttons',this.btnHandler,this,menu[i]+'_over',menu[i]+'_out',menu[i]+'_down');
			btn.scale.setTo(0.34);
			/*
			btn.x = 750;
			btn.y = 30+i*40;
			// replace 'nothing' to disable a mode
			if (menu[i] == 'nothing') {
				btn.activate('disabled');
			} else if (menu[i] == 'debug') {
				this.btn_debug = btn;
				btn.visible = false;
			} else {
				btn.activate('available');
			}
			*/
		}

		// create a text box for menu related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,375,175);
		sprite.addChild(gfx);
		var style = { font: '11pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 370 };
		var txt = 'Welcome to Da Casino (beta 2.7)\n\n';
		txt += '*** this is a work in progress ***\n';
		txt += 'some of the rules might not make sense they will be rewritten soon\n\n';
		txt += 'select an option from the menu to your right';
		main_info_box = this.add.text(4, 4, txt, style);	
		sprite.addChild(main_info_box);
		sprite.x = 275;
		sprite.y = 30;
		
		// create a text box for hand related
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,325,90);
		sprite.addChild(gfx);
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 325 };
		this.hand_info_box = this.add.text(4, 4, '', style);	
		sprite.addChild(this.hand_info_box);
		sprite.x = 665;
		// place the information area
		sprite.y = 300;

		
		var dbg = this.input.keyboard.addKey(Phaser.Keyboard.D);
		dbg.onDown.add(this.debugMode,this);

		
		this.createHand();
		this.clock = 3;
		this.clockEvent = this.time.events.loop(Phaser.Timer.SECOND,this.updateTimer,this);
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// button handler
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function(pointer) {
		Casino.game.mode = pointer.name;
		switch(Casino.game.mode) {
			case 'debug':
				var settings = {
					hands_per_level:1,
					timer_amount:10,
					min_hint_count:2,
					max_hint_count:5,
				}
				Casino.settings = settings;
				console.log('new settings: ',Casino.settings);
				
				this.game.state.start('Debug');
				break;
			case 'reload':
				this.createHand();
				this.clock = 3;
//				this.game.state.start('Review');
			break;
			case 'learn': this.game.state.start('LevelMenu');
			break;
			default: this.game.state.start('Game');
			break;
		}
	},
	debugMode:function() {
		this.btn_debug.visible = (this.btn_debug.visible) ? false : true;
	},
	updateTimer:function() {
		this.clock -= 1;

		if (this.clock === 0) {
			this.clock = Math.round(Math.random()*(5 - 2) + 2);
			this.createHand();
		}
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createHand:function() {
		var deck = Cards.deckCreate('standard',true,1);
		var hand = Cards.handCreate(deck.splice(0,7));
		hand.poker = Poker.solve(hand.sorted);
		hand.paigow = Paigow.solve(hand.poker);

		this.hand_info_box.text = 'rule: '+hand.paigow.rule+'\nbonus: '+hand.paigow.bonus+'\ndesc: '+hand.paigow.desc
		this.cards.destroy();
		this.cards = this.add.group();
		var display = Display.master({hand:hand});
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			if (typeof display[key] !== 'undefined') {
				var card = this.createCard({key:key,disabled:true});
				card.x = display[key].x;
				card.y = display[key].y;
				this.cards.add(card);
			} else {
				console.log('broken hand: ',hand);
				this.createHand();
				break;
			}
			
		}
	}
};


