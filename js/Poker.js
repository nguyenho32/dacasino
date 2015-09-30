/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
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
		for (var k=0; k<Cards.names.length;k++) {
			for (var i=0; i<Cards.suits.length; i++) {
				var check = Cards.names[k]+'_'+Cards.suits[i];
				if (array.indexOf(check) != -1) {
					sorted.push(check);
				}
			}
		}
		sorted.reverse();
		if (array.indexOf('joker_one') != -1) {
			sorted.push('joker_one');
		}
		return sorted;
	},
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
	/******************************************************************************************************************************************
		CREATE FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a specific type of hand
	///////////////////////////////////////////////////////////////////////////////////////////////////
	create:function(options) {
//		console.log('Poker.create() attempting to create...',options);
		var main = (typeof options.main !== 'undefined') ? options.main : 'random';

		var hand = [];
		// random main type
		if (main == 'random') {
			var types = ['straight-flush','flush','straight','quads','trips','pairs','pai-gow'];
			options.main = types[Math.round(Math.random()*(types.length-1))];
		}
		switch(options.main) {
			case 'straight-flush':
				hand = this.createNatural(options);
				break;
			case 'flush':
				hand = this.createNatural(options);
				break;
			case 'straight':
				hand = this.createNatural(options);
				break;
			case 'quads':
				hand = this.createQuads(options);
				break;
			case 'trips':
				hand = this.createTrips(options);
				break;
			case 'pairs':
				hand = this.createPairs(options);
				break;
			default:
				hand = this.createNothing(options);
				break;
		}
		
		hand.type = main;
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a natural (straight or flush)
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createNatural:function(options) {
		var main = (typeof options.main !== 'undefined') ? options.main : 'straight-flush';
		var sub = (typeof options.sub !== 'undefined') ? options.sub : 'random';

		var hand = [];
		var suits = Cards.suits.slice();
		var names = Cards.names.slice();
		// do a random insert
		if (sub == 'random') {
			var opts = ['0-pair','1-pair','2-pair','trips'];
			sub = opts[Math.round(Math.random()*(opts.length-1))];
		}
		// insert a joker
		var joker = (typeof options.joker !== 'undefined') ? options.joker : 0;
		if (Math.random()*100 < joker) {
			hand.push('joker_one');
		}
		var len = (joker != 0) ? 6 : 5;

		// build the hand
		var match = [];
		switch (main) {
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
		console.log('just built: ',hand);
		console.log('match',match);
		// now complete the hand
		do {
			// generate a random card
			var suit = suits[Math.round(Math.random()*(suits.length-1))];
			var name = names[Math.round(Math.random()*(names.length-1))];
			// no pairs (also no trips)
			if (sub == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (sub == '1-pair') {
				if (hand.length == len) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 2 pairs
			if (sub == '2-pair') {
				// if joker then reduce the straight size by 1
				console.log('old hand: ',hand);
				if (Cards.isJoker(hand[0])) {
					console.log('joker!!!');
					hand.splice(0,1);
					console.log('new hand joker spliced out: ',hand);
					var rand = Math.floor(Math.random()*2)+1;
					hand[rand] = 'joker_one';
					match.splice(rand,1);
					console.log('new_hand joker spliced back in: ',hand);
					console.log('new match: ',match)
					
				}
				// random number
				var r1 = Math.floor(Math.random()*match.length);
				console.log('r1: ',r1);
				// grab something from possible matches
				name = match[r1];
				console.log('name: ',name);
				console.log('match: ',match);
				// if the name is not the last entry in hand and hand.length is over the len
				if (name == Cards.getName(hand[hand.length-1])) {
					console.log('continuing because of attempted trips insert');
					continue;
				}
			}
			// insert trips
			if (sub == 'trips') {
				if (hand.length == len) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					name = Cards.getName(hand[hand.length-1]);
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
		if (main == 'straight') {
			var flush = this.findFlushes(sorted);
			if (flush.length != 0) {
				console.log('createNatural: straight - found flush, rebuilding');
				hand = this.createNatural(options);
			}
		}
		// building flush, make sure no straight
		if (main == 'flush') {
			var straight = this.findStraights(sorted);
			if (straight.length > 0) {
				console.log('createNatural: flush - found straight, rebuilding');
				hand = this.createNatural(options);
			}
		}
		// return the completed hand
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create quads
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createQuads:function(options) {
		var sub = (typeof options.sub !== 'undefined') ? options.sub : 'random';
		var hand = [];
		var suits = Cards.suits.slice();
		var names = Cards.names.slice();
		// do a random insert
		if (sub == 'random') {
			var opts = ['0-pair','1-pair']//,'trips'];
			sub = opts[Math.round(Math.random()*(opts.length-1))];
		}
		// insert a joker
		var joker = (typeof options.joker !== 'undefined') ? options.joker : 0;
		if (Math.random()*100 < joker) {
			hand.push('joker_one');
		}
		var len = (joker != 0) ? 6 : 5;
		
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
			if (sub == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (sub == '1-pair') {
				if (hand.length == len) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert trips
			if (sub == 'trips') {
				if (hand.length > len) {
					name = Cards.getName(hand[hand.length-1]);
				}
			}
			var card = name+'_'+suit;
			// if this card is not in the hand already then add it
			// not sure why this is throwing us into an endless loop
			if (hand.indexOf(card) < 0) {
				hand.push(card);
				match.push(name);
			} else {
				console.log('attempted to insert: ',card,' into ',hand);
				console.log('options: ',options,' - sub: ',sub);
			}
		} while (hand.length < 7)
		// return the completed hand
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create trips
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createTrips:function(options) {
		var sub = (typeof options.sub !== 'undefined') ? options.sub : 'random';
		var hand = [];
		var suits = Cards.suits.slice();
		var names = Cards.names.slice();
		// do a random insert
		if (sub == 'random') {
			var opts = ['0-pair','1-pair','2-pair','trips'];
			sub = opts[Math.round(Math.random()*(opts.length-1))];
		}

		// insert a joker
		var joker = (typeof options.joker !== 'undefined') ? options.joker : 0;
		if (Math.random()*100 < joker) {
			hand.push('joker_one');
		}
		var len = (joker != 0) ? 5 : 4;
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
			if (sub == '0-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 1 pair
			if (sub == '1-pair') {
				if (hand.length == len) {
					name = match[Math.round(Math.random()*(match.length-1))];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 2 pairs
			if (sub == '2-pair') {
				if (hand.length == len || hand.length == len+2) {
					name = match[match.length-1];
				}
			}
			// insert trips
			if (sub == 'trips') {
				if (hand.length == len || hand.length == len+1) {
					name = Cards.getName(hand[hand.length-1]);
				}
				// prevent quads
				if (hand.length == len+2) {
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
			hand = this.createTrips(options);
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createTrips found flush, rebuilding');
			hand = this.createTrips(options);
		}
		// return the completed hand
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create pairs
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createPairs:function(options) {
		var sub = (typeof options.sub !== 'undefined') ? options.sub : 'random';
		var hand = [];
		var suits = Cards.suits.slice();
		var names = Cards.names.slice();
		// do a random insert
		if (sub == 'random') {
			var opts = ['1-pair','2-pair','3-pair'];
			sub = opts[Math.round(Math.random()*(opts.length-1))];
		}
		// insert a joker
		var joker = (typeof options.joker !== 'undefined') ? options.joker : 0;
		var len = (joker != 0) ? 4 : 3;
		if (Math.random()*100 < joker) {
			hand.push('joker_one');
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
			if (sub == '1-pair') {
				if (match.indexOf(name) != -1) {
					continue;
				}
			}
			// insert 2 pairs
			if (sub == '2-pair') {
				if (hand.length == len) {
					name = match[match.length-1];
				} else {
					if (match.indexOf(name) != -1) {
						continue;
					}
				}
			}
			// insert 3 pairs
			if (sub == '3-pair') {
				if (hand.length == len || hand.length == len+2) {
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
			hand = this.createPairs(options);
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createPairs found flush, rebuilding');
			hand = this.createPairs(options);
		}
		// return the completed hand
		return hand;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create nothing
	///////////////////////////////////////////////////////////////////////////////////////////////////
	createNothing:function(options) {
		var hand = [];
		var suits = Cards.suits.slice();
		var names = Cards.names.slice();

		// build the the hand
		var match = [];
		// insert a joker
		var joker = (typeof options.joker !== 'undefined') ? options.joker : 0;
		if (Math.random()*100 < joker) {
			hand.push('joker_one');
		}

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
		var straights = this.findStraights(sorted);
		if (straights.length > 0) {
			console.log('createNothing found straight, rebuilding');
			hand = this.createNothing(options);
		}
		// make sure no flush
		var flush = this.findFlushes(sorted);
		if (flush.length > 0) {
			console.log('createNothing found flush, rebuilding');
			hand = this.createNothing(options);
		}
		// return the completed hand
		return hand;
	},	
	/******************************************************************************************************************************************
		SOLVE FUNCTIONS
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// find all poker hands within a set of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	solve:function(cards) {
		console.log('attempting to solve...',cards);
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
			var suit = Cards.getSuit(flush[i]);
			var name = Cards.getName(flush[i]);
			flush_names.push(name);
			
			if (suit != 'one' && !master) {
				master = suit;
			}
		}
//		console.log('master: ',master);
//		console.log(flush_names);
		if (flush_names.indexOf('joker') != -1) {
			available = false;
		}
		var straight_flush = [];
		// loop the straights
		for (var i=0; i<straights.length; i++) {
//			console.log('\nstarting new master loop...');
			var sf = [];
			var straight = straights[i];
			// loop the straight and match names to the flush
			for (var n=0; n<straight.length; n++) {
				// match this item in the straight to something in the flush_names
				if (flush_names.indexOf(Cards.getName(straight[n])) != -1) {
//					console.log('this item of the straight is in the flush names...');
					// now see if the whole thing matches
					if (flush.indexOf(straight[n]) != -1) {
//						console.log('full match adding to straight-flush...',straight[n]);
						sf.push(straight[n]);
					} else {
						var card = Cards.getName(straight[n])+'_'+master;
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
				if (Cards.getName(sf[0]) != 'ace') {
//					console.log('added to the top');
					sf.unshift('joker_one');
				} else {
					// sub loop goes through whats left
					for (var k=0;k<sf.length;k++) {
						var card = sf[k];
						var next = sf[k+1];
						// place joker if necessary
						if (Cards.getRank(card) != Cards.getRank(next) +1) {
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
	//	find straights (work in progress)
	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		4 card match throw the joker at the top (unless the top is an ace)
		4,3,2,A...joker on top to make wheel
		
	
	*/
	findStraights:function(cards) {
		console.log('\ndebug: finding strizaights');
		console.log('cards: ',cards);
		
		var straights = [];
		
		// does the hand contain a joker
		if (cards.indexOf('joker_one') != -1) {
			var joker = true;
		}

		var card_names = Cards.getNames(cards);
		console.log('card_names: ',card_names);

		// names from ace, king...three, two
		var names = Cards.names.slice().reverse();
		// grab the first card (highest rank)
		for (var i=0; i<card_names.length-3; i++) {
			// card to operate on
			var card = card_names[i];
			console.log('\ncard ',card);
			// index of the card so we know where to slice from
			var card_index = names.indexOf(Cards.getName(card));
			console.log('card_index ',card_index);
			// slice an array of possibilities
			var straight_names = names.slice(card_index,card_index+5);
			// wheel straights
			if (card == 'five') {
				straight_names.push('ace');
			}
			console.log('straight_names ',straight_names);
			// difference between the 2 arrays
			var diff = this.arrayDiff(straight_names,card_names);
			console.log('difference: ',diff);
			
			// difference length of 0 means we have a natural straight
			if (diff.length == 0) {
				var straight = [];
				for (var k=0; k<5; k++) {
					straight.push(Cards.getFullName(cards,straight_names[k]));
				}
				if (joker) {
					var j_straight = straight.slice();
					j_straight.unshift('joker_one');
					j_straight.pop();
					straights.push(j_straight);
				}
				straights.push(straight);
			}
			// missing 1 card lets use the joker
			if (diff.length == 1) {
				console.log('missing one...');
				if (joker) {
					var diff_index = straight_names.indexOf(diff[0]);
					// last card missing so put the joker on top
					if (diff_index == straight_names.length-1) {
							console.log('last card');
							if (straight_names != 'ace') {
								straight_names.unshift('joker');
							} else {
								straight_names[diff_index] = 'joker';
							}
					} else {
						console.log('middle insert');
						straight_names[diff_index] = 'joker';
					}
					console.log('joker inserted...',straight_names);
					// check for duplicate straights
					var straight = [];
					for (var k=0; k<5; k++) {
						straight.push(Cards.getFullName(cards,straight_names[k]));
					}
					straights.push(straight);
				}
			}
		}
		// clean any duplicates (usually due to joker)
		if (straights.length > 1) {
			for (var i=0; i<straights.length-1; i++) {
				console.log('checking straight: ',i);
				var this_straight = straights[i];
				var next_straight = straights[i+1];
				for (var n=0; n<this_straight.length; n++) {
					if (this_straight[n] == next_straight[n]) {
						console.log('matched!!! ',this_straight[n]);
						straights.splice(i+1,1);
						break;
					}
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
			switch(Cards.getSuit(cards[i])) {
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
			if (Cards.getName(flush[0]) != 'ace') {
				flush.unshift('joker_one');
			} else {
				// sub loop goes through whats left
				for (var i=0;i<flush.length;i++) {
					var card = flush[i];

					var next = flush[i+1];

					// place joker if necessary
					if (Cards.getRank(card) != Cards.getRank(next) +1) {
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