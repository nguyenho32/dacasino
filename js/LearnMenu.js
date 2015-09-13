Casino.LearnMenu = function(game) {};
Casino.LearnMenu.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		
		// button for returning to the menu
		var btn = this.createButton('menu',this.btnHandler);
		btn.key = 'menu';
		btn.x = 0;
		btn.y = 0;
		// button for starting a game
		var btn = this.createButton('start',this.btnHandler);
		this.btn_start = btn;
		btn.key = 'start';
		btn.x = 890;
		btn.y = 0;
		// button for options
		var btn = this.createButton('option',this.btnHandler);
		this.btn_option = btn;
		btn.key = 'option';
		btn.x = 0;
		btn.y = 375;
		// create a text box for game related information
		var sprite = this.add.sprite(0,0);
		sprite.x = 120;
		sprite.y = 0;
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,760,25);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: false };
		var txt = 'mode: '+Casino.game.mode;
		this.txt_main_info = this.add.text(5, 5, txt, style);	
		sprite.addChild(this.txt_main_info);
		/*
		// create buttons for the main menu
		var menu = ["learn","how","to","compare","speed","timed","debug"];
		var sprite = this.add.sprite(0,0);
		var width;
		for (var i=0; i<menu.length; i++) {
			var btn = this.createButton(menu[i],this.startGame);
			btn.key = menu[i];
			if (i == menu.length-1) {
				btn.x = Casino._WIDTH - 115;
			} else {
				btn.x = 0 + i*115;
			}
			btn.y = 0;
			sprite.addChild(btn);
		}
		*/
		// create a text box for menu related information
		var sprite = this.add.sprite(0,0);
		var gfx = this.add.graphics(0,0);
		gfx.beginFill(Casino._INFO_BG,1);
		gfx.drawRect(0,0,375,175);
		sprite.addChild(gfx);
		var style = { font: '12pt Courier', fill: Casino._INFO_TXT, align: 'left', wordWrap: true, wordWrapWidth: 375 };
		var txt = 'Welcome to Learn Mode, this is basically a menu / progression tracker, actual gameplay is done inside the Game state'
		main_info_box = this.add.text(0, 0, txt, style);	
		sprite.addChild(main_info_box);
		sprite.x = 275;
		// place the information area
		sprite.y = 30;
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
	// return to main menu or start a game state
	///////////////////////////////////////////////////////////////////////////////////////////////////
	btnHandler: function(pointer) {
		if (pointer.key != 'MainMenu') {
			this.game.state.start('Game');
			
		} else { 
			this.game.state.start('MainMenu');
		}
	}
};


