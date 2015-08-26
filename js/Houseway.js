Houseway = {
	solve:function(poker) {
		var cards = poker.cards.slice();
		var houseway = {};
		var debug = '';
		
		console.log('incoming poker solution: ',poker);

		// flush
		if (poker.flush) {
			var flush = poker.flush;
			var diff = [];
			cards.forEach(function(key) {
				if (-1 === flush.indexOf(key)) {
					diff.push(key);
				}
			},this);
			switch(flush.length) {
				case 7:
					houseway.hair = [flush[0],flush[1]];
					houseway.back = [flush[2],flush[3],flush[4],flush[5],flush[6]];
					houseway.rule = 'flush';
					houseway.desc = Card.getName(flush[0])+' - '+Card.getName(flush[1])+', '+Card.getName(flush[2])+' high flush';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
				case 6:
					houseway.hair = [flush[0],diff[0]];
					houseway.back = [flush[2],flush[3],flush[4],flush[5],flush[6]];
					houseway.rule = 'flush';
					houseway.desc = Card.getName(flush[0])+' - '+Card.getName(diff[0])+', '+Card.getName(flush[1])+' high flush';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
				case 5:
					houseway.hair = [diff[0],diff[1]];
					houseway.back = [flush[0],flush[1],flush[2],flush[3],flush[4]];
					houseway.rule = 'flush';
					houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', '+Card.getName(flush[0])+' high flush';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
			}
		}

		// straight
		if (poker.straight) {
			var straight = poker.straight;
			var diff = [];
			cards.forEach(function(key) {
				if (-1 === straight.indexOf(key)) {
					diff.push(key);
				}
			},this);
			switch(straight.length) {
				case 7:
					houseway.hair = [straight[0],straight[1]];
					houseway.back = [straight[2],straight[3],straight[4],straight[5],straight[6]];
					houseway.rule = 'straight';
					houseway.desc = Card.getName(straight[0])+' - '+Card.getName(straight[1])+', '+Card.getName(straight[2])+' high straight';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
				case 6:
					houseway.hair = [straight[0],diff[0]];
					houseway.back = [straight[2],straight[3],straight[4],straight[5],straight[6]];
					houseway.rule = 'straight';
					houseway.desc = Card.getName(straight[0])+' - '+Card.getName(diff[0])+', '+Card.getName(straight[1])+' high straight';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
				case 5:
					houseway.hair = [diff[0],diff[1]];
					houseway.back = [straight[0],straight[1],straight[2],straight[3],straight[4]];
					houseway.rule = 'straight';
					houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', '+Card.getName(straight[0])+' high straight';
					
					debug = houseway.rule+': '+houseway.desc;
					break;
			}
		}

		// trips
		if (poker.trips) {
			var trips = poker.trips;
			var trip1 = trips[0];
			var all = trip1;
			if (trips[1]) {
				trip2 = trips[1];
				ll.concat(trip2);
			}
			var diff = [];
			cards.forEach(function(key) {
				if (-1 === all.indexOf(key)) {
					diff.push(key);
				}
			},this);
			
			switch(trips.length) {
				case 2:
					houseway.hair = trip2;
					houseway.back = [trip[0],trip[1],trip[2]];
					houseway.rule = 'double trips';
					houseway.desc = 'pair '+Card.getName(trip2[0])+', trip '+Card.getName(trip1[0]);

					debug = houseway.rule+': '+houseway.desc;
					break;
				default:
					// pair exists
					if (poker.pairs) {
						var pairs = poker.pairs;
						var pair1 = pairs[0];
						all.concat(pair1);
						var diff = [];
						cards.forEach(function(key) {
							if (-1 === all.indexOf(key)) {
								diff.push(key);
							}
						},this);
						
						houseway.hair = pair1;
						houseway.back = [trip1[0],trip1[1],trip1[2],diff[0],diff[1]];
						houseway.rule = 'single trip - pairs exist';
						houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', trip '+Card.getName(trip1[0]);

						debug = houseway.rule+': '+houseway.desc;
					} else {
						
						houseway.hair = [diff[0],diff[1]];
						houseway.back = [trip1[0],trip1[1],trip1[2],diff[2],diff[3]];
						houseway.rule = 'single trip - no pairs';
						houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', trip '+Card.getName(trip1[0]);

						debug = houseway.rule+': '+houseway.desc;
					}
					break;
			}
		}
		
		// pairs
		if (poker.pairs) {
			var pairs = poker.pairs;
			var pair1 = pairs[0];
			var all = pair1;
			if (pairs[1]) {
				pair2 = pairs[1];
				all.concat(pair2);
			}
			if (pairs[2]) {
				pair3 = pairs[2];
				all.concat(pair3);
			}
			var diff = [];
			cards.forEach(function(key) {
				if (-1 === all.indexOf(key)) {
					diff.push(key);
				}
			},this);

			switch(pairs.length) {
				case 3:
					houseway.hair = pair1;
					houseway.back = [pair2[0],pair2[1],pair3[0],pair3[1],diff[0]];
					houseway.rule = '3 pair';
					houseway.desc = 'pair '+Card.getName(pair1[0])+', over pair-pair '+Card.getName(pair2[0])+' / '+Card.getName(pair3[0]);

					debug = houseway.rule+': '+houseway.desc;
					break;
				case 2:
					var high_card = diff[0];
					var high_rank = Card.getRank(high_card);
					var high_name = Card.getName(high_card);
					
					var pair_card = pair1[0];
					var pair_rank = Card.getRank(pair_card);
					var pair_name = Card.getName(pair_card);
					switch(pair_name) {
						// ace, king, queen always split
						case 'ace':
						case 'king':
						case 'queen':
							houseway.high = pair2;
							houseway.back = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
							houseway.rule = 'pair-pair (queen or better)';
							houseway.desc = 'pair '+Card.getName(pair2[0])+' - pair '+Card.getName(pair1[0]);
							
							debug = houseway.rule+': '+houseway.desc;
							break;
						// jack, 10, 9 requires ace
						case 'jack':
						case 'ten':
						case 'nine':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('ace')) {
								houseway.high = [diff[0],diff[1]];
								houseway.back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								houseway.rule = 'pair-pair (j - 9 / ace+)';
								houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', two pair behind ('+Card.getName(pair1[0])+' / '+Card.getName(pair2[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							} else {
								// otherwise pair pair
								houseway.high = pair2;
								housewayback = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								houseway.rule = 'pair-pair (j - 9 / -high)';
								houseway.desc = 'pair '+Card.getName(pair2[0])+' - pair '+Card.getName(pair1[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							}
							break;
						// 8,7,6 requires king or better
						case 'eight':
						case 'seven':
						case 'six':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('king')) {
								houseway.high = [diff[0],diff[1]];
								houseway.back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								houseway.rule = 'pair-pair (8 - 6 / king+)';
								houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', two pair behind ('+Card.getName(pair1[0])+' / '+Card.getName(pair2[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							} else {
								// otherwise pair pair
								houseway.high = pair2;
								housewayback = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								houseway.rule = 'pair-pair (8 - 6 / -high)';
								houseway.desc = 'pair '+Card.getName(pair2[0])+' - pair '+Card.getName(pair1[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							}
							break;
						// 5,4,3,2 requires queen or better
						case 'five':
						case 'four':
						case 'three':
							// if high card is an ace, then 2 pair behind
							if (high_rank >= Card.getRank('queen')) {
								houseway.high = [diff[0],diff[1]];
								houseway.back = [pair1[0],pair1[1],pair2[0],pair2[1],diff[2]];
								houseway.rule = 'pair-pair (5 and below / queen+)';
								houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', two pair behind ('+Card.getName(pair1[0])+' / '+Card.getName(pair2[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							} else {
								// otherwise pair pair
								houseway.high = pair2;
								housewayback = [pair1[0],pair1[1],diff[0],diff[1],diff[2]];
								houseway.rule = 'pair-pair (5 and below / -high)';
								houseway.desc = 'pair '+Card.getName(pair2[0])+' - pair '+Card.getName(pair1[0]);
								
								debug = houseway.rule+': '+houseway.desc;
							}
							break;
					}
					break;
				case 1:
					// no flush, straight or trips
					if (poker.flush || poker.straight || poker.trips) {
						break;
					}
					houseway.hair = [diff[0],diff[1]];
					houseway.back = [all[0],all[1],diff[2],diff[3],diff[4]];
					houseway.rule = '1 pair';
					houseway.desc = Card.getName(diff[0])+' - '+Card.getName(diff[1])+', pair of '+Card.getName(all[0]);
					
					debug = houseway.rule+': '+houseway.desc;
					break;
					
			}
			
		}
		// nothing found
		if (poker.nothing) {
			houseway.hair = [cards[1],cards[2]];
			houseway.back = [cards[0],cards[3],cards[4],cards[5],cards[6]];
			houseway.rule = 'nothing';
			houseway.desc = Card.getName(cards[1])+' - '+Card.getName(cards[2])+', '+Card.getName(cards[0])+' high';
			
			debug = houseway.rule+': '+houseway.desc;
		}
		
		if (debug != '') {
			houseway.debug = debug;
		} else {
			houseway.debug = 'no houseway set';
		}
		console.log('outgoing houseway solution: ',houseway);
		return houseway;
	}
}