Paigow = {
	/******************************************************************************************************************************************
		PAI-GOW RULES
	******************************************************************************************************************************************/
	rules:{
		'pai-gow':{
			'nothing':'When the hand contains no pairs, trips, quads, straights or flushes. Put the 2nd & 3rd highest cards in front',
			'nothing+joker':'When the hand contains no pairs, trips, quads, straights or flushes and you have a joker. Put the 1st and 3rd highest cards in the front and use the joker to make a pair with the 2nd high card'
		},
		'pairs':{
			'1-pair':'When the hand contains a pair, place the 1st & 2nd highest non-pair cards in hair',
			'2-pair':'When the hand contains 2 pairs and the high pair is Ace, King, or Queen then put the low pair in front\notherwise use the following chart:\nHigh pair: Jack, 10, 9 requires Ace or better to play 2 pair behind, otherwise low pair in front\nHigh Pair: 8, 7, 6 requires King or better to play 2 pair behind, otherwise low pair in front\nHigh Pair: 5 and below requires Queen or better to play 2 pair behind, otherwise low pair in front\n',
			'3-pair':'When the hand contains 3 pairs, place the highest pair in hair',
			'1-pair+joker':'When the hand contains 1 pair & joker. If the highest non-pair card is higher than the pair, put the pair in front and the high card + joker as a pair behind. Otherwise Put the high card + joker in front as a pair with the natural pair behind',
			'2-pair+joker':'When the hand contains 2 pair & joker. If the highest non-pair card is 3 ranks above the highest pair, put it in front with the joker to make 3 pairs. Otherwise put the high pair and front and use the joker to make trips behind',
			'3-pair+joker':'When the hand contains 3 pairs & joker. Put the highest pair in front and make a full house behind with the joker',
		},
		'trips':{
			'0-pair':'When the hand contains trips Aces. Put one of the Aces with the highest non-ace card in the front with pair of aces behind. Otherwise put the 1st & 2nd highest non-trip cards in front with the trips behind',
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
		},
		'straight-flush':{
			'0-pair':'When the hand contains a straight-flush place the highest 2 cards in the hair that will not break the straight-flush',
			'1-pair':'When the hand contains a straight-flush + pair place the highest 2 cards in the hair that will not break the straight-flush',
			'2-pair':'When the hand contains a straight-flush + 2 pairs, follow the pairs : 2-pair rule',
			'0-pair+joker':'When the hand contains a straight-flush + joker. Put the highest 2 cards in the hair that will not break the straight-flush',
			'1-pair+joker':'When the hand contains a straight-flush + pair + joker. Follow pairs : 2-pair rule',
			'2-pair+joker':'When the hand contains a straight-flush + 2 pairs + joker. Follow the pairs : 2-pair + joker rule',
		},
	},
	/******************************************************************************************************************************************
		UTILITY FUNCTIONS
	******************************************************************************************************************************************/
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
	// compare 2 results and return the higher one (for comparing straight vs flush)
	///////////////////////////////////////////////////////////////////////////////////////////////////
	compareResults:function(result1,result2) {
		var debug = true;
		var override = false;
//		console.log('comparing results');
//		console.log('result1: ',result1);
//		console.log('result2: ',result2);

		// result1 brief is not 'straight' or 'flush' means result1 came from outside solution
		if (result1.brief == 'straight' || result1.brief =='flush') {
			// result1 hair is paired up so use result1
			if (Cards.getName(result1.hair[0]) == Cards.getName(result1.hair[1])) {
//				console.log('result1 paired up');
				override = true;
			}
			// 2nd card of result2 hair is a joker means pair so use result1
			if (Cards.isJoker(result1.hair[1])) {
//				console.log('result1 paired up');
				override = true;
			}
		}
		// not paired and result1 hair is bigger, use result1
		if (Cards.getRank(result1.hair[0]) > Cards.getRank(result2.hair[0])) {
//			console.log('result1 hair bigger');
			override = true;
		}
		// not paired and 1st hair cards are equal compare the 2nd ones
		if (Cards.getRank(result1.hair[0]) == Cards.getRank(result2.hair[0])) {
			if (Cards.getRank(result1.hair[1]) > Cards.getRank(result2.hair[1])) {
//				console.log('result1 2nd hair bigger');
				override = true;
			}
		}
		// result2 brief is not 'straight' or 'flush' means result1 came from outside solution
		if (result2.brief == 'straight' || result2.brief == 'flush' || result2.brief == 'straight-flush') {
			// result2 hair is paired up so use result2
			if (Cards.getName(result2.hair[0]) == Cards.getName(result2.hair[1])) {
//				console.log('result2 paired up');
				override = false;
			}
			// 2nd result2 hair card is joker means pair so use result2
			if (Cards.isJoker(result2.hair[1])) {
//				console.log('result2 paired up');
				override = false;
			}
		}
		
		// if override means use result1
		if (override) {
//			console.log('using result1');
			result = result1;
		} else {
//			console.log('using result2');
			result = result2;
		}
		return result;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// set the description for the hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	setDescription:function(result) {
		var hair = result.hair;
		var back = result.back;
		var desc_hair = '';
		var desc_back = '';
		var hair_pair = false;
		// both hair cards match, pair on top
		if (Cards.getName(hair[0]) == Cards.getName(hair[1])) {
			desc_hair = 'pair of '+Cards.getName(hair[0]);
			hair_pair = true;
		} else {
			desc_hair = Cards.getName(hair[0])+', '+Cards.getName(hair[1]);
		}
		if (Cards.getRank(hair[0]) < Cards.getRank(hair[1])) {
			desc_hair = Cards.getName(hair[1])+', '+Cards.getName(hair[0]);
		}
		// if the 1st card is a joker, reverse the hair
		if (Cards.isJoker(hair[0])) {
			hair.reverse();
		}
		// if the 2nd card is a joker then pair up the hair
		if (Cards.isJoker(hair[1])) {
			desc_hair = 'pair of '+Cards.getName(hair[0]);
			hair_pair = true;
		}
		// the back
		switch(result.brief) {
			case '1-pair':
				desc_back = 'pair of '+Cards.getName(back[0]);
				break;
			case '2-pair':
				desc_back = '2-pair behind '+Cards.getName(back[0])+' & '+Cards.getName(back[2]);
				break;
			case 'trips':
				// trip aces get split so its a pair behind
				if (Cards.getName(back[0]) == 'ace' && Cards.getName(back[1]) == 'ace' && Cards.getName(back[2]) != 'ace') {
					desc_back = 'pair '+Cards.getName(back[0]);
				} else {
					desc_back = 'trip '+Cards.getName(back[0]);
				}
				break;
			case 'straight':
				desc_back = Cards.getName(back[0])+' high straight';
				break;
			case 'flush':
				desc_back = Cards.getName(back[0])+' high flush';
				break;
			case 'full house':
				desc_back = 'full house '+Cards.getName(back[0])+'s over '+Cards.getName(back[3])+'s';
				break;
			case 'quads':
				desc_back = 'quad '+Cards.getName(back[0])+'s';
				break;
			case 'straight-flush':
				desc_back = Cards.getName(back[0])+' high straight flush';
				// replace joker high with <card> high
				if (Cards.isJoker(back[0]) && result.brief == 'straight-flush') {
					var index = Cards.names.indexOf(Cards.getName(back[1]));
					var str = Cards.names[index+1];
					desc_back = desc_back.replace('joker',str);
				}
				// 1st card is ace or 2nd card is a king, then its a royal flush
				if (Cards.getName(back[0]) == 'ace' || Cards.getName(back[1]) == 'king') {
					desc_back = 'royal flush';
				}
				break;
			case '5 kind':
				desc_back = '5 of a kind '+Cards.getName(back[0])+'s';
				break;
			default:
				if (!Cards.isJoker(back[1])) {
					desc_back = Cards.getName(back[0])+' high';
				} else {
					desc_back = 'pair of '+Cards.getName(back[0]);
				}
				break;
		}
		// replace joker high with ace high in flushes
		if (Cards.isJoker(back[0]) && result.brief == 'flush') {
			desc_back = desc_back.replace('joker','ace');
		}
		// replace joker high with <card> high
		if (Cards.isJoker(back[0]) && result.brief == 'straight') {
			var index = Cards.names.indexOf(Cards.getName(back[1]));
			var str = Cards.names[index+1];
			desc_back = desc_back.replace('joker',str);
		}
		
		return desc_hair+' - '+desc_back;		
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// set the bonus for the hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	setBonus:function(poker,result) {
		var bonus;
		if (poker.straights) {
			bonus = 'straight';
		}
		if (poker.flush) {
			bonus = 'flush';
		}
		if (poker.straight_flush) {
			bonus = 'straight flush';
			// 1st card is ace or 2nd card is a king, then its a royal flush
			if (Cards.getName(result.back[0]) == 'ace' || Cards.getName(result.back[1]) == 'king') {
				bonus = 'royal flush';
			}
		} else if (poker.quads) {
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
			// trips with trips yields full house
			if (poker.trips.length != 1) {
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
		if (typeof bonus === 'undefined') {
			bonus = 'none';
		}
		return bonus;
	},
	/******************************************************************************************************************************************
		SOLVE FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// solve for pai-gow
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solve:function(poker) {
//		console.log('Paigow.solve: ');
//		console.table(poker);
		var bonus = '';

		// quads / trips get a match final
		var match_final = false;
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

		// the straight result
		var s_result;
		// the flush result
		var f_result;
		// solve for straight
		if (poker.straights) {
			result = this.solveStraight(poker);
			s_result = result;
//			console.log('Paigow.solve - post straights: ',result);
		}
		// solve for flush
		if (poker.flush) {
			result = this.solveFlush(poker);
			f_result = result;
//			console.log('Paigow.solve - post flush: ',result);
		}
		// compare the straight & flush and decide a winner
		if (poker.straights && poker.flush) {
//			console.log('s_result: ',s_result);
//			console.log('f_result: ',f_result);
			result = this.compareResults(s_result,f_result);
//			console.log('Paigow.solve - post compare: ',result);
		}
		// solve for straight flush
		if (poker.straight_flush) {
			var old_result = result;
			var new_result = this.solveStraightFlush(poker);
			result = this.compareResults(old_result,new_result);
//			console.log('Poker.solve - post straight_flush compare: ',result);
		}

		// no result from anything above, solve for nothing
		if (poker.nothing) {
			// no result, solve for nothing
			result = this.solveNothing(poker);
		}

		// set the description
		var desc = this.setDescription(result);
		result.desc = desc;

		// set the bonus
		var bonus = this.setBonus(poker,result);
		result.bonus = bonus;
		
		// debug text
		var debug = '';
		if (match_final) {
			debug += '{match final} ';
		}
		debug += 'rule: '+result.rule+'\n';
		debug += 'bonus: '+result.bonus+'\n';
		debug += result.desc+'\n';
		debug += result.hair.toString()+'\n'+result.back.toString();
		result.debug = debug;
		
//		console.log('final result');
//		console.table(result);
		return result;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// nothing
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solveNothing:function(poker) {
		var cards = poker.cards;
//		console.log('Poker.solveNothing: ',cards);
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
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// pairs
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solvePairs:function(poker) {
		var cards = poker.cards;
//		console.log('Poker.solvePairs: ',cards);
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
				var high_rank = Cards.getRank(high_card);
				var high_name = Cards.getName(high_card);
				
				var pair_card = pair1[0];
				var pair_rank = Cards.getRank(pair_card);
				var pair_name = Cards.getName(pair_card);
				if (joker) {
					rule = 'pairs:2-pair+joker';
					// high card is 3 ranks above high pair, make 3-pairs
					if (high_rank > pair_rank+2) {
						hair = [extras[0],extras[2]];
						back = [pair1[0],pair1[1],pair2[0],pair2[1],extras[1]];
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
							if (high_rank >= Cards.getRank('ace')) {
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
							if (high_rank >= Cards.getRank('king')) {
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
							if (high_rank >= Cards.getRank('queen')) {
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
					if (Cards.getRank(extras[0]) < Cards.getRank(all[0])) {
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
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	// trips
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	solveTrips:function(poker) {
		var cards = poker.cards;
//		console.log('Poker.solveTrips: ',cards);
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
				hair = trip1;
				// trip card is higher than the remainder then put in front of it
				if (Cards.getRank(trip1[0]) > Cards.getRank(extras[0])) {
					back = [trip2[0],trip2[1],trip2[2],trip1[2],extras[0]];
				} else {
					// otherwise put at the end
					back = [trip2[0],trip2[1],trip2[2],extras[0],trip1[2]];
				}
				// with a joker we get quads
				if (joker) {
					hair = trip1;
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
							if (Cards.getRank(extras[0]) > Cards.getRank(pair1[0])) {
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
						if (Cards.getName(trip1[0]) == 'ace') {
							hair = [extras[0],trip1[0],trip1[1],trip1[2]];
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
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	// quads
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solveQuads:function(poker) {
		var cards = poker.cards;
//		console.log('Poker.solveQuads: ',cards);
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
			hair = trip;
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
				if (Cards.getRank(pair[0]) > Cards.getRank(quads[0])) {
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
				var quad_name = Cards.getName(quads[0]);
				switch(quad_name) {
					// quad ace, king, queen always split
					case 'ace':
					case 'king':
					case 'queen':
						hair = quads;
						back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
						brief = '1-pair';
						break;
					// quad j,10,9 needs king or better
					case 'jack':
					case 'ten':
					case 'nine':
						if (Cards.getRank(extras[0]) >= Cards.getRank('king')) {
							hair = [extras[0],extras[1]];
							back = [quads[0],quads[1],quads[2],quads[3],extras[2]];
						} else {
							hair = quads;
							back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
							brief = '1-pair';
						}
						break;
					// quad 8,7,6 needs queen or better
					case 'eight':
					case 'seven':
					case 'six':
						if (Cards.getRank(extras[0]) >= Cards.getRank('queen')) {
							hair = [extras[0],extras[1]];
							back = [quads[0],quads[1],quads[2],quads[3],extras[2]];
						} else {
							hair = quads;
							back = [quads[2],quads[3],extras[0],extras[1],extras[2]];
							brief = '1-pair';
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// solve straight
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solveStraight:function(poker) {
		var straights = poker.straights;
		var cards = poker.cards;
//		console.log('Poker.solveStraight: ',cards);
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'straight:0-pair+joker' : 'straight:0-pair';
		var brief = 'straight';
		// whatever
		var result;

//		console.log('\n\n\ncards in hand: ',cards);
//		console.log('number of straights: ',straights.length);
//		console.table(straights);
		switch(straights.length) {
			// three straights means 7 card straight so use the lowest straight
			case 3:
				var straight = straights[2];
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
							if (Cards.getName(extras1[0]) == Cards.getName(extras1[1])) {
								hair = extras1;
								back = straight1;
							} else {
								hair = extras2;
								back = straight2;
							}
						} else {
							// otherwise joker part of straight along with pair so solve for pairs
//							console.log('joker in straight with 1 pair, so we go by pair-pair rules');
							result = this.solvePairs(poker);
						}
					} else {
						// if the first set of extras is a pair then use that one
						if (Cards.getName(extras1[0]) == Cards.getName(extras1[1])) {
							hair = extras1;
							back = straight1;
						} else {
							hair = this.arrayDiff(extras2,pair);
							hair.push(pair[0])
							hair.push(pair[1]);
							back = straight2;
						}
						
					}
				} else {
					// if the joker is in the first set of extras
					if (extras1.indexOf('joker_one') != -1) {
						hair = extras1;
						back = straight1;
					} else {
						// otherwise use the lower straight
						hair = extras2;
						back = straight2;
					}
				
					// joker is 2nd card in both extras means both are paired up
					if (Cards.isJoker(extras1[1]) && Cards.isJoker(extras2[1])) {
						// first extras is higher use that one
						if (Cards.getRank(extras1[0]) > Cards.getRank(extras2[0])) {
							hair = extras1;
							back = straight1;
						} else {
							// otherwise use the lower straight
							hair = extras2;
							back = straight2;
						}
					} else {
						// if 1st hair is bigger than 2nd hair
						if (Cards.getRank(extras1[0]) > Cards.getRank(extras2[0])) {
							hair = extras1;
							back = straight1;
							
						}
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
						// one pair present
//						console.log('pairs present: ',poker.pairs.length);
						if (poker.pairs.length == 1) {
							var pair = poker.pairs[0];
//							console.log('pair: ',pair);
							// pair inside straight
							if (straight.indexOf(pair[0]) != -1 || straight.indexOf(pair[1]) != -1) {
//								console.log('pair within the straight');
								extras = this.arrayDiff(extras,pair);
//								console.log('revised extras: ',extras);
								if (joker) {
//									console.log('joker present');
									// joker not part of straight
									if (extras.indexOf('joker_one') != -1) {
//										console.log('joker not in straight, add to hair choice');
										hair = [pair[0],pair[1],'joker_one'];
										back = straight;
										rule = 'straight:1-pair+joker';
									} else {
//										console.log('joker in straight with 1 pair, so we go by pair-pair rules');
										result = this.solvePairs(poker);
									}									
								} else {
//									console.log('no joker - straight with 1 pair, just play the straight');
//									console.log(extras,pair);
									hair = [extras[0],pair[0],pair[1]];
									back = straight;
								}
							} else {
								// pair outside of straight so play pair & straight
								hair = pair;
								back = straight;
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
		if (typeof result !== 'undefined') {
//			console.log('set hand from from outside function');
			hair = result.hair;
			back = result.back;
			rule = result.rule;
			brief = result.brief;
		}
//		console.log('final hair: ',hair);
//		console.log('final back: ',back,'\n\n');
	
		return {hair,back,rule,brief};
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////	
	// flush
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solveFlush:function(poker) {
		var cards = poker.cards;
//		console.log('Poker.solveFlush: ',cards);
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'flush:0-pair+joker' : 'flush:0-pair';
		var brief = 'flush';
		var result;

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
					back = this.arrayDiff(flush,hair);
					rule = 'flush:0-pair+joker';
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
						hair = pair;
						back = this.arrayDiff(flush,hair);
					} else {
						hair = [extras[0],flush[0]];
						back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					}
				} else {
					if (poker.pairs) {
						var pair = poker.pairs[0];
						hair = pair;
						back = this.arrayDiff(flush,hair);
						rule = 'flush:1-pair';
					} else {
						hair = [extras[0],flush[0]];
						back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					}
				}
				break;
			case 5:
				if (poker.pairs) {
					// 2 pairs we run solve for pairs
					if (poker.pairs.length == 2) {
						result = this.solvePairs(poker);
					} else {
						if (joker) {
							var pair = poker.pairs[0];
							// pair is part of the flush then solve for pairs
							if (flush.indexOf(pair[0]) != -1 || flush.indexOf(pair[1]) != -1) {
								result = this.solvePairs(poker);
							} else {
								// otherwise set pair & flush
								hair = pair;
								back = flush;
							}
						} else {
							// 1 pair + 5 card flush
							hair = [extras[0],extras[1]];
							back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
						}
					}
				} else {
					hair = [extras[0],extras[1]];
					back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
				}
				break;
		}
		// result present means the hand was set from another function
		if (typeof result !== 'undefined') {
			hair = result.hair;
			back = result.back;
			rule = result.rule;
			brief = result.brief;
		}
		return {hair,back,rule,brief};
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// straight flush
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solveStraightFlush:function(poker) {
		var straight_flushes = poker.straight_flush;
		var cards = poker.cards;
//		console.log('Poker.solveStraightFlush: ',cards);
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = (joker) ? 'straight-flush:0-pair+joker' : 'straight-flush:0-pair';
		var brief = 'straight-flush';
		// whatever
		var result;

//		console.log('\ncards in hand: ',cards);
//		console.log('number of straight_flushes: ',straight_flushes.length);
		switch(straight_flushes.length) {
			// three straight_flushes means 7 card straight_flush so use the lowest straight_flush
			case 3:
				var straight_flush = straight_flushes[2];
//				console.log('straight_flush: ',straight_flush);
				var extras = this.arrayDiff(cards,straight_flush);
//				console.log('straight_flush extras: ',extras);
				hair = extras;
				back = straight_flush;
				break;
			// two straight_flushes
			case 2:
				var straight_flush1 = straight_flushes[0];
				var straight_flush2 = straight_flushes[1];
				// get the extras from each straight
				var extras1 = this.arrayDiff(cards,straight_flush1);
				var extras2 = this.arrayDiff(cards,straight_flush2);
//				console.log('extras1: ',extras1);
//				console.log('extras2: ',extras2);
				// if pairs are present (with 2 straight_flushes, only 1 pair possible)
				if (poker.pairs) {
					var pair = poker.pairs[0];
					rule = 'straight_flush:1-pair';
//					console.log('pairs present: ',pair)
					// joker present
					if (joker) {
						rule = 'straight_flush:1-pair+joker';
						// joker part of either set of extras means natural straight_flush
						if (extras1.indexOf('joker_one') != -1 || extras2.indexOf('joker_one') != -1) {
							// if the first set of extras is a pair then use that one
							if (Cards.getName(extras1[0]) == Cards.getName(extras1[1])) {
								hair = extras1;
								back = straight_flush1;
							} else {
								hair = extras2;
								back = straight_flush2;
							}							
						} else {
							// otherwise joker part of straight_flush along with pair so solve for pairs
//							console.log('joker in straight_flush with 1 pair, so we go by pair-pair rules');
							result = this.solvePairs(poker);
						}
					} else {
						// if the first set of extras is a pair then use that one
						if (Cards.getName(extras1[0]) == Cards.getName(extras1[1])) {
							hair = extras1;
							back = straight_flush1;
						} else {
							hair = extras2;
							back = straight_flush2;
						}
					}
				} else {
//					console.log('no pairs present');
					// if the joker is in the first set of extras
					if (extras1.indexOf('joker_one') != -1) {
						hair = extras1;
						back = straight_flush1;
					} else {
						// otherwise use the lower straight
						hair = extras2;
						back = straight_flush2;
					}
				}
				break;
			// one straight
			case 1:
				var straight_flush = straight_flushes[0];
//				console.log('straight_flush: ',straight_flush);
				var extras = this.arrayDiff(cards,straight_flush);
//				console.log('straight_flush extras: ',extras);
				// trips present
				if (poker.trips) {
//					console.log('trips present: ',poker.trips[0]);
					hair = this.arrayDiff(cards,straight_flush);
					back = straight_flush;
					rule = 'straight_flush:trips';
				} else {
					// pairs present
					if (poker.pairs) {
						rule = 'straight_flush:1-pair';
//						console.log('pairs present: ',poker.pairs.length);
						// one pair present
						if (poker.pairs.length == 1) {
							var pair = poker.pairs[0];
//							console.log('pair: ',pair);
							// pair inside straight_flush
							if (straight_flush.indexOf(pair[0]) != -1 || straight_flush.indexOf(pair[1]) != -1) {
//								console.log('pair within the straight_flush');
								extras = this.arrayDiff(extras,pair);
//								console.log('revised extras: ',extras);
								if (joker) {
//									console.log('joker present');
									// joker not part of straight_flush
									if (extras.indexOf('joker_one') != -1) {
//										console.log('joker not in straight_flush, add to hair choice');
										hair = this.arrayDiff(cards,straight_flush);
										back = straight_flush;
										rule = 'straight_flush:1-pair+joker';
									} else {
//										console.log('joker in straight_flush with 1 pair, so we go by pair-pair rules');
										result = this.solvePairs(poker);
									}
								} else {
//									console.log('no joker - straight flush with pair, just play straight flush');
									hair = this.arrayDiff(cards,straight_flush);
									back = straight_flush;
								}
							}
						} else {
//							console.log('2 pairs so we go by pair-pair rules');
							result = this.solvePairs(poker);
						}
					} else {
						hair = [extras[0],extras[1]];
						back = straight_flush;
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
		if (typeof result !== 'undefined') {
			hair = result.hair;
			back = result.back;
			rule = result.rule;
			brief = result.brief;
		}

		return {hair,back,rule,brief};
	}
}
