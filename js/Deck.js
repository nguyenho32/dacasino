var Deck = {
	spawn:function() {
		var deck = game.add.group();
		var suits = ['diamond','club','heart','spade'];
		var cards = ['2','3','4','5','6','7','8','9','10','jack','queen','king','ace'];
		for (var i=0; i<suits.length; i++) {
			for (var k=0; k<cards.length;k++) {
				var name = cards[k]+'_'+suits[i];
				var card = Card.spawn(cards[k],suits[i],5+(130*k),10+(180*i));
				deck.add(card);
			}
		}
		deck.add(Card.spawn('1','joker',5,730));
		deck.add(Card.spawn('2','joker',135,730));
		deck.add(Card.spawn('0','back',270,730));
		return deck;
	}
}