/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
var Cards = {
	/******************************************************************************************************************************************
		GLOBAL STUFF
	******************************************************************************************************************************************/
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
	// available suits
	///////////////////////////////////////////////////////////////////////////////////////////////////
	suits:['diamond','club','heart','spade'],
	getSuit:function(card) {
		var name = card.split('_');
		return name[1];
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// available names
	///////////////////////////////////////////////////////////////////////////////////////////////////
	names:['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace'],
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get a cards names
	///////////////////////////////////////////////////////////////////////////////////////////////////
	getName:function(card) {
		var name = card.split('_');
		return name[0];
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get a cards rank
	///////////////////////////////////////////////////////////////////////////////////////////////////
	getRank:function(card) {
		var rank = (this.isJoker(card)) ? 0 : this.names.indexOf(this.getName(card))+2;
		return rank;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// get a cards point value
	///////////////////////////////////////////////////////////////////////////////////////////////////
	getValue:function(card) {
		var name = card.split('_');
		var value = (this.isJoker()) ? this.names.indexOf(name[0])+2 : 0; 
		return value;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// is the card a picture
	///////////////////////////////////////////////////////////////////////////////////////////////////
	pictures:['10','jack','queen','king'],
	isPicture:function(card) {
		var name = card.split('_');
		var picture = (this.pictures.indexOf(name[0]) != -1) ? true : false;
		return picture;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// is the card a joker
	///////////////////////////////////////////////////////////////////////////////////////////////////
	isJoker:function(card) {
		var name = card.split('_');
		var joker = (name[0] != 'joker') ? false : true;
		return joker;
	},
	/******************************************************************************************************************************************
		CARD SPECIFIC STUFF
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// click a card
	///////////////////////////////////////////////////////////////////////////////////////////////////
	cardClicked:function(card,pointer) {
		if (card.selected) {
			card.selected = false;
			card.y += 5;
		} else {
			card.selected = true;
			card.y -= 5;
		}
	},
	/******************************************************************************************************************************************
		DECK SPECIFIC STUFF
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a deck of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	deckCreate:function(type,shuffled,jokers) {

		if (type != 'standard') {
			console.log('not a standard deck');
		}
		
		// create a deck of cards
		var deck = [];
		var suits = this.suits;
		var names = this.names;
		for (var i=0; i<suits.length; i++) {
			for (var k=0; k<names.length;k++) {
				deck.push(names[k]+'_'+suits[i]);
			}
		}
		
		// add jokers if necessary
		if (jokers > 0) {
			for (var i=0; i<jokers;i++) {
				deck.push('joker_one');
			}
		}
		// shuffle the deck if necessary
		if (shuffled) {
			deck = this.shuffle(deck);
		}
		// return the deck
		return deck;
	},
	/******************************************************************************************************************************************
		CARD SPECIFIC STUFF
	******************************************************************************************************************************************/
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// create a hand using an array of cards
	///////////////////////////////////////////////////////////////////////////////////////////////////
	handCreate:function(cards) {
		// untouched
		var original = cards.slice();
		var shuffled = this.shuffle(cards.slice());
		// backwards
		var reverse = cards.slice().reverse();
		
		// rank ordered
		var sorted = [];
		// the joker
		if (cards.indexOf('joker_one') != -1) {
			sorted.push('joker_one');
		}
		for (var k=0; k<this.names.length;k++) {
			for (var i=0; i<this.suits.length; i++) {
				var check = this.names[k]+'_'+this.suits[i];
				if (cards.indexOf(check) != -1) {
					sorted.push(check);
				}
			}
		}
		sorted.reverse();
		var hand = {original:original,reverse:reverse,sorted:sorted,shuffled:shuffled};
		// this hand was created so we have some extra options to add
		if (cards.type) {
			hand.type = cards.type;
		}
		return hand;
	},
}