Casino.Game = function(game) {};
Casino.Game.prototype = {
	create:function() {
		// button for returning to the menu
		var btn = this.createButton('menu',this.mainMenu);
		btn.key = 'menu';
		btn.x = 0;
		btn.y = 0;
		// create a text box for game related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,650,200);
		sprite.addChild(gfx);
		// main information box
		/*
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(0x0000CC,1);
		gfx.drawRect(0,0,550,25);
		sprite.addChild(gfx);
		*/
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = 'Welcome to Da Casino (alpha 1.0)'
		main_info_box = this.add.text(0, 0, txt, style);	
		sprite.addChild(main_info_box);
		// game information box (show rules and stuff)
		/*
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(0x00CCCC,1);
		gfx.drawRect(0,25,550,90);
		sprite.addChild(gfx);
		*/
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 550 };
		var txt = 'Click a button above to begin'
		game_info_box = this.add.text(0, 25, txt, style);	
		sprite.addChild(game_info_box);
		// hand information box
		/*
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(0x00CC00,1);
		gfx.drawRect(0,120,550,80);
		sprite.addChild(gfx);
		*/
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 550 };
		var txt = '\nrule:\nbonus:\ndesc:';
		hand_info_box = this.add.text(0,120, txt, style);
		sprite.addChild(hand_info_box);
		// clock information box
		/*
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(0xCC0000,1);
		gfx.drawRect(550,0,100,70);
		sprite.addChild(gfx);
		*/
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'center', wordWrap: true, wordWrapWidth: 100 };
		var txt = 'clock'
		clock_info_box = this.add.text(600, 0, txt, style);
		clock_info_box.anchor.setTo(0.5,0);
		sprite.addChild(clock_info_box);
		// stat information box
		/*
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(0xCC00CC,1);
		gfx.drawRect(550,70,100,130);
		sprite.addChild(gfx);
		*/
		var style = { font: '10pt Courier', fill: Casino._INFO_TXT, align: 'center', wordWrap: true, wordWrapWidth: 100 };
		var txt = 'stats'
		stat_info_box = this.add.text(600, 70, txt, style);
		stat_info_box.anchor.setTo(0.5,0);
		sprite.addChild(stat_info_box);
		// place the information area
		sprite.x = 10;
		sprite.y = 40;
	},
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
	mainMenu() {
		this.game.state.start('MainMenu');
		
	}
};

		/*
			create some groups
		// group containing cards only
		group_cards = game.add.group();
		// group containing the learn buttons
		group_buttons_level = game.add.group();
		// group containing the compare buttons
		group_buttons_compare = game.add.group();
		// group containing the debug stuff
		group_debug = game.add.group();
		*/

				/*
		// start the selected game
		btn_start = this.createButton('start',this.startGame);
		btn_start.x = 10;
		btn_start.y = 250;
		btn_start.visible = false;
		// next hand in the series
		btn_next = this.createButton('next',this.startGame);
		btn_next.x = 10;
		btn_next.y = 250;
		btn_next.visible = false;
		// example (used in learn mode)
		btn_example = this.createButton('example',this.startGame);
		btn_example.x = 560;
		btn_example.y = 250;
		btn_example.visible = false;
		
		// comparison buttons
		btn_win = this.createButton('win',this.startGame);
		btn_win.name = 'win';
		btn_win.x = 250;
		btn_win.y = 250;
		group_buttons_compare.add(btn_win);
		btn_lose = this.createButton('lose',this.startGame);
		btn_lose.name = 'lose';
		btn_lose.x = 380;
		btn_lose.y = 250;
		group_buttons_compare.add(btn_lose);
		btn_push = this.createButton('push',this.startGame);
		btn_push.name = 'push';
		btn_push.x = 510;
		btn_push.y = 250;
		group_buttons_compare.add(btn_push);
		// set everything in the group to invisible
		group_buttons_compare.setAll('visible',false);
		// hide the learn group for now
		group_buttons_compare.visible = false;
		
		// create buttons for learn mode
		var i = 0;
		var uid = 0;
		for (var key in Paigow.rules) {
			var value = Paigow.rules[key];
			var btn = this.createButton(key,this.startGame);
			btn.main_key = key;
			btn.x = 670;
			btn.y = 40 + (30*i);
			group_buttons_level.add(btn);
			var n = 1;
			for (var sub in Paigow.rules[key]) {
				var subval = Paigow.rules[key][sub];
				var btn = this.createButton(sub,this.startGame);
				btn.main_key = key;
				btn.sub_key = sub;
				btn.x = 670 +(n*110);
				btn.y = 40 + (30*i);
				group_buttons_level.add(btn);
				n++;
				uid++;
			}
			i++;
		}
		// set everything in the group to invisible
		group_buttons_level.setAll('visible',false);
		// hide the learn group for now
		group_buttons_level.visible = false;
		*/