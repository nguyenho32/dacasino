Poker = {
	/******************************************************************************************************************************************
		GENERIC FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// randomize an array
	///////////////////////////////////////////////////////////////////////////////////////////////////
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// sort an array
	///////////////////////////////////////////////////////////////////////////////////////////////////
	sort:function(array) {
		var sorted = [];
		for (var k=0; k<Card.names.length;k++) {
			for (var i=0; i<Card.suits.length; i++) {
				var check = Card.names[k]+'_'+Card.suits[i];
				if (array.indexOf(check) != -1) {
					sorted.push(check);
				}
			}
		}
		sorted.reverse();
		return sorted;
	},
	/******************************************************************************************************************************************
		CREATE FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a specific type of hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create:function(type,chance,opt) {
//		console.log('\ncreating hand...');
//		console.log('type:',type);
//		console.log('chance:',chance);
//		console.log('opt:',opt);
		var hand = [];
		// random type
		if (type == 'random') {
			var types = ['straight-flush','flush','straight','quads','trips','pairs','pai-gow'];
			type = types[Math.round(Math.random()*(types.length-1))];
		}
		switch(type) {
			case 'straight-flush':
				hand = this.createNatural('straight-flush',opt);
				break;
			case 'flush':
				hand = this.createNatural('flush',opt);
				break;
			case 'straight':
				hand = this.createNatural('straight',opt);
				break;
			case 'quads':
				hand = this.createQuads(opt);
				break;
			case 'trips':
				hand = this.createTrips(opt);
				break;
			case 'pairs':
				hand = this.createPairs(opt);
				break;
			default:
				hand = this.createNothing(opt);
				break;
		}
		
		/*
			we do not want the joker to replace any of the following
			
			natural 5 card straight / flush
			pairs / trips / quads
			
			joker should ALWAYS replace the 'extra' card in the hand
		*/
		// random chance of joker
		if (Math.random()*100 <= chance) {
			// 50 / 50 on where it goes
			if (Math.random()* 100 > 50) {
//				console.log('\nPoker.create(): joker replacing: ',hand[0]);
				hand[0] = 'joker_one';
			} else {
//				console.log('\nPoker.create(): joker replacing: ',hand[hand.length-1]);
				hand[hand.length-1] = 'joker_one';
			}
			/*
			// sort the hand in rank order and do some sanity checks
			var sorted = this.sort(hand);
			// building straight, make sure no flush
			if (type == 'straight') {
//				console.log('created straight, checking for flush...');
				var flush = this.findFlushes(hand);
//				console.log('flush length: ',flush.length);
				if (flush.length != 0) {
					console.log('createNatural - joker added: straight - found flush, rebuilding');
					hand = this.create(type,chance,opt);
				}
			}
			// building flush, make sure no straight
			if (type == 'flush') {
				var straights = this.findStraights(sorted);
				if (straights.length > 0) {
					console.log('createNatural - joker added: flush - found straight, rebuilding');
					hand = this.create(type,opt);
				}
			}
			*/
		}
		hand.type = type;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a natural (straight or flush)
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createNatural:function(type,opt) {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		// do a random insert
		if (opt == 'random') {
			var opts = ['0-pair','1-pair','2-pair','trips'];
			opt = opts[Math.round(Math.random()*(opts.length-1))];
		}

		// build the hand
		var match = [];
		switch (type) {
			case 'straight-flush':
				// grab a random suit
				var suit = suits[Math.round(Math.random()*(suits.length-1))];
				// generate a random start point
				var rand = Math.round(Math.random()*(names.length-6));
				// names for our straight
				var start = names.slice(rand,rand+5);
				// build the straight
				for (var i=0; i<start.length;i++) {
					var card = start[i]+'_'+suit;
					hand.push(card);
					match.push(start[i]);
				}
				break;
			case 'flush':
				// grab a random suit
				var suit = suits[Math.round(Math.random()*(suits.length-1))];
				// shuffle the names
				this.shuffle(names);
				// names for our flush
				var start = names.slice(0,5);
				// build the flush
				for (var i=0; i<start.length;i++) {
					hand.push(start[i]+'_'+suit);
					match.push(start[i]);
				}
				break;
			case 'straight':
				// generate a random start point
				var rand = Math.round(Math.random()*(names.length-6));
				// names for our straight
				var start = names.slice(rand,rand+5);
				// build the straight
				for (var i=0; i<start.length;i++) {
					var suit = suits[Math.round(Math.random()*(suits.length-1))];
					var card = start[i]+'_'+suit;
					hand.push(card);
					match.push(start[i]);
				}
				break;
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			// no pairs (also no trips)
			if (opt == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (opt == '1-pair') {
				if (hand.length == 5) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 2 pairs
			if (opt == '2-pair') {
				if (hand.length == 5) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					name = match[Math.round(Math.random()*(match.length-1))];
					if (name == match[match.length-1]) {
						continue;
					}
				}
			}
			// insert trips
			if (opt == 'trips') {
				if (hand.length == 5) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					name = Card.getName(hand[hand.length-1]);
				}
			}
			// the card we have generated
			var card = name+'_'+suit;
			// if this card is not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			}
		} while (hand.length < 7)
			
		// sort the hand in rank order and do some sanity checks
		var sorted = this.sort(hand);
		// building straight, make sure no flush
		if (type == 'straight') {
			var flush = this.findFlushes(sorted);
			if (flush.length != 0) {
				console.log('createNatural: straight - found flush, rebuilding');
				hand = this.createNatural(type,opt);
			}
		}
		// building flush, make sure no straight
		if (type == 'flush') {
			var straight = this.findStraights(sorted);
			if (straight.length > 0) {
				console.log('createNatural: flush - found straight, rebuilding');
				hand = this.createNatural(type,opt);
			}
		}
		// return the completed hand
		hand.opt = opt;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create quads
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createQuads:function(opt) {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		// do a random insert
		if (opt == 'random') {
			var opts = ['0-pair','1-pair','trips'];
			opt = opts[Math.round(Math.random()*(opts.length-1))];
		}
		
		// grab a random name
		var rand = Math.round(Math.random()*(names.length-1));
		var quad = names[rand];
		var match = [quad];
		for (var i=0; i<suits.length; i++) {
			hand.push(quad+'_'+suits[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			// no pairs (also no trips)
			if (opt == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (opt == '1-pair') {
				if (hand.length == 5) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert trips
			if (opt == 'trips') {
				if (hand.length != 4) {
					name = Card.getName(hand[hand.length-1]);
				}
			}
			var card = name+'_'+suit;
			// if this card is not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			}
		} while (hand.length < 7)
		// return the completed hand
		hand.opt = opt;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create trips
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createTrips:function(opt) {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		// do a random insert
		if (opt == 'random') {
			var opts = ['0-pair','1-pair','2-pair','trips'];
			opt = opts[Math.round(Math.random()*(opts.length-1))];
		}

		// grab a random name
		var rand = Math.round(Math.random()*(names.length-1));
		var trip = names[rand];
		// randomize the suits for our trips
		this.shuffle(suits);
		var match = [trip];
		for (var i=0; i<suits.length-1; i++) {
			hand.push(trip+'_'+suits[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			// no pairs (also no trips)
			if (opt == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (opt == '1-pair') {
				if (hand.length == 4) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 2 pairs
			if (opt == '2-pair') {
				if (hand.length == 4 || hand.length == 6) {
					name = match[match.length-1];
				}
			}
			// insert trips
			if (opt == 'trips') {
				if (hand.length == 4 || hand.length == 5) {
					name = Card.getName(hand[hand.length-1]);
				}
				// prevent quads
				if (hand.length == 6) {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			var card = name+'_'+suit;
			// if this card is not already part of the trip
			// and not in the hand already then add it
			if (name != trip && hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			}
		} while (hand.length < 7)
			
		// sort the hand in rank order and do some sanity checks
		var sorted = this.sort(hand);
		// make sure no straight
		var straight = this.findStraights(sorted);
		if (straight.length > 0) {
			console.log('createTrips found straight, rebuilding');
			hand = this.createTrips(opt);
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createTrips found flush, rebuilding');
			hand = this.createTrips(opt);
		}
		// return the completed hand
		hand.opt = opt;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create pairs
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createPairs:function(opt) {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();
		// do a random insert
		if (opt == 'random') {
			var opts = ['1-pair','2-pair','3-pair'];
			opt = opts[Math.round(Math.random()*(opts.length-1))];
		}

		// grab a random name
		var rand = Math.round(Math.random()*(names.length-1));
		var pair = names[rand];
		this.shuffle(suits);
		var match = [pair];
		for (var i=0; i<suits.length-2; i++) {
			hand.push(pair+'_'+suits[i]);
		}
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			// insert 1 pair
			if (opt == '1-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 2 pairs
			if (opt == '2-pair') {
				if (hand.length == 3) {
					name = match[match.length-1];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 3 pairs
			if (opt == '3-pair') {
				if (hand.length == 3 || hand.length == 5) {
					name = match[match.length-1];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			var card = name+'_'+suit;
			// if this card is not already part of the pair
			// and not in the hand already then add it
			if (name != pair && hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			}
		} while (hand.length < 7)
			
		// sort the hand in rank order and do some sanity checks
		var sorted = this.sort(hand);
		// make sure no straight
		var straight = this.findStraights(sorted);
		if (straight.length > 0) {
			console.log('createPairs found straight, rebuilding');
			hand = this.createPairs(opt);
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createPairs found flush, rebuilding');
			hand = this.createPairs(opt);
		}
		// return the completed hand
		hand.opt = opt;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create nothing
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createNothing:function() {
		var hand = [];
		var suits = Card.suits.slice();
		var names = Card.names.slice();

		// build the the hand
		var match = [];
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			if (match.indexOf(name) != -1) {
				continue;
			}
			var card = name+'_'+suit;
			// card not in the hand already then add it
			if (hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			}
		} while (hand.length < 7)
			
		// sort the hand in rank order and do some sanity checks
		var sorted = this.sort(hand);
		// make sure no straight
		var straight = this.findStraights(sorted);
		if (straight.length > 0) {
			console.log('createNothing found straight, rebuilding');
			hand = this.createNothing();
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createTrips found flush, rebuilding');
			hand = this.createNothing();
		}
		// return the completed hand
		hand.opt = 'none';
		return hand;
	},	
	/******************************************************************************************************************************************
		SOLVE FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// find all poker hands within a set of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
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
		var flush = this.findFlushes(cards);
		if (flush.length != 0) {
			poker.flush = flush;
			
			debug += 'flush: ';
			debug += flush.toString()+'\n';
		}

		// find straights
		var straights = this.findStraights(cards);
		if (straights.length != 0) {
			poker.straights = straights;
			
			debug += 'straight:\n';
			// loop the straights
			for(var i=0; i<straights.length; i++) {
				var straight = straights[i];
				debug += straight.toString()+'\n';
			}
		}
		
		// find straight flush
		if (poker.flush && poker.straights) {
			var straight_flush = this.findStraightFlush(poker);
			if (straight_flush.length != 0) {
				poker.straight_flush = straight_flush;
				
				debug += 'straight flush: ';
				debug += straight_flush.toString()+'\n';
			}
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//	find straight-flush
	///////////////////////////////////////////////////////////////////////////////////////////////////
	findStraightFlush:function(poker) {
		var straights = poker.straights;
		var flush = poker.flush;
		var cards = poker.cards;
//		console.log('cards: ',cards);
//		console.log('straights: ',straights);
//		console.log('flush: ',flush);

		// joker
		var joker = poker.joker;
		var available = true;
		// master suit
		var master;
		// array of names
		var flush_names = [];
		for (var i=0; i<flush.length; i++) {
			var suit = Card.getSuit(flush[i]);
			var name = Card.getName(flush[i]);
			flush_names.push(name);
			
			if (suit != 'one' && !master) {
				master = suit;
			}
		}
//		console.log('master: ',master);
//		console.log(flush_names);
		var straight_flush = [];
		// loop the straights
		for (var i=0; i<straights.length; i++) {
//			console.log('\nstarting new master loop...');
			var sf = [];
			var straight = straights[i];
			// loop the straight and match names to the flush
			for (var n=0; n<straight.length; n++) {
				// match this item in the straight to something in the flush_names
				if (flush_names.indexOf(Card.getName(straight[n])) != -1) {
//					console.log('this item of the straight is in the flush names...');
					// now see if the whole thing matches
					if (flush.indexOf(straight[n]) != -1) {
//						console.log('full match adding to straight-flush...',straight[n]);
						sf.push(straight[n]);
					} else {
						var card = Card.getName(straight[n])+'_'+master;
//						console.log('not a full match, checking for other match...',card);
						if (cards.indexOf(card) != -1) {
//							console.log('other match found...');
							sf.push(card);
						} else {
							// no other match found, push the joker if available
							if (joker && available) {
								sf.push('joker_one');
								available = false;
							}
						}
					}
				}
			}
			// if length is 4 and joker is available then add it
			if (sf.length == 4 && joker && available) {
//				console.log('adding joker');
				// top card not an ace, put joker on top
				if (Card.getName(sf[0]) != 'ace') {
//					console.log('added to the top');
					sf.unshift('joker_one');
				} else {
					// sub loop goes through whats left
					for (var k=0;k<sf.length;k++) {
						var card = sf[k];
						var next = sf[k+1];
						// place joker if necessary
						if (Card.getRank(card) != Card.getRank(next) +1) {
							sf.splice(k+1,0,'joker_one');
							break;
						}
					}
				}
			}
//			console.log('sf: ',sf);
			if (sf.length == 5) {
				straight_flush.push(sf);
			}
		}
//		console.log('straight flush: ',straight_flush);
		return straight_flush;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//	find straights
	///////////////////////////////////////////////////////////////////////////////////////////////////
	findStraights:function(cards) {
		var straights = [];
		
		// joker will always be in the last position if present
		var joker_present = (cards.indexOf('joker_one') != -1) ? true : false;

		// go 4 deep in case of joker based wheel straights
		for (var i=0; i<4; i++) {
			// joker is available
			var joker_available = (joker_present) ? true : false;
			// last time running loop and this card not a 5 no reason to continue
			if (i == 3 && Card.getName(cards[i]) != 'five') {
				break;
			}
			// add this item to the straight
			var straight = [cards[i]];
			// now loop the rest of the cards
			for (var k=i+1; k<cards.length; k++) {
				// this card
				var card = cards[k];
				var this_rank = Card.getRank(card);
				// last item in straight
				var last = straight[straight.length-1];
				var last_rank = Card.getRank(last);

				// this rank is one less than last rank
				if (this_rank == last_rank-1) {
					straight.push(card);
					// 5 card straight with available joker and natural pair at the bottom
					if (straight.length == 5 && joker_available && Card.getName(card) == Card.getName(cards[k+1])) {
						// otherwise put in the front
						var new_straight = straight.slice();
						new_straight.unshift('joker_one');
						new_straight.splice(-1,1);
						straights.push(new_straight);
					}
				} else if (this_rank == last_rank) {
					// otherwise do nothing
				} else {
					// joker present and available
					if (joker_present && joker_available) {
						// straight length less than 4
						if (straight.length < 4) {
							// first card in straight is 5, this card is 3 and we have ace + joker make a wheel
							if (straight.length == 3 && Card.getName(straight[0]) == 'five' && Card.getName(straight[2]) == 'three' && Card.getName(cards[0]) == 'ace') {
								joker_available = false;
								straight.push('joker_one');
								straight.push(cards[0]);
							} else if (this_rank == last_rank-2) {
								// this card is 2 less than last in straight (and not a 2)
								joker_available = false;
								straight.push('joker_one');
								straight.push(card);
							} else {
								// with joker, no straight possible so start next master loop
								break;
							}
						}
					} else {
						// not a straight to start the next master loop
						break;
					}
				}
				// straight is 4 cards long, top card in straight is 5, last card is a 2 and ace present so make a wheel
				if (straight.length == 4 && Card.getName(straight[0]) == 'five' && Card.getName(card) == 'two' && Card.getName(cards[0]) == 'ace') {
					straight.push(cards[0]);
				}
				// straight more than 5 for some reason, so cut the end off 
				if (straight.length > 5) {
					straight.splice(-1,1);
				}
				// straight is 5 cards long, then push it
				if (straight.length == 5) {
					straights.push(straight);
					break;
				}
			}
			// straight is 4 long and joker present and available add to straight
			if (straight.length == 4 && joker_present && joker_available) {
				joker_available = false;
				// if top card is an ace, then put in the back
				if (Card.getName(straight[0]) == 'ace') {
					straight.push('joker_one');
				} else {
					// otherwise put in the front
					straight.unshift('joker_one');
				}
				straights.push(straight);
			}
		}

		// multiple straights with the same start card...are the same straight
		if (straights.length > 1) {
			for (var i=straights.length-1; i>0; i--) {
				var this_straight = straights[i];
				var next_straight = straights[i-1];
				// if the 1st cards match then get rid of it
				if (Card.getName(this_straight[0]) == Card.getName(next_straight[0])) {
					straights.splice(i-1,1);
					continue;
				}
				// first card is joker, then match up the 2nd cards
				if (Card.getName(this_straight[0]) == 'joker' && Card.getName(this_straight[1]) == Card.getName(next_straight[1])) {
					straights.splice(i,1);
				}
			}
		}
		return straights;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//	find a flush
	///////////////////////////////////////////////////////////////////////////////////////////////////
	findFlushes:function(cards) {
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
	///////////////////////////////////////////////////////////////////////////////////////////////////
	//	find pairs / trips / quads
	///////////////////////////////////////////////////////////////////////////////////////////////////
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