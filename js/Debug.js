Casino.Debug = function(game) {};
Casino.Debug.prototype = {
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// common stuff
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createButton:Casino.createButton,
	createCard:Casino.createCard,
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// creation
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create: function() {
		console.log('debug mode');
		/*
			top ui elements
		*/
		// button for returning to the menu
		var btn = this.createButton({name:'menu',callback:this.mainMenu});
		btn.key = 'menu';
		btn.x = 0;
		btn.y = 0;
		
		for (var i=0; i<Cards.names.length; i++) {
			var key = Cards.names[i]+'_diamond';
			var card = this.createCard(key);
			if (i < Cards.names.length / 2) {
				card.x = 10+(i*140);
				card.y = 30;
			} else {
				var n = Math.floor(i-Cards.names.length / 2);
				card.x = 10+(n*140);
				card.y = 215;
			}
		}
		
		/*
		// button for creating a single debug hand
		var btn = this.createButton('single',this.mainMenu);
		btn.key = 'single';
		btn.x = 240;
		btn.y = 0;
		// button for creating multiple debug hands
		var btn = this.createButton('multiple',this.mainMenu);
		btn.key = 'multiple';
		btn.x = 500;
		btn.y = 0;
		*/
	},
	/******************************************************************************************************************************************
		DEBUG FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create multiple hands of paigow
	///////////////////////////////////////////////////////////////////////////////////////////////////
	debugCreateMultiple:function(sprite,pointer) {
//		fnResetBoard();
		// hide the start / next / example buttons
		/*
		btn_start.visible = false;
		btn_next.visible = false;
		btn_example.visible = false;
		
		// hide the level / compare buttons
		group_buttons_level.visible = false;
		group_buttons_compare.visible = false;
*/

		/*
		// create a shuffled deck for use in our game
		deck = Deck.create('standard',true,1);

		// show the deck
		for (var i=0;i<deck.length;i++) {
			var card = Cards.cardCreate({card:deck[i]});
			group.addChild(card);
			card.x = 5+i*25;
		}
		*/
		// create some hands
		if (!DEBUG_COUNT) {
			DEBUG_COUNT = 25;
		}
		for (var n=0;n<DEBUG_COUNT;n++) {
			// create a specific type of hand
			if (!DEBUG_MAIN) {
				DEBUG_MAIN = 'random';
			}
			if (!DEBUG_SUB) {
				DEBUG_SUB = 'random';
			}
			var hand = Cards.handCreate(Poker.create(DEBUG_MAIN,DEBUG_JOKER,DEBUG_SUB));
			this.txt_main_info.text = 'creating '+DEBUG_COUNT+' '+DEBUG_MAIN+' - '+DEBUG_SUB+' hands';

			//**********************************************************************************************************
			//
			//	This section for hands that are not being set correctly
			//
			//
			/* FIXED
				wheel straight w/ joker
			var set = ["ace_diamond","seven_diamond","six_heart","five_heart","four_spade","two_club","joker_one"];
			*/
			// wheel straights w/joker
			/* FIXED
				not finding the joker high straight? joker,queen,10,9,8...but this would make it 9,8 straight instead of
				pair of 9, queen high straight. So this hand is correct
			var set = ["queen_heart","jack_spade","ten_club","nine_spade","nine_heart","eight_club","joker_one"];
 			*/
			/* FIXED
				reading the 6 high straight twice (due to the pairs)
			var set = ["seven_heart","six_heart","six_club","five_club","four_diamond","two_spade","joker_one"];
			*/
			/* FIXED
				this hand should be pair with a joker high straight
			var set = ["seven_diamond","six_heart","five_heart","four_club","three_diamond","three_club","joker_one"];
			*/
			/* FIXED
				this hand should be pair queen straight
				jack, 10, 9, joker, 7
			var set = ["queen_spade","queen_diamond","jack_club","ten_diamond","nine_heart","seven_heart","joker_one"];
			*/
			/* FIXED
				this hand should be pair king natural straight
			var set = ["king_club","nine_spade","eight_spade","seven_heart","six_diamond","five_club","joker_one"];
			*/
			/* FIXED
				this is broken for some reason
				should be pair queen / natural straight
				hair should contain queen-diamond, queen-heart, joker
			var set = ["queen_club","queen_diamond","jack_heart","ten_club","nine_spade","eight_diamond","joker_one"];
			*/
			/* FIXED
				incorrectly set as 9, 8 - 7 high straight (7,6,5,joker,3)
				should be pair 3 - 9 high natural straight
				bonus of straight not being set
			var set = ["nine_club","eight_diamond","seven_heart","six_club","five_diamond","three_club","joker_one"];
			*/
			/* FIXED
				incorrectly set as jack,nine - 10 high straight
				should be pair / pair 9's & jacks
				bonus of straight not being set
			var set = ["jack_heart","ten_heart","nine_heart","nine_club","eight_club","six_spade","joker_one"];
			*/
			/* FIXED
				this correctly set as pair / pair jacks & queens
				bonus of straight not being set
			var set = ["queen_diamond","jack_club","jack_diamond","ten_club","nine_club","five_heart","joker_one"];
			*/
			/* FIXED
				correctly set as this hand is pair 5, nine high straight
				needs to have the trip 5's in the hair
			var set = ["eight_heart","seven_heart","six_club","five_heart","five_club","five_diamond","joker_one"];
			*/
			/* FIXED
				bugs out 
				should be queen, jack...joker, 9, 8, 7, 6
			var set = ["queen_club", "jack_diamond", "nine_heart", "eight_spade", "seven_club", "six_club", "joker_one"];
			*/
			/* FIXED
				hand is incorrectly set 8,4 - flush
				should be set full house solvePair
			var set = ["ten_diamond","eight_spade","eight_diamond","four_spade","four_diamond","three_diamond","joker_one"];
			*/
			/* FIXED
				hand incorrectly set as 5, 4 - queen high straight flush
				should be queen 5, jack high flush (with straight-flush bonus)
			var set = ["queen_club","jack_club","ten_club","nine_club","eight_club","five_heart","four_club"];
			*/
			/* FIXED
				hand incorrectly set as jack, 6 - pair of 3
				should be pair 3 flush, with a straight-flush bonus
			var set = ["jack_club","six_club","five_club","four_club","three_heart","three_club","two_club"];
			*/
			/* FIXED
				hand correctly set as as pair 9, jack high straight flush
				bonus incorrect as 4 of a kind, should be straight flush
				description reads joker high straight flush
			var set = ["ten_spade","nine_spade","nine_heart","nine_club","eight_spade","seven_spade","joker_one"];
			*/
			/* FIXED
				hand correctly set as pair 6, 6 high straight flush
				need to remove the 6 spade from possible hair
			var set = ["six_spade","six_heart","five_spade","four_spade","three_spade","two_spade","joker_one"];
			*/
			/* FIXED
				hand incorrectly set 10,7 pair of 6
				should be 10, 6 - 7 high straight flush
			var set = ["ten_club","seven_diamond","six_spade","six_diamond","five_diamond","four_diamond","three_diamond"];
			*/
			/* FIXED
				hand correctly set, not setting as straight flush
			var set = ["eight_heart","seven_spade","six_spade","five_spade","five_diamond","four_spade","three_spade"];
			*/
			/* FIXED
				hand correctly set pair king, queen high flush
				bonus straight flush not set
			var set = ["king_club","queen_heart","jack_heart","ten_heart","nine_heart","six_heart","joker_one"];
			*/
			/* FIXED
				hand incorrectly set 7,2 - ace high flush
				should be pair 2 / pair ace (solvePair)
			var set = ["ace_heart","ten_heart","seven_club","four_heart","two_spade","two_heart","joker_one"];
			*/
			/* FIXED
				hand correctly set pair king, quad 2's
				need to put trip kings in the hair
			var set = ["king_spade","king_heart","king_club","two_heart","two_club","two_diamond","joker_one"];
			*/
			/* FIXED
				hand incorrectly set pair six, jack high straight
				should be pair jack, 10 high straight
//			var set = ["jack_diamond","ten_diamond","nine_club","eight_club","seven_diamond","six_club","joker_one"];
			*/
			/* FIXED
				hand set correctly, possible hair not correct
				should be trip queens
			var set = ["queen_heart","queen_club","queen_diamond","two_spade","two_heart","two_club","two_diamond"];
			*/
			/* FIXED
				hand set almost correctly, desc incorrect
				should be ace (joker) high flush
			var set = ["queen_club","nine_heart","nine_club","five_club","three_club","two_club","joker_one"];
			// this is almost the same thing, should put the natural in front with joker based flush behind
			var set = ["ace_spade","ace_heart","jack_spade","seven_spade","five_spade","four_spade","joker_one"];
			*/
			/*
				hand set correctly, hair incorrect
				should be five_diamond, followed by both nines (five is required)
			var set = ["jack_club","ten_club","nine_spade","nine_diamond","eight_heart","seven_heart","five_diamond"];
			*/
			/* FIXED
				hand set incorrectly
				should be pair 8 (natural) with joker based flush behind
			var set = ["king_heart","jack_heart","nine_heart","eight_spade","eight_club","six_heart","joker_one"];
			var set = ["king_heart","jack_heart","nine_heart","eight_diamond","eight_club","six_heart","five_heart"];
			*/
			/* FIXED
				hand set correctly
				should have king and both 9's in the hair
			var set = ["king_club","queen_club","jack_heart","ten_diamond","nine_heart","nine_club","eight_heart"];
			*/
			/* FIXED
				incorrectly set as 7,6 - ace (joker) high flush
				should be pair 3, ten high straight
			var set = ["ten_club","nine_club","eight_club","seven_heart","six_spade","three_club","joker_one"];
			*/
			/* FIXED
				incorrectly set as pair / pair
				should be pair 8, nine high straight (bonus: straight-flush)
			var set = ["nine_diamond","eight_diamond","eight_spade","seven_diamond","six_diamond","five_heart","joker_one"];
			*/
			/* FIXED
				hand set correctly, desc straight-flush not set
			var set = ["king_diamond","seven_spade","six_spade","five_spade","four_spade","three_spade","joker_one"];
			*/
			
			//
			//
			//
			//**********************************************************************************************************
			//
			/*
				hand contains a flush, automatic check in Poker.create() should rebuild the hand until there is no flush
			*/
//			var set = ["jack_heart","jack_diamond","ten_heart","ten_diamond","nine_heart","eight_heart","joker_one"];


			/*
				display broken - ace is not being placed
			*/
//			var set = ["ace_heart","ace_spade","nine_diamond","five_heart","four_club","three_diamond","two_diamond"];

			//
			//
			//
			//**********************************************************************************************************
			if (typeof set !== 'undefined') {
				var hand = Cards.handCreate(set);
			}
			//
			//
			//
			// solve for poker
//			console.log('hand: ',n,hand);
			hand.poker = Poker.solve(hand.sorted);
//			console.log('hand poker: ',n,hand.poker)
			// solve for pai-gow
			hand.paigow = Paigow.solve(hand.poker);
//			console.log('hand paigow: ',n,hand.paigow);
			// display the hand (debug);
			this.displayNormalWay(hand,{debug:true,row:n});
			
			// break out of the loop if we are setting 1 hand
			if (typeof set !== 'undefined') {
				break;
			}
		}

/*		
		// match the hand to an exist card on the screen so we can move it (do this instead of creating a new one each time)
		var num = 0;
		group.forEach(function(card) {
			if (hand.indexOf(card.key) != -1) {
				card.x = 5+135*num;
				card.y = 200;
				num++;
			}
		},this);
*/
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// return to main menu
	///////////////////////////////////////////////////////////////////////////////////////////////////
	mainMenu: function(pointer) {
		this.game.state.start('MainMenu');
	}
};