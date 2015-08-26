var Hand = {
	create:function(cards) {
		// untouched
		var original = cards.slice();
		
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
		
		var hand = {original:original,reverse:reverse,sorted:sorted};
		return hand;
	}
}