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
		console.log('debug mode');
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
		var btn = this.createButton({name:'back',callback:this.btnHandler});
		btn.x = 0;
		btn.y = 375;

		
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
		sprite.x = Casino._WIDTH / 2 - 375 / 2;
		sprite.y = 40;
		
	},
	btnHandler:function(btn) {
		switch(btn.name) {
			case 'return':
				console.log('return to the game');
				break;
			case 'back':
				console.log('show the default view for this state');
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