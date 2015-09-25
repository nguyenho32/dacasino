/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
var Display = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get the difference between 2 arrays
	///////////////////////////////////////////////////////////////////////////////////////////////////
	arrayDiff:function(big,small) {
		var diff = [];
		big.forEach(function(key) {
			if (-1 === small.indexOf(key)) {
				diff.push(key);
			}
		},this);
		return diff;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to disply the hand as an icon
	///////////////////////////////////////////////////////////////////////////////////////////////////
	iconify:function(options){
		console.log('iconify options: ',options);
		var hands = options.hands;

		var scale = 0.3;
		var card_x = 120;
		var card_y = 100;
		var spacer_x = 45;

		var display = [];
		for (var i=0;i<hands.length;i++) {
			display.push({x:card_x+i*spacer_x,y:card_y-20,scale:scale});
		}
		return display;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to disply the hand normally
	///////////////////////////////////////////////////////////////////////////////////////////////////
	normal:function(options){
		var hand = options.hand;

		if (typeof options.mode !== 'undefined') {
			var scale = 0.75;
			var card_x = 120;
			var card_y = 260;
			var spacer_x = 110;
		} else {
			var card_x = 30;
			var card_y = 190;
			var spacer_x = 135;
		}

		var display = {};
		for (var i=0;i<hand.shuffled.length;i++) {
			var key = hand.shuffled[i];
			// scale is only set if 'mode' is set above
			if (scale) {
				if (hand.paigow.hair.indexOf(key) != -1) {
					display[key] = {x:card_x+i*spacer_x,y:card_y-20,scale:scale,outline:true};
				} else {
					display[key] = {x:card_x+i*spacer_x,y:card_y-20,scale:scale};
				}
			} else {
				display[key] = {x:card_x+i*spacer_x,y:card_y};
			}
		}
		return display;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display the hand set correctly
	///////////////////////////////////////////////////////////////////////////////////////////////////
	houseway:function(options) {
		console.log('houseway options: ',options);
		var hand = options.hand;

		var hair = (!options.chosen) ? this.arrayDiff(hand.sorted,hand.paigow.back) : options.chosen;
		if (options.chosen) {
			var extras = this.arrayDiff(hand.paigow.hair,options.chosen);
		}
		// if 1st hair is joker then reverse
		if (Cards.isJoker(hair[0])) {
			hair.reverse();
		}
		// if 1st hair is lower than 2nd (due to selected)
		if (Cards.getRank(hair[0]) < Cards.getRank(hair[1])) {
			hair.reverse();
		}
		// setup the back
		var back;
		// default back comes from paigow data
		if (!options.chosen) {
			back = hand.paigow.back;
		} else {
			back = hand.paigow.back;
			// hair bigger than 2 always means pair / trip / quad / joker so use the first hair card
			if (hand.paigow.hair.length > 2) {
				var name;
				if (Cards.getName(hand.paigow.hair[0]) == Cards.getName(hand.paigow.hair[1])) {
					name = Cards.getName(hair[0]);
				} else {
					name = Cards.getName(hair[1]);
				}
				// first card is required, everything matches
				if (Cards.getName(hand.paigow.hair[1]) == Cards.getName(hand.paigow.hair[2])) {
					name = Cards.getName(extras[0]);
				}
				// find the position of the card to replace
				for (var i=0; i<back.length;i++) {
					if (Cards.getName(back[i]) == name) {
						if (extras.length > 0) {
							back[i] = extras[0];
							extras.splice(0,1);
						}
					}
				}
			}
		}
		var showtxt = true;
		switch(options.mode) {
			case 'review':
				var scale = 0.6;
				var hand_x = 50;
				var hand_y = 150;
				var space_x = 80;
				var space_y = 110;
				hair = options.chosen;
				back = this.arrayDiff(hand.sorted,hair);
				break;
			case 'review-full':
				var scale = 0.6;
				var hand_x = 550;
				var hand_y = 150;
				var space_x = 80;
				var space_y = 110;
				hair = options.chosen;
				back = this.arrayDiff(hand.sorted,hair);
				break;
			case 'small':
				var scale = 0.7;
				var hand_x = 5;
				var hand_y = 75;
				var space_x = 90;
				var space_y = 130;
				break;
			case 'toast':
				var scale = 0.575;
				var hand_x = 120;
				var hand_y = 165;
				var space_x = 75;
				var space_y = 105;
				showtxt = false;
				break;
			default:
				var scale = 0.90;
				var hand_x = 5;
				var hand_y = 50;
				var space_x = 115;
				var space_y = 160;
			break;
		}
		// finally create the actual cards for display
		var display = {};
		for (var i=0;i<hand.sorted.length;i++) {
			var key = hand.sorted[i]
			if (key == hair[0]) {
				display[key] = {x:hand_x,y:hand_y,scale:scale};
			}
			if (key == hair[1]) {
				display[key] = {x:hand_x+space_x*1,y:hand_y,scale:scale};
			}
			if (key == back[0]) {
				display[key] = {x:hand_x,y:hand_y+space_y,scale:scale};
			}
			if (key == back[1]) {
				display[key] = {x:hand_x+space_x*1,y:hand_y+space_y,scale:scale};
			}
			if (key == back[2]) {
				display[key] = {x:hand_x+space_x*2,y:hand_y+space_y,scale:scale};
			}
			if (key == back[3]) {
				display[key] = {x:hand_x+space_x*3,y:hand_y+space_y,scale:scale};
			}
			if (key == back[4]) {
				display[key] = {x:hand_x+space_x*4,y:hand_y+space_y,scale:scale};
			}
		}
		if (showtxt) {
			display['txt'] = {width:space_x*3-5,height:space_y-5,x:hand_x+space_x*2,y:hand_y};
		}
		return display;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display the bank hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	bank:function(options) {
		var hand = options.hand;
		var showtxt = true;
		switch(options.mode) {
			case 'toast':
				var scale = 0.575;
				var hand_x = 505;
				var hand_y = 165;
				var space_x = 75;
				var space_y = 105;
				showtxt = false;
			break;
			case 'review':
				var scale = 0.6;
				var hand_x = 50;
				var hand_y = 150;
				var space_x = 80;
				var space_y = 110;
			break;
			default:
				var scale = 0.7;
				var hand_x = 545;
				var hand_y = 75;
				var space_x = 90;
				var space_y = 130;
			break;
			
		}
		var back = hand.paigow.back;
		var hair = this.arrayDiff(hand.sorted,back);
		
		var display = {};
		for (var i=0;i<hand.sorted.length;i++) {
			var key = hand.sorted[i]
			if (key == hair[0]) {
				display[key] = {x:hand_x,y:hand_y,scale:scale};
			}
			if (key == hair[1]) {
				display[key] = {x:hand_x+space_x*1,y:hand_y,scale:scale};
			}
			if (key == back[0]) {
				display[key] = {x:hand_x,y:hand_y+space_y,scale:scale};
			}
			if (key == back[1]) {
				display[key] = {x:hand_x+space_x*1,y:hand_y+space_y,scale:scale};
			}
			if (key == back[2]) {
				display[key] = {x:hand_x+space_x*2,y:hand_y+space_y,scale:scale};
			}
			if (key == back[3]) {
				display[key] = {x:hand_x+space_x*3,y:hand_y+space_y,scale:scale};
			}
			if (key == back[4]) {
				display[key] = {x:hand_x+space_x*4,y:hand_y+space_y,scale:scale};
			}
		}
		if (showtxt) {
			display['txt'] = {width:space_x*3-5,height:space_y-5,x:hand_x+space_x*2,y:hand_y};
		}
		return display;
	},

	///////////////////////////////////////////////////////////////////////////////////////////////////
	// silly function to display a hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	master:function(options) {
		var hand = options.hand;

		var BANK_Y = 30;
		var spacer = 190;
		var back = hand.paigow.back;;
		var cards = hand.sorted;
		var hair = this.arrayDiff(cards,back);
		var display = {};
		for (var i=0;i<hand.sorted.length;i++) {
			var key = hand.sorted[i];
			if (key == hair[0]) {
				display[key] = {x:10,y:BANK_Y};
			}
			if (key == hair[1]) {
				display[key] = {x:140,y:BANK_Y};
			}
			if (key == back[0]) {
				display[key] = {x:10,y:BANK_Y+spacer};
			}
			if (key == back[1]) {
				display[key] = {x:140,y:BANK_Y+spacer};
			}
			if (key == back[2]) {
				display[key] = {x:270,y:BANK_Y+spacer};
			}
			if (key == back[3]) {
				display[key] = {x:400,y:BANK_Y+spacer};
			}
			if (key == back[4]) {
				display[key] = {x:530,y:BANK_Y+spacer};
			}
		}
		return display;
	}
};