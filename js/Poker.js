Poker = {
	solve:function(cards) {
		var poker = {};
		poker.cards = cards;
		poker.joker = (cards.indexOf('joker_one') > 0 ) ? true : false;
		var debug = '';
		
		// find matches
		var matches = this.findMatches(cards);
		if (matches.pairs.length != 0) {
			poker.pairs = matches.pairs;
			
			debug += 'pairs: ';
			debug += matches.pairs.toString()+'\n';
		}
		if (matches.trips.length != 0) {
			poker.trips = matches.trips;
			
			debug += 'trips: ';
			debug += matches.trips.toString()+'\n';
			
		}
		if (matches.quads.length != 0) {
			poker.quads = matches.quads;
			
			debug += 'quads: ';
			debug += matches.quads.toString()+'\n';
		}
		
		// find flushes
		var flush = this.findFlush(cards);
		if (flush.length != 0) {
			poker.flush = flush;
			
			debug += 'flush: ';
			debug += flush.toString()+'\n';
		}

		// find straights
		var straight = this.findStraight(cards);
		if (straight.length != 0) {
			poker.straight = straight;
			
			debug += 'straight: ';
			debug += straight.toString()+'\n';
		}
		
		// debug text
		if (debug != '') {
			poker.debug = debug;
		} else {
			poker.debug = 'no poker hands found';
			poker.nothing = true;
		}
		return poker;
	},
	
	/*
		find a straight
	*/
	findStraight:function(cards) {
		var straight = [];

		// first card
		var first = cards[0];
		// straight qualifies (5 or more cards)
		var qualified = false;
		
		// if the first item is a joker, then set joker = true;
		var joker = false;
		var available = false;
		if (cards.indexOf('joker_one') > 0) {
			joker = true;
			available = true;
		}
		
		// master loop only the top 3 cards
		for (var k=0;k<4;k++) {
			if (qualified){
				break;
			}
			// sub loop goes through whats left
			for (var i=k;i<cards.length;i++) {
				// straight has no cards in it yet
				if (straight.length < 1) {
					straight.push(cards[k]);
				} else {
					var card = cards[i];
					var this_rank = Card.getRank(card);

					var last = straight[straight.length-1];
					var last_rank = Card.getRank(last);

					// this rank is one less than last rank
					if (this_rank == last_rank-1) {
						straight.push(card);
						// nothing below two (wheel straights)
						if (Card.getName(card) == 'two') {
							// ace present so add it to the end of the wheel
							if (Card.getName(first) == 'ace') {
								straight.push(cards[0]);
							}
							// joker present and available add to front of straight
							if (joker && available) {
								straight.unshift('joker_one');
								available = false;
								break;
							}
						}
					} else if (this_rank == last_rank){
						// do nothing
					} else {
						// not one less but joker is available
						if (joker && available) {
							straight.push('joker_one');
							available = false;
							// if this card is a three, check for ace to complete the wheel
							if (Card.getName(last) == 'three' && Card.getName(first) == 'ace') {
								straight.push(cards[0]);
								break;
							}
							// check this card again, add if necessary and continue loop to next card
							if (this_rank == last_rank-2) {
								straight.push(card);
								continue;
							}
						}
						// card failed the rank check and straight is big enough
						if (straight.length > 4) {
							qualified = true;
							break;
						}
						// straight is not big enough then reset
						if (straight.length < 5) {
							straight = [];
							available = true;
							break;
						}
					}
				}
			}
		}
		// if the joker is the last item and the first item is not an ace
		if (straight.length > 0) {
			var top = Card.getName(straight[0]);
			if (straight[straight.length-1] == 'joker_one' && top != 'ace') {
				straight.unshift(straight.pop());
			}
		}
		// straight is not big enough then reset
		if (straight.length < 5) {
			straight = [];
		}
		return straight;
		
	},
	
	/*
		find a flush
	*/
	findFlush:function(cards) {
		var hearts = [];
		var spades = [];
		var clubs = [];
		var diamonds = [];
		var flush = [];
		// 5 card minimum for flush
		var count = (cards.indexOf('joker_one') > 0) ? 4 : 5;
		for (var i=0;i<cards.length;i++) {
			var card = cards[i].split('_');
			switch(card[1]) {
				case 'heart':
					hearts.push(cards[i]);
					if (hearts.length >= count) {
						flush = hearts;
					}
				break;
				case 'spade':
					spades.push(cards[i]);
					if (spades.length >= count) {
						flush = spades;
					}
				break;
				case 'club':
					clubs.push(cards[i]);
					if (clubs.length >= count) {
						flush = clubs;
					}
				break;
				case 'diamond':
					diamonds.push(cards[i]);
					if (diamonds.length >= count) {
						flush = diamonds;
					}
				break;

				
			}
		}
		
		// joker present so place it correctly
		if (count == 4) {
			// sub loop goes through whats left
			for (var i=1;i<flush.length;i++) {
				var card = flush[i];
				var this_card = card.split('_');
				var this_rank = Card.names.indexOf(this_card[0])+2;

				var last = flush[i-1];
				var last_name = last.split('_');
				var last_rank = Card.names.indexOf(last_name[0])+2;

				// top card not an ace, put joker on top
				if (last_name[0] != 'ace') {
					flush.unshift('joker_one');
					break;
				}
				// otherwise put the joker in next rank
				if (this_rank != last_rank - 1) {
					flush.splice(i,0,'joker_one');
					break;
				}
			}
		}			
		return flush;
	},
	/*
		find pairs / trips / quads
	*/
	findMatches:function(cards) {
		var pairs = [];
		var trips = [];
		var quads = [];
		var match = [];
		for (var i=0;i<cards.length;i++) {
			var c1 = cards[i].split('_');
			// nothing to compare yet so start with this card
			if(match.length == 0) {
				match.push(cards[i]);
			} else {
				// the last card checked
				var c2 = match[match.length-1].split('_');
				// this card vs last card
				if (c1[0] != c2[0]) {
					// no match set any pairs / trips / quads then reset
					switch(match.length) {
						case 4:
							quads.push(match);
						case 3:
							trips.push(match);
						break;
						case 2:
							pairs.push(match);
						break;
					}
					match = [cards[i]];
				} else {
					// otherwise add this to the match
					match.push(cards[i]);
				}
			}
			// if its the last card, lets not lose our heads
			if (i == cards.length-1) {
				// no match set any pairs / trips / quads then reset
				switch(match.length) {
					case 4:
						quads.push(match);
					case 3:
						trips.push(match);
					break;
					case 2:
						pairs.push(match);
					break;
				}
			}
		}
		var matches = {pairs:pairs,trips:trips,quads:quads};
		return matches;
	}
}