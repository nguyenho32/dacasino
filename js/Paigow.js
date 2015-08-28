Paigow = {
	solve:function(poker) {
		var override = false;
		// solve for nothing
		if (poker.nothing) {
			result = this.solveNothing(poker);
		}
		// solve for pairs
		if (poker.pairs) {
			result = this.solvePairs(poker);
			// override straight / flush if we have 2 pairs or 1 pair + joker
			if (poker.pairs.length == 2) {
				override = true;
			}
			if (poker.pairs.length == 1 && poker.joker) {
				override = true;
			}
		}
		// solve for trips
		if (poker.trips) {
			result = this.solveTrips(poker);
		}
		// solve for quads
		if (poker.quads) {
			result = this.solveQuads(poker);
		}

		// no override (2 pairs / 1 pair + joker)
		if (poker.flush) {
			// override set but 6 card flush means we are going to set pair & flush
			if (override && poker.flush.length == 6) {
				override = false;
			}
			if (!override) {
				result = this.solveFlush(poker);
				if (result.override) {
					override = true;
				}
			}
		}
		if (!override) {
			// solve for straight
			if (poker.straight) {
				result = this.solveStraight(poker);
			}
		}

		/*
			 add the description
		*/
		var hair = result.hair;
		var back = result.back;
		var desc_hair = '';
		var desc_back = '';
		// both hair cards match, pair on top
		if (Card.getName(hair[0]) == Card.getName(hair[1])) {
			desc_hair = 'pair of '+Card.getName(hair[0]);
		} else {
			desc_hair = Card.getName(result.hair[0])+' - '+Card.getName(hair[1]);
		}
		// if the 1st card is a joker, reverse the hair
		if (Card.getName(hair[0]) == 'joker') {
			hair.reverse();
		}
		// if the 2nd card is a joker then pair up the hair
		if (Card.getName(hair[1]) == 'joker') {
			desc_hair = 'pair of '+Card.getName(hair[0]);
		}
		// the back
		switch(result.brief) {
			case 'pair':
				desc_back = 'pair of '+Card.getName(back[0]);
				break;
			case '2 pair':
				desc_back = '2 pair behind '+Card.getName(back[0])+' & '+Card.getName(back[2]);
				break;
			case 'trip':
				desc_back = 'trip '+Card.getName(back[0]);
				break;
			case 'full house':
				desc_back = 'full house behind '+Card.getName(back[0])+'s over '+Card.getName(back[3])+'s'; 
				break;
			case 'straight':
				desc_back = Card.getName(back[0])+' high straight';
				break;
			case 'flush':
				desc_back = Card.getName(back[0])+' high flush';
				break;
			case 'quad':
				desc_back = 'quad '+Card.getName(back[0])+'s';
				break;
			case '5 kind':
				desc_back = '5 of a kind '+Card.getName(back[0])+'s';
				break;
			default:
				desc_back = Card.getName(back[0])+' high';
				break;
		}
		// replace joker high with ace high
		if (Card.getName(back[0]) == 'joker') {
			desc_back = desc_back.replace('joker','ace');
		}

		result.desc = desc_hair+', '+desc_back;
		
		// debug text
		result.debug = 'rule: '+result.rule+'\n'+result.desc;
		result.debug += '\n\n'+result.hair.toString()+'\n'+result.back.toString();

		return result;
	},
	
	// nothing
	solveNothing:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = '';

		if (joker) {
			// 1st & 3rd high card in hair, 2nd high + joker for pair
			hair = [cards[0],cards[2]];
			back = [cards[1],cards[6],cards[3],cards[4],cards[5]];
			rule = '(joker) nothing';
		} else {
			// 2nd & 3rd high card in hair, rest behind
			hair = [cards[1],cards[2]];
			back = [cards[0],cards[3],cards[4],cards[5],cards[6]];
			rule = 'nothing';
		}
		
		return {hair,back,rule};
	},
	
	// pairs
	solvePairs:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = '';
		var brief = '';
		
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
		var diff = [];
		cards.forEach(function(key) {
			if (-1 === all.indexOf(key)) {
				diff.push(key);
			}
		},this);
		switch(pairs.length) {
			case 3:
				if (joker) {
					// put high pair in front, make full house behind
					hair = pair1;
					back = [pair2[0],pair2[1],diff[0],pair3[0],pair3[1]];
					rule = '(joker) 3 pair';
					brief = 'full house';
				} else {
					// no joker so put high pair in front, everything else behind
					hair = pair1;
					back = [pair2[0],pair2[1],pair3[0],pair3[1],diff[0]];
					rule = '3 pair';
					brief = '2 pair';
				}
				break;
			case 2:
				// no trips or quads
				if (poker.trips || poker.quads) {
					break;
				}
				var high_card = diff[0];
				var high_rank = Card.getRank(high_card);
				var high_name = Card.getName(high_card);
				
				var pair_card = pair1[0];
				var pair_rank = Card.getRank(pair_card);
				var pair_name = Card.getName(pair_card);
				if (joker) {
					// high card is 3 ranks above high pair, make 3 pairs
					if (high_rank > pair_rank+2) {
						hair = [diff[0],diff[2]];
						back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[0]];
						rule = '(joker) pair pair / high card below ranks';
						brief = '2 pair';
					} else {
						//  otherwise make trips
						hair = pair1;
						back = [pair2[0],pair2[1],diff[2],diff[0],diff[1]];
						rule = '(joker) pair-pair / high card 3 ranks';
						brief = 'trip';
					}
				} else {
					switch(pair_name) {
						// ace, king, queen always split
						case 'ace':
						case 'king':
						case 'queen':
							hair = pair2;
							back = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
							rule = 'pair-pair / a,k,q';
							brief = 'pair';
							break;
						// jack, 10, 9 requires ace
						case 'jack':
						case 'ten':
						case 'nine':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('ace')) {
								hair = [diff[0],diff[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								rule = 'pair-pair / j,10,9 with ace';
								brief = '2 pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								rule = 'pair-pair / j,10,9 no ace';
								brief = 'pair';
							}
							break;
						// 8,7,6 requires king or better
						case 'eight':
						case 'seven':
						case 'six':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('king')) {
								hair = [diff[0],diff[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								rule = 'pair-pair / 8,7,6 with king';
								brief = '2 pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								rule = 'pair-pair / 8,7,6 no king';
								brief = 'pair';
							}
							break;
						// 5,4,3,2 requires queen or better
						case 'five':
						case 'four':
						case 'three':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('queen')) {
								hair = [diff[0],diff[1]];
								back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								rule = 'pair-pair / 5 below with queen';
								brief = '2 pair';
							} else {
								// otherwise pair pair
								hair = pair2;
								back = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								rule = 'pair-pair / 5 below no queen';
								brief = 'pair';
							}
							break;
					}
				}
				break;
			case 1:
				if (joker) {
					// high card is lower than pair, put in front with joker
					if (Card.getRank(diff[0]) < Card.getRank(all[0])) {
						hair = [diff[0],diff[4]];
						back = [all[0],all[1],diff[1],diff[2],diff[3]];
						rule = '(joker) 1 pair / hi card less';
						brief = 'pair';
					} else {
						// otherwise put pair in front and high card in back with joker
						hair = [all[0],all[1]];
						back = [diff[0],diff[4],diff[1],diff[2],diff[3]];
						rule = '(joker) 1 pair / hi card more';
						brief = 'pair';
					}
				} else {
					// no joker so put 1st & 2nd high card in front with pair behind
					hair = [diff[0],diff[1]];
					back = [all[0],all[1],diff[2],diff[3],diff[4]];
					rule = '1 pair';
					brief = 'pair';
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
		var rule = '';
		var brief = '';

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
		var diff = [];
		cards.forEach(function(key) {
			if (-1 === all.indexOf(key)) {
				diff.push(key);
			}
		},this);
		
		switch(trips.length) {
			case 2:
				hair = [trip1[0],trip1[1]];
				// trip card is higher than the remainder then put in front of it
				if (Card.getRank(trip1[0]) > Card.getRank(diff[0])) {
					back = [trip2[0],trip2[1],trip2[2],trip1[2],diff[0]];
				} else {
					// otherwise put at the end
					back = [trip2[0],trip2[1],trip2[2],diff[0],trip1[2]];
				}
				rule = 'double trips';
				brief = 'trip';
				// with a joker we get quads
				if (joker) {
					back = [trip2[0],trip2[1],trip2[2],diff[0],trip1[2]];
					rule = '(joker) double trips';
					brief = 'quad';
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
					var diff = [];
					cards.forEach(function(key) {
						if (-1 === all.indexOf(key)) {
							diff.push(key);
						}
					},this);
					// 2 pairs, full house behind
					if (pairs.length > 1) {
						hair = pair1;
						back = [trip1[0],trip1[1],trip1[2],pair2[0],pair2[1]];
						rule = 'single trip w/ 2 pair';
						brief = 'full house';
					} else {
						if (joker) {
							// if high card is above pair, put in front with joker and full house behind
							if (Card.getRank(diff[0]) > Card.getRank(pair1[0])) {
								hair = [diff[0],diff[1]];
								back = [trip1[0],trip1[1],trip1[2],pair1[0],pair1[1]];
								rule = '(joker) single trip w/ pair & high card';
								brief = 'full house';
							} else {
								// otherwise put pair in front with quads behind
								hair = pair1;
								back = [trip1[0],trip1[1],trip1[2],diff[1],diff[0]];
								rule = '(joker) single trip w/ pair';
								brief = 'quad';
							}
						} else {
							// pair in front, trips behind
							hair = pair1;
							back = [trip1[0],trip1[1],trip1[2],diff[0],diff[1]];
							rule = 'single trip w/ pair';
							brief = 'trip';
						}
					}
				} else {
					if (joker) {
						// joker with high card to make pair in front, trips behind
						hair = [diff[0],diff[3]];
						back = [trip1[0],trip1[1],trip1[2],diff[1],diff[2]];
						rule = '(joker) single trip';
						brief = 'trip';
					} else {
						// trip aces split
						if (Card.getName(trip1[0]) == 'ace') {
							hair = [trip1[0],diff[0]];
							back = [trip1[1],trip1[2],diff[1],diff[2],diff[3]];
							rule = 'single trip / split aces';
							brief = 'trip';
						} else {
							// 1st & 2nd high card in front, trips behind
							hair = [diff[0],diff[1]];
							back = [trip1[0],trip1[1],trip1[2],diff[2],diff[3]];
							rule = 'single trip';
							brief = 'trip';
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
		var rule = '';
		var brief = '';

		var quad = poker.quads[0];
		var diff = [];
		cards.forEach(function(key) {
			if (-1 === quad.indexOf(key)) {
				diff.push(key);
			}
		},this);
		// have trips
		if (poker.trips) {
			var trip = poker.trips[0];

			hair = [trip[0],trip[1]];
			back = [quad[0],quad[1],quad[2],quad[3],trip[2]];
			rule = 'quads / trips';
			brief = 'quad';
		}
		// have a pair
		else if (poker.pairs) {
			var pair = poker.pairs[0];
			var new_diff = [];
			diff.forEach(function(key) {
				if (-1 === pair.indexOf(key)) {
					new_diff.push(key);
				}
			},this);
			diff = new_diff;
			
			if (joker) {
				// pair is bigger than quad so make 5 of a kind
				if (Card.getRank(pair[0]) > Card.getRank(quad[0])) {
					hair = [pair[0],pair[1]];
					back = [quad[0],quad[1],quad[2],quad[3],diff[0]];
					rule = '(joker) quads / pair / 5 of a kind';
					brief = '5 kind';
				} else {
					// quad is bigger so make full house
					hair = [quad[0],quad[1]];
					back = [quad[0],quad[1],diff[0],pair[0],pair[1]];
					rule = '(joker) quads / pair / full house';
					brief = 'full house';
				}
			} else {
				// quads + pair
				hair = [pair[0],pair[1]];
				back = [quad[0],quad[1],quad[2],quad[3],diff[0]];
				rule = 'quads / pair';
				brief = 'quad';
			}
		} else {
			// just have quads
			if (joker) {
				hair = [diff[0],diff[2]];
				back = [quad[0],quad[1],quad[2],quad[3],diff[1]];
				rule = '(joker) quads / no pairs';
				brief = 'quad';
			} else {
				// quads without a joker follow some rules
				var quad_name = Card.getName(quad[0]);
				switch(quad_name) {
					// quad ace, king, queen always split
					case 'ace':
					case 'king':
					case 'queen':
						hair = [quad[0],quad[1]];
						back = [quad[2],quad[3],diff[0],diff[1],diff[2]];
						rule = 'quads / a,k,q';
						brief = 'pair';
						break;
					// quad j,10,9 needs king or better
					case 'jack':
					case 'ten':
					case 'nine':
						if (Card.getRank(diff[0]) >= Card.getRank('king')) {
							hair = [diff[0],diff[1]];
							back = [quad[0],quad[1],quad[2],quad[3],diff[2]];
							rule = 'quads / j,10,9 qualify';
							brief = 'quad';
						} else {
							hair = [quad[0],quad[1]];
							back = [quad[2],quad[3],diff[0],diff[1],diff[2]];
							rule = 'quads / j,10,9 no qualify';
							brief = 'pair';
						}
						break;
					// quad 8,7,6 needs queen or better
					case 'eight':
					case 'seven':
					case 'six':
						if (Card.getRank(diff[0]) >= Card.getRank('queen')) {
							hair = [diff[0],diff[1]];
							back = [quad[0],quad[1],quad[2],quad[3],diff[2]];
							rule = 'quads / 8,7,6 qualify';
							brief = 'quad';
						} else {
							hair = [quad[0],quad[1]];
							back = [quad[2],quad[3],diff[0],diff[1],diff[2]];
							rule = 'quads / 8,7,6 no qualify';
							brief = 'pair';
						}
						break;
					// 5 and below never split
					case 'five':
					case 'four':
					case 'three':
					case 'two':
						hair = [diff[0],diff[1]];
						back = [quad[0],quad[1],quad[2],quad[3],diff[2]];
						rule = 'quads / 5 and below';
						brief = 'quad';
						break;
				}
			}
		}

		return {hair,back,rule,brief};
	},
	
	// straight
	solveStraight:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = '';

		var straight = poker.straight;
		var diff = [];
		cards.forEach(function(key) {
			if (-1 === straight.indexOf(key)) {
				diff.push(key);
			}
		},this);
		switch(straight.length) {
			case 7:
				hair = [straight[0],straight[1]];
				if (joker && hair[0] == 'joker_one') {
					hair.reverse();
				}
				back = [straight[2],straight[3],straight[4],straight[5],straight[6]];
				if (joker) {
					// 2nd hair card is joker means we have a pair on top
					if (Card.getName(hair[1]) == 'joker') {
						rule = '(joker) 7 card straight / paired up';
					} else {
						// otherwise joker is part of the straight
						rule = '(joker) 7 card straight';
					}
					
					// special case if joker if joker is 5th position (natural straight ahead of it)
					if (straight.indexOf('joker_one') == 5) {
						hair = [straight[6],straight[5]];
						back = [straight[0],straight[1],straight[2],straight[3],straight[4]];
						rule = '(joker) 7 card straight / natural';
					}
					// special case if joker is at the top and ace is at the bottom of the straight
					if (Card.getName(straight[0]) == 'joker' && Card.getName(straight[6]) == 'ace') {
						hair = [straight[6],straight[0]];
						back = [straight[1],straight[2],straight[3],straight[4],straight[5]];
						rule = '(joker) 7 card straight w/ ace low';
					}
					// special case if joker is at the bottom and ace is at the top of the straight
					if (Card.getName(straight[6]) == 'joker' && Card.getName(straight[0]) == 'ace') {
						hair = [straight[0],straight[6]];
						back = [straight[1],straight[2],straight[3],straight[4],straight[5]];
						rule = '(joker) 7 card straight w/ ace high';
					}
				} else {
					rule = '7 card straight';
				}
				break;
			case 6:
				// if non-straight card is higher than first straight card, put first in hair
				if (Card.getRank(diff[0]) > Card.getRank(straight[0])) {
					hair = [diff[0],straight[0]];
				} else {
					hair = [straight[0],diff[0]];
				}
				back = [straight[1],straight[2],straight[3],straight[4],straight[5]];
				if (joker) {
					if (hair[1] == 'joker_one') {
						rule = '(joker) 6 card straight / paired up';
					} else {
						rule = '(joker) 6 card straight';
					}
				} else {
					rule = '6 card straight';
				}
				break;
			case 5:
				// put the 2 non straight cards in the hair
				hair = [diff[0],diff[1]];
				back = [straight[0],straight[1],straight[2],straight[3],straight[4]];
				if (joker) {
					rule = '(joker) 5 card straight';
				} else {
					rule = '5 card straight';
				}
				break;
		}
		var brief = 'straight';
		
		return {hair,back,rule,brief};
	},	
	
	// flush
	solveFlush:function(poker) {
		var cards = poker.cards;
		var joker = poker.joker;
		var hair = [];
		var back = [];
		var rule = '';

		var flush = poker.flush;
		var diff = [];
		cards.forEach(function(key) {
			if (-1 === flush.indexOf(key)) {
				diff.push(key);
			}
		},this);
		switch(flush.length) {
			case 7:
				hair = [flush[0],flush[1]];
				back = [flush[2],flush[3],flush[4],flush[5],flush[6]];
				if (joker) {
					rule = '(joker) 7 card flush';
				} else {
					rule = '7 card flush';
				}
				break;
			case 6:
				if (joker) {
					hair = [diff[0],flush[0]];
					back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					rule = '(joker) 6 card flush';
				} else {
					hair = [flush[0],diff[0]];
					back = [flush[1],flush[2],flush[3],flush[4],flush[5]];
					rule = '6 card flush';
				}
				break;
			case 5:
				hair = [diff[0],diff[1]];
				back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
				if (joker) {
					rule = '(joker) 5 card flush';
				} else {
					rule = '5 card flush';
				}
				break;
		}
		// straight is also present so need to compare
		var override = false;
		if (poker.straight) {
			console.log('\nstraight also present');
			var straight = poker.straight;
			var s_diff = [];
			cards.forEach(function(key) {
				if (-1 === straight.indexOf(key)) {
					s_diff.push(key);
				}
			},this);
			// straight hair card is lower than the flush hair card
			if (s_diff[0]) {
				console.log('straight hair ',s_diff);
				console.log('flush hair ',hair);
				if (Card.getRank(s_diff[0]) < Card.getRank(hair[0])) {
					console.log('straight hair is lower so flush overrides');
					override = true;
				}
				if (Card.getRank(s_diff[0]) == Card.getRank(hair[0])) {
					console.log('both hair the same so compare next hair cards');
					if (s_diff[1]) {
						console.log('s_diff');
					}
				}
				if (Card.getRank(s_diff[0]) > Card.getRank(hair[0])) {
					console.log('straight hair higher, no override');
				}
			}
		}
		
		var brief = 'flush';
		
		return {hair,back,rule,brief,override};
	}
}
