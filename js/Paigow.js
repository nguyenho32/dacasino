Paigow = {
	// get the difference between 2 arrays
	arrayDiff:function(big,small) {
		var diff = [];
		big.forEach(function(key) {
			if (-1 === small.indexOf(key)) {
				diff.push(key);
			}
		},this);
		return diff;
	},
	/******************************************************************************************************************************************
		PAI-GOW RULES
	******************************************************************************************************************************************/
	rules:{
		'pai-gow':{
			'nothing':'When the hand contains no pairs, trips, quads, straights or flushes. Put the 2nd & 3rd highest cards in the hair',
			'+joker':'When the hand contains no pairs, trips, quads, straights or flushes and you have a joker. Put the 1st and 3rd highest cards in the front and use the joker to make a pair with the 2nd high card'
		},
		'pairs':{
			'1-pair':'When the hand contains a pair, place the 1st & 2nd highest non-pair cards in hair',
			'2-pair':'When the hand contains 2 pairs...',
			'3-pair':'When the hand contains 3 pairs, place the highest pair in hair',
			'1-pair+joker':'When the hand contains 1 pair & joker. If the highest non-pair card is higher than the pair, put the pair in front and the high card + joker as a pair behind. Otherwise Put the high card + joker in front as a pair with the natural pair behind',
			'2-pair+joker':'When the hand contains 2 pair & joker. If the highest non-pair card is 3 ranks above the highest pair, put it in front with the joker to make 3 pairs. Otherwise put the high pair and front and use the joker to make trips behind',
			'3-pair+joker':'When the hand contains 3 pairs & joker. Put the highest pair in front and make a full house behind with the joker',
		},
		'trips':{
			'0-pair':'When the hand contains trips. Put the 1st & 2nd highest non-trip cards in front with the trips behind',
			'1-pair':'When the hand contains trips + 1 pair. Put the pair in front with the trips behind',
			'2-pair':'When the hand contains trips + 2 pairs. Put the highest pair in front with a full house behind',
			'trips':'When the hand contains 2 trips. Put 2 of the cards from the higher trips in the hair, with the lower trips behind',
			'1-pair+joker':'When the hand contains trips, 1 pair & joker. If the pair is higher than the highest non-pair/non-trips card put it in front with the joker with a full house behind. Otherwise put the pair in front with a 4 of a kind behind',
			'trips+joker':'When the hand contains 2 trips & joker. Put 2 cards from the higher trips in front and make 4 of a kind behind',
		},
		'straight':{
			'0-pair':'When the hand contains a straight place the highest 2 cards in the hair that will not break the straight',
			'1-pair':'When the hand contains a straight + pair place the highest 2 cards in the hair that will not break the straight',
			'2-pair':'When the hand contains a straight + 2 pairs, follow the pairs : 2-pair rule',
			'0-pair+joker':'When the hand contains a straight + joker. Put the highest 2 cards in the hair that will not break the straight',
			'1-pair+joker':'When the hand contains a straight + pair + joker. Follow pairs : 2-pair rule',
			'2-pair+joker':'When the hand contains a straight + 2 pairs + joker. Follow the pairs : 2-pair + joker rule',
		},
		'flush':{
			'0-pair':'When the hand contains a flush place the highest 2 cards in the hair that will not break the flush',
			'1-pair':'When the hand contains a flush + pair place the highest 2 cards in the hair that will not break the flush',
			'2-pair':'When the hand contains a flush + 2 pairs, follow the pairs : 2-pair rule',
			'0-pair+joker':'When the hand contains a flush + joker. Put the highest 2 cards in the hair that will not break the flush',
			'1-pair+joker':'When the hand contains a flush + pair + joker. Follow pairs : 2-pair rule',
			'2-pair+joker':'When the hand contains a flush + 2 pairs + joker. Follow the pairs : 2-pair + joker rule',
		},
		'quads':{
			'0-pair':'When the hand contains quads...',
			'1-pair':'When the hand contains quads + pair. Put the pair in front with quads behind',
			'trips':'When the hand contains quads + trips. Put 2 of the trips in front with the quads behind',
			'0-pair+joker':'When the hand contains quads & joker. Put the highest non-quad in front with joker and quads behind',
			'1-pair+joker':'When the hand contains quads + pair & joker...',
		}
	},
	/******************************************************************************************************************************************
		SOLVE FUNCTIONS
	******************************************************************************************************************************************/
	solve:function(poker) {
		var bonus = '';
		// quads / trips get a match final
		var match_final = false;
		// override for straights / flushes
		var override = false;
		// the result
		var result;
		
		// solve for quads
		if (poker.quads) {
			result = this.solveQuads(poker);
			match_final = true;
		}
		// solve for trips
		if (poker.trips && !match_final) {
			result = this.solveTrips(poker);
			match_final = true;
		}
		// solve for pairs
		if (poker.pairs && !match_final) {
			result = this.solvePairs(poker);
		}

		// solve for straight
		if (poker.straights) {
			result = this.solveStraight(poker);
		}
		// solve for flush
		if (poker.flush) {
			result = this.solveFlush(poker);
		}

		// no result from anything above, solve for nothing
		if (poker.nothing) {
			// no result, solve for nothing
			result = this.solveNothing(poker);
		}

		/*
			 add the description
		*/
		var hair = result.hair;
		var back = result.back;
		var desc_hair = '';
		var desc_back = '';
		var hair_pair = false;
		// both hair cards match, pair on top
		if (Card.getName(hair[0]) == Card.getName(hair[1])) {
			desc_hair = 'pair of '+Card.getName(hair[0]);
			hair_pair = true;
		} else {
			desc_hair = Card.getName(result.hair[0])+', '+Card.getName(hair[1]);
		}
		// if the 1st card is a joker, reverse the hair
		if (Card.getName(hair[0]) == 'joker') {
			hair.reverse();
		}
		// if the 2nd card is a joker then pair up the hair
		if (Card.getName(hair[1]) == 'joker') {
			desc_hair = 'pair of '+Card.getName(hair[0]);
			hair_pair = true;
		}
		// the back
		switch(result.brief) {
			case '1-pair':
				desc_back = 'pair of '+Card.getName(back[0]);
				break;
			case '2-pair':
				desc_back = '2-pair behind '+Card.getName(back[0])+' & '+Card.getName(back[2]);
				break;
			case 'trips':
				desc_back = 'trip '+Card.getName(back[0]);
				break;
			case 'straight':
				desc_back = Card.getName(back[0])+' high straight';
				break;
			case 'flush':
				desc_back = Card.getName(back[0])+' high flush';
				break;
			case 'full house':
				desc_back = 'full house '+Card.getName(back[0])+'s over '+Card.getName(back[3])+'s';
				break;
			case 'quads':
				desc_back = 'quad '+Card.getName(back[0])+'s';
				break;
			case 'straight-flush':
				// 1st card is ace or 2nd card is a king, then its a royal flush
				if (Card.getName(back[0]) == 'ace' || Card.getName(back[1]) == 'king') {
					desc_back = 'royal flush';
				} else {
					desc_back = Card.getName(back[0])+' high straight flush';
				}
				break;
			case '5 kind':
				desc_back = '5 of a kind '+Card.getName(back[0])+'s';
				break;
			default:
				if (Card.getName(back[1]) != 'joker') {
					desc_back = Card.getName(back[0])+' high';
				} else {
					desc_back = 'pair of '+Card.getName(back[0]);
				}
				break;
		}
		// replace joker high with ace high in flushes
		if (Card.getName(back[0]) == 'joker' && result.brief == 'flush') {
			desc_back = desc_back.replace('joker','ace');
		}
		// replace joker high with <card> high
		if (Card.getName(back[0]) == 'joker' && result.brief == 'straight') {
			var index = Card.names.indexOf(Card.getName(back[1]));
			var str = Card.names[index+1];
			desc_back = desc_back.replace('joker',str);
		}

		result.desc = desc_hair+' - '+desc_back;

		// the bonus
		if (poker.straights) {
			bonus = 'straight';
		}
		if (poker.flush) {
			bonus = 'flush';
		}
		if (poker.quads) {
			// quads with joker yields 5 of a kind
			if (poker.joker) {
				bonus = '5 of a kind';
			} else {
				// simple 4 of a kind
				bonus = '4 of a kind';
			}
		} else if (poker.trips) {
			// trips with pair yields full house
 			if (poker.pairs) {
				bonus = 'full house';
			}
			// trips with joker yields 4 of a kind
			if (poker.joker) {
				bonus = '4 of kind';
			}
		} else if (poker.pairs) {
			// 2-pairs or 3-pairs with joker yields bonus full house
			if ((poker.pairs.length == 2 || poker.pairs.length == 3) && poker.joker) {
				bonus = 'full house';
			}
		}
		if (bonus != '') {
			result.bonus = bonus;
		} else {
			result.bonus = 'none';
		}
		
		// debug text
		var debug = '';
		if (match_final) {
			debug += '{match final} ';
		}
		if (override && (poker.straight || poker.flush)) {
			debug += '[override] ';
		}
		debug += 'rule: '+result.rule+'\n';
		debug += 'bonus: '+result.bonus+'\n';
		debug += result.desc+'\n';
		debug += result.hair.toString()+'\n'+result.back.toString();
		result.debug = debug;
		
		return result;
	},
	
	// nothing
	solveNothing:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'pai-gow:+joker' : 'pai-gow:nothing';

		if (joker) {
			// 1st & 3rd high card in hair, 2nd high + joker for pair
			hair = [cards[0],cards[2]];
			back = [cards[1],cards[6],cards[3],cards[4],cards[5]];
		} else {
			// 2nd & 3rd high card in hair, rest behind
			hair = [cards[1],cards[2]];
			back = [cards[0],cards[3],cards[4],cards[5],cards[6]];
		}
		
		return {hair,back,rule};
	},
	
	// pairs
	solvePairs:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'pairs:1-pair+joker' : 'pairs:1-pair';
		var brief = '1-pair';
		
		var pairs = poker.pairs;
		var pair1 = pairs[0];
		var all = pair1;
		if (pairs[1]) {
			pair2 = pairs[1];
			var new_all = all.concat(pair2);
			all = new_all;
		}
		if (pairs[2]) {
			pair3 = pairs[2];
			var new_all = all.concat(pair3);
			all = new_all;
		}
		// the extra cards
		var extras = this.arrayDiff(cards,all);
		switch(pairs.length) {
			case 3:
				if (joker) {
					// put high pair in front, make full house behind
					hair = pair1;
					back = [pair2[0],pair2[1],extras[0],pair3[0],pair3[1]];
					rule = 'pairs:3-pair+joker';
					brief = 'full house';
				} else {
					// no joker so put high pair in front, everything else behind
					hair = pair1;
					back = [pair2[0],pair2[1],pair3[0],pair3[1],extras[0]];
					rule = 'pairs:3-pair';
					brief = '2-pair';
				}
				break;
			case 2:
				// no trips or quads
				if (poker.trips || poker.quads) {
					break;
				}
				var high_card = extras[0];
				var high_rank = Card.getRank(high_card);
				var high_name = Card.getName(high_card);
				
				var pair_card = pair1[0];
				var pair_rank = Card.getRank(pair_card);
				var pair_name = Card.getName(pair_card);
				if (joker) {
					rule = 'pairs:2-pair+joker';
					// high card is 3 ranks above high pair, make 3-pairs
					if (high_rank > pair_rank+2) {
						hair = [extras[0],extras[2]];
						back = [pair1[0],pair1[1],pair2[0],pair2[1],extras[0]];
						brief = '2-pair';
					} else {
						//  otherwise make trips
						hair = pair1;
						back = [pair2[0],pair2[1],extras[2],extras[0],extras[1]];
						brief = 'trips';
					}
				} else {
					rule = 'pairs:2-pair';
					switch(pair_name) {
						// ace, king, queen always split
						case 'ace':
						case 'king':
						case 'queen':
							hair = pair2;
							back = [pair1[0],pair1[1],extras[0],extras[1],extras[2]];
							break;
						// jack, 10, 9 requires ace
						case 'jack':
						case 'ten':
						case 'nine':
							// if high card is an ace, then 2-pair behind
							if (high_rank >= Card.getRank('ace')) {
								hair = [extras[0],extras[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],extras[2]];
								brief = '2-pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],extras[0],extras[1],extras[2]];
							}
							break;
						// 8,7,6 requires king or better
						case 'eight':
						case 'seven':
						case 'six':
							// if high card is an ace, then 2-pair behind
							if (high_rank >= Card.getRank('king')) {
								hair = [extras[0],extras[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],extras[2]];
								brief = '2-pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],extras[0],extras[1],extras[2]];
							}
							break;
						// 5,4,3,2 requires queen or better
						case 'five':
						case 'four':
						case 'three':
							// if high card is an ace, then 2-pair behind
							if (high_rank >= Card.getRank('queen')) {
								hair = [extras[0],extras[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],extras[2]];
								brief = '2-pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],extras[0],extras[1],extras[2]];
							}
							break;
					}
				}
				break;
			case 1:
				if (joker) {
					// high card is lower than pair, put in front with joker
					if (Card.getRank(extras[0]) < Card.getRank(all[0])) {
						hair = [extras[0],extras[4]];
						back = [all[0],all[1],extras[1],extras[2],extras[3]];
					} else {
						// otherwise put pair in front and high card in back with joker
						hair = [all[0],all[1]];
						back = [extras[0],extras[4],extras[1],extras[2],extras[3]];
					}
				} else {
					// no joker so put 1st & 2nd high card in front with pair behind
					hair = [extras[0],extras[1]];
					back = [all[0],all[1],extras[2],extras[3],extras[4]];
				}
				break;
		}

		return {hair,back,rule,brief};
	},
	
	// trips
	solveTrips:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'trips:0-pair+joker' : 'trips:0-pair';
		var brief = 'trips';

		// trips (only run if no quads)
		if (poker.quads) {
			return;
		}
		var trips = poker.trips;
		var trip1 = trips[0];
		var all = trip1;
		if (trips[1]) {
			trip2 = trips[1];
			var new_all = all.concat(trip2);
			all = new_all;
		}
		// the extra cards
		var extras = this.arrayDiff(cards,all);
		switch(trips.length) {
			case 2:
				rule = 'trips:trips';
				hair = [trip1[0],trip1[1]];
				// trip card is higher than the remainder then put in front of it
				if (Card.getRank(trip1[0]) > Card.getRank(extras[0])) {
					back = [trip2[0],trip2[1],trip2[2],trip1[2],extras[0]];
				} else {
					// otherwise put at the end
					back = [trip2[0],trip2[1],trip2[2],extras[0],trip1[2]];
				}
				// with a joker we get quads
				if (joker) {
					back = [trip2[0],trip2[1],trip2[2],extras[0],trip1[2]];
					rule = 'trips:trips+joker';
					brief = 'quads';
				}
				break;
			default:
				// pair exists
				if (poker.pairs) {
					var pairs = poker.pairs;
					var pair1 = pairs[0];
					var new_all = all.concat(pair1);
					all = new_all;
					if (pairs[1]) {
						pair2 = pairs[1];
					}
					// extra cards
					var extras = this.arrayDiff(cards,all);
					// 2-pairs, full house behind
					if (pairs.length > 1) {
						hair = pair1;
						back = [trip1[0],trip1[1],trip1[2],pair2[0],pair2[1]];
						rule = 'trips:2-pair';
						brief = 'full house';
					} else {
						if (joker) {
							// if high card is above pair, put in front with joker and full house behind
							if (Card.getRank(extras[0]) > Card.getRank(pair1[0])) {
								hair = [extras[0],extras[1]];
								back = [trip1[0],trip1[1],trip1[2],pair1[0],pair1[1]];
								rule = 'trips:1-pair+joker';
								brief = 'full house';
							} else {
								// otherwise put pair in front with quads behind
								hair = pair1;
								back = [trip1[0],trip1[1],trip1[2],extras[1],extras[0]];
								rule = 'trips:1-pair+joker';
								brief = 'quads';
							}
						} else {
							// pair in front, trips behind
							hair = pair1;
							back = [trip1[0],trip1[1],trip1[2],extras[0],extras[1]];
							rule = 'trips:1-pair';
							brief = 'trips';
						}
					}
				} else {
					if (joker) {
						// joker with high card to make pair in front, trips behind
						hair = [extras[0],extras[3]];
						back = [trip1[0],trip1[1],trip1[2],extras[1],extras[2]];
					} else {
						// trip aces split
						if (Card.getName(trip1[0]) == 'ace') {
							hair = [trip1[0],extras[0]];
							back = [trip1[1],trip1[2],extras[1],extras[2],extras[3]];
						} else {
							// 1st & 2nd high card in front, trips behind
							hair = [extras[0],extras[1]];
							back = [trip1[0],trip1[1],trip1[2],extras[2],extras[3]];
						}
					}
				}
				break;
		}
		
		return {hair,back,rule,brief};
	},
	
	// quads
	solveQuads:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'quads:0-pair+joker' : 'quads:0-pair';
		var brief = 'quads';

		var quads = poker.quads[0];
		// extra cards
		var extras = this.arrayDiff(cards,quads);
		// have trips
		if (poker.trips) {
			var trip = poker.trips[0];

			hair = [trip[0],trip[1]];
			back = [quads[0],quads[1],quads[2],quads[3],trip[2]];
			rule = 'quads:trips';
		}
		// have a pair
		else if (poker.pairs) {
			var pair = poker.pairs[0];
			var new_extras = this.arrayDiff(extras,pair);
			extras = new_extras;
			
			if (joker) {
				rule = 'quads:1-pair+joker';
				// pair is bigger than quad so make 5 of a kind
				if (Card.getRank(pair[0]) > Card.getRank(quads[0])) {
					hair = [pair[0],pair[1]];
					back = [quads[0],quads[1],quads[2],quads[3],extras[0]];
					brief = '5 kind';
				} else {
					// quad is bigger so make full house
					hair = quads;
					back = [quads[0],quads[1],extras[0],pair[0],pair[1]];
					brief = 'full house';
				}
			} else {
				// quads + pair
				hair = [pair[0],pair[1]];
				back = [quads[0],quads[1],quads[2],quads[3],extras[0]];
				rule = 'quads:1-pair';
			}
		} else {
			// just have quads
			if (joker) {
				hair = [extras[0],extras[2]];
				back = [quads[0],quads[1],quads[2],quads[3],extras[1]];
			} else {
				// quads without a joker follow some rules
				var quad_name = Card.getName(quads[0]);
				switch(quad_name) {
					// quad ace, king, queen always split
					case 'ace':
					case 'king':
					case 'queen':
						hair = quads;
						back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
						brief = 'pair';
						break;
					// quad j,10,9 needs king or better
					case 'jack':
					case 'ten':
					case 'nine':
						if (Card.getRank(extras[0]) >= Card.getRank('king')) {
							hair = [extras[0],extras[1]];
							back = [quads[0],quads[1],quads[2],quads[3],extras[2]];
						} else {
							hair = quads;
							back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
							brief = 'pair';
						}
						break;
					// quad 8,7,6 needs queen or better
					case 'eight':
					case 'seven':
					case 'six':
						if (Card.getRank(extras[0]) >= Card.getRank('queen')) {
							hair = [extras[0],extras[1]];
							back = [quads[0],quads[1],quads[2],quads[3],extras[2]];
						} else {
							hair = quads;
							back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
							brief = 'pair';
						}
						break;
					// 5 and below never split
					case 'five':
					case 'four':
					case 'three':
					case 'two':
						hair = [extras[0],extras[1]];
						back = [quads[0],quads[1],quads[2],quads[3],extras[2]];
						break;
				}
			}
		}

		return {hair,back,rule,brief};
	},
	
	// solve straight
	solveStraight:function(poker) {
		var straights = poker.straights;
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'straight:0-pair+joker' : 'straight:0-pair';
		var brief = 'straight';
		// whatever
		var result;

//		console.log('\ncards in hand: ',cards);
//		console.log('number of straights: ',straights.length);
		switch(straights.length) {
			// three straights means 7 card straight so use the lowest straight
			case 3:
				var straight = straights[2];
//				console.log('straight: ',straight);
				var extras = this.arrayDiff(cards,straight);
//				console.log('straight extras: ',extras);
				hair = extras;
				back = straight;
				break;
			// two straights
			case 2:
				var straight1 = straights[0];
				var straight2 = straights[1];
				// get the extras from each straight
				var extras1 = this.arrayDiff(cards,straight1);
				var extras2 = this.arrayDiff(cards,straight2);
//				console.log('extras1: ',extras1);
//				console.log('extras2: ',extras2);
				// if pairs are present (with 2 straights, only 1 pair possible)
				if (poker.pairs) {
					var pair = poker.pairs[0];
					rule = 'straight:1-pair';
//					console.log('pairs present: ',pair)
					// joker present
					if (joker) {
						rule = 'straight:1-pair+joker';
						// joker part of either set of extras means natural straight
						if (extras1.indexOf('joker_one') != -1 || extras2.indexOf('joker_one') != -1) {
							// if the first set of extras is a pair then use that one
							if (Card.getName(extras1[0]) == Card.getName(extras1[1])) {
								hair = extras1;
								back = straight1;
							} else {
								hair = extras2;
								back = straight2;
							}							
						} else {
							// otherwise joker part of straight along with pair so solve for pairs
	//						console.log('joker in straight with 1 pair, so we go by pair-pair rules');
							result = this.solvePairs(poker);
						}
					} else {
						// if the first set of extras is a pair then use that one
						if (Card.getName(extras1[0]) == Card.getName(extras1[1])) {
							hair = extras1;
							back = straight1;
						} else {
							hair = extras2;
							back = straight2;
						}
					}
				} else {
//					console.log('no pairs present');
					// if the joker is in the first set of extras
					if (extras1.indexOf('joker_one') != -1) {
						hair = extras1;
						back = straight1;
					} else {
						// otherwise use the lower straight
						hair = extras2;
						back = straight2;
					}
				}
				break;
			// one straight
			case 1:
				var straight = straights[0];
//				console.log('straight: ',straight);
				var extras = this.arrayDiff(cards,straight);
//				console.log('straight extras: ',extras);
				// trips present
				if (poker.trips) {
//					console.log('trips present: ',poker.trips[0]);
					hair = poker.trips[0];
					back = straight;
					rule = 'straight:trips';
				} else {
					// pairs present
					if (poker.pairs) {
						rule = 'straight:1-pair';
//						console.log('pairs present: ',poker.pairs.length);
						// one pair present
						if (poker.pairs.length == 1) {
							var pair = poker.pairs[0];
//							console.log('pair: ',pair);
							// pair inside straight
							if (straight.indexOf(pair[0]) != -1 || straight.indexOf(pair[1]) != -1) {
//								console.log('pair within the straight');
								extras = this.arrayDiff(extras,pair);
//								console.log('revised extras: ',extras);
								// joker not part of straight
								if (extras.indexOf('joker_one') != -1) {
//									console.log('joker not in straight, add to hair choice');
									hair = [pair[0],pair[1],'joker_one'];
									back = straight;
									rule = 'straight:1-pair+joker';
								} else {
//									console.log('joker in straight with 1 pair, so we go by pair-pair rules');
									result = this.solvePairs(poker);
								}
							}
						} else {
//							console.log('2 pairs so we go by pair-pair rules');
							result = this.solvePairs(poker);
						}
					} else {
						hair = [extras[0],extras[1]];
						back = straight;
					}
				}
				break;
			default:
//				console.log('default behaviour');
				hair = [cards[0],cards[2]];
				back = [cards[1],cards[3],cards[4],cards[5],cards[6]];
				break;
		}
		// result present means the hand was set from another function
		if (result) {
//			console.log('set hand from from outside function');
			hair = result.hair;
			back = result.back;
			rule = result.rule;
			brief = result.brief;
		}
//		console.log('final hair: ',hair);
//		console.log('final back: ',back);
		
		return {hair,back,rule,brief};
	},
	
	// flush
	solveFlush:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'flush:0-pair+joker' : 'flush:0-pair';
		var brief = 'flush';

		var flush = poker.flush;
		var extras = this.arrayDiff(cards,flush);
		switch(flush.length) {
			case 7:
				if (joker) {
					// high card + joker for pair on top, flush behind
					var jpos = flush.indexOf('joker_one');
					if (jpos != 0) {
						hair = [flush[0],flush[jpos]];
					} else {
						hair = [flush[1],flush[jpos]];
					}
					flush.forEach(function(key) {
						if (-1 === hair.indexOf(key)) {
							back.push(key);
						}
					},this);
					rule = 'flush:0-pair+joker';
					override = true;
				} else {
					// 2 high cards on top, flush behind
					hair = [flush[0],flush[1]];
					back = [flush[2],flush[3],flush[4],flush[5],flush[6]];
				}
				break;
			case 6:
				if (joker) {
					rule = 'flush:1-pair+joker';
					// 6 card flush + joker + pair
					if (poker.pairs) {
						var pair = poker.pairs[0];
						hair = [pair[0],pair[1]];
						back = [flush[0],flush[1],flush[3],flush[4],flush[5]];
					} else {
						hair = [extras[0],flush[0]];
						back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					}
				} else {
					hair = [flush[0],extras[0]];
					back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					rule = 'flush:1-pair';
				}
				break;
			case 5:
				if (poker.pairs) {
					// 2 pairs we run solve for pairs
					if (poker.pairs.length == 2) {
						result = this.solvePairs(poker);
					} else {
						// 1 pair + 5 card flush
						hair = [extras[0],extras[1]];
						back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
					}
				} else {
					hair = [extras[0],extras[1]];
					back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
				}
				break;
		}
		// result present means the hand was set from another function
		if (result) {
//			console.log('set hand from from outside function');
			hair = result.hair;
			back = result.back;
			rule = result.rule;
			brief = result.brief;
		}

		var override = false;

		// straight is also present so need to compare
		if (poker.result) {
			var result = poker.result;
			
			// straight hair is bigger, use straight
			if (Card.getRank(result.hair[0]) > Card.getRank(hair[0])) {
				override = true;
			}
			// 1st hair cards are equal compare the 2nd ones
			if (Card.getRank(result.hair[0]) == Card.getRank(hair[0])) {
				if (Card.getRank(result.hair[1]) > Card.getRank(hair[1])) {
					override = true;
				}
			}
			// 2nd flush hair card is joker means pair so use flush
			if (Card.getName(hair[1]) == 'joker') {
				override = false;
			}
		}
		
		return {hair,back,rule,brief,override};
	}
}
