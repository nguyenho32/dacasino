var Deck = {
	create:function(type,shuffled,jokers) {

		if (type != 'standard') {
			console.log('not a standard deck');
		}
		
		// create a deck of cards
		var deck = [];
		var suits = Card.suits;
		var names = Card.names;
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
	}
}