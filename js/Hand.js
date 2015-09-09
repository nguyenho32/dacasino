var Hand = {
	create:function(cards) {
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
		for (var k=0; k<Card.names.length;k++) {
			for (var i=0; i<Card.suits.length; i++) {
				var check = Card.names[k]+'_'+Card.suits[i];
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
		if (cards.opt) {
			hand.opt = cards.opt;
		}
		return hand;
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