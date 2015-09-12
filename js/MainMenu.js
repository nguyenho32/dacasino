Casino.MainMenu = function(game) {};
Casino.MainMenu.prototype = {
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
			console.log(btn.key,btn.x);
			sprite.addChild(btn);
		}
		console.log(Casino._WIDTH / 2);
		console.log(sprite.getChildAt(0));
		sprite.x = (Casino._WIDTH / 2) - (menu.length*113 / 2);
		
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
		sprite.x = (Casino._WIDTH / 2) - (sprite.getChildAt(0).width / 2);
		// place the information area
		sprite.y = 40;
	},
	startGame: function(pointer) {
		console.log(pointer.key);
		this.game.state.start('Game');
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
	}
};