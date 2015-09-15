var Display = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to disply the hand normally
	///////////////////////////////////////////////////////////////////////////////////////////////////
	normal:function(group,options){
		var hand = options.hand;
		var cards = hand.shuffled;
		if (typeof options.size !== 'undefined') {
			var scale = 0.75;
			var card_x = 120;
			var card_y = 240;
			var spacer_x = 110;
		} else {
			var card_x = 30;
			var card_y = 190;
			var spacer_x = 135;
		}

		for (var i=0;i<group.children.length;i++) {
			var card = group.children[i];
			var key = hand.shuffled[i]
			card.x = card_x+i*spacer_x;
			card.y = card_y;
			// scale is only set if 'size' is set above
			if (scale) {
				card.scale.setTo(scale);
				if (hand.paigow.hair.indexOf(key) != -1) {
					card.y -=20;
					card.outline.visible = true;
				}
			}
		}
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	master:function(group,options) {
		var hand = options.hand;
		var BANK_Y = 30;
		var spacer = 190;
		var hair = hand.paigow.hair;
		var back = hand.paigow.back;;
		var cards = hand.sorted;
		for (var i=0;i<group.children.length;i++) {
			var card = group.children[i];
			var key = hand.original[i];
			var matched = false;
			if (card.key == hair[0]) {
				card.x = 10;
				card.y = BANK_Y;
				matched = true;
			}
			if (card.key == hair[1]) {
				card.x = 140;
				card.y = BANK_Y;
				matched = true;
			}
			if (card.key == back[0]) {
				card.x = 10;
				card.y = BANK_Y+spacer;
				matched = true;
			}
			if (card.key == back[1]) {
				card.x = 140;
				card.y = BANK_Y+spacer;
				matched = true;
			}
			if (card.key == back[2]) {
				card.x = 270;
				card.y = BANK_Y+spacer;
				matched = true;
			}
			if (card.key == back[3]) {
				card.x = 400;
				card.y = BANK_Y+spacer;
				matched = true;
			}
			if (card.key == back[4]) {
				card.x = 530;
				card.y = BANK_Y+spacer;
				matched = true;
			}
		}
		if (!matched) {
			console.log('hand display b0rk3d: ',hand);
		}
	}
};