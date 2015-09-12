var Game = {
}

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