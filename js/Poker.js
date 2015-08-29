Poker = {
	shuffle:function(array) {
	  var i = 0
		, j = 0
		, temp = null

	  for (i = array.length - 1; i > 0; i -= 1) {
		j = Math.floor(Math.random() * (i + 1))
		temp = array[i]
		array[i] = array[j]
		array[j] = temp
	  }
	  return array;
	},
	// create a specific type of hand
	create:function(type,chance,opt) {
		var hand = [];
		switch(type) {
			case 'flush':
				hand = this.createFlush(opt);
				break;
			case 'straight':
				hand = this.createStraight(opt);
				break;
			case 'quad':
				hand = this.createQuad(opt);
				break;
			case 'trip':
				hand = this.createTrip(opt);
				break;
			case 'pair':
				hand = this.createPair(opt);
				break;
			default:
				hand = this.createNothing(opt);
				break;
		}
		// random chance of joker
		if (Math.random()*100 <= chance) {
			// 50 / 50 on where it goes
			if (Math.random()* 100 > 50) {
				hand[0] = 'joker_one';
			} else {
				hand[hand.length-1] = 'joker_one';
			}
		}
		return hand;
	},
	// create a flush
	createFlush:function(pair_count) {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();

		// grab a random suit
		var suit = suits[Math.round(Math.random()*(suits.length-1))];
		// shuffle the names
		this.shuffle(names);
		// names for our flush
		var start = names.slice(0,5);
		// build the hand
		var no_pairs = [];
		for (var i=0; i<start.length;i++) {
			hand.push(start[i]+'_'+suit);
			no_pairs.push(start[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			// we want a single pair
			var name;
			var paired = false;
			if (pair_count == 1 && paired == false) {
				name = no_pairs[Math.round(Math.random()*(no_pairs.length-1))];
				paired = true;
			} else {
				name = names[Math.round(Math.random()*(names.length-1))];
			}
			var card = name+'_'+suit;
			// no pair count and this name is matching no_pairs
			if (!pair_count && no_pairs.indexOf(name) > 0) {
				continue;
			}
			// this is to prevent trips
			if (pair_count == 1 && no_pairs.indexOf(name) > 0) {
				continue;
			}
			// if this card is not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
				no_pairs.push(name);
			}
		} while (hand.length < 7)
		return hand;
	},
	// create a straight
	createStraight:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		
		// generate a random start point
		var rand = Math.round(Math.random()*(names.length-6));
		var start = names.slice(rand,rand+5);
		for (var i=0; i<start.length;i++) {
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var card = start[i]+'_'+suit;
			hand.push(card);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			var card = name+'_'+suit;
			// if this card is not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
			}
		} while (hand.length < 7)

		return hand;
	},
	// create quads
	createQuad:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		
		// grab a random name
		var rand = Math.round(Math.random()*(names.length-1));
		var quad = names[rand];
		for (var i=0; i<suits.length; i++) {
			hand.push(quad+'_'+suits[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			var card = name+'_'+suit;
			// if this card is not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
			}
		} while (hand.length < 7)

		return hand;
	},
	// create trips
	createTrip:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();

		// grab a random name
		var rand = Math.round(Math.random()*(names.length-1));
		var trip = names[rand];
		this.shuffle(suits);
		for (var i=0; i<suits.length-1; i++) {
			hand.push(trip+'_'+suits[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			var card = name+'_'+suit;
			// if this card is not already part of the trip
			// and not in the hand already then add it
			if (name != trip && hand.indexOf(card) < 0) {
				hand.push(card);
			}
		} while (hand.length < 7)

		
		return hand;
	},
	// create pairs
	createPairs:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();

		return hand;
	},
	// create nothing
	createNothin:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();

		return hand;
	},	

	
	// find all poker hands within a set of cards
	solve:function(cards) {
		var poker = {};
		poker.cards = cards.slice();
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
			switch(Card.getSuit(cards[i])) {
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
		if (count == 4 && flush.length > 0) {
			// top card not an ace, put joker on top
			if (Card.getName(flush[0]) != 'ace') {
				flush.unshift('joker_one');
			} else {
				// sub loop goes through whats left
				for (var i=0;i<flush.length;i++) {
					var card = flush[i];

					var next = flush[i+1];

					// place joker if necessary
					if (Card.getRank(card) != Card.getRank(next) +1) {
						flush.splice(i+1,0,'joker_one');
						break;
					}
				}
			}
		}
		if (flush.length < 5) {
			flush = [];
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
							break;
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
						break;
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