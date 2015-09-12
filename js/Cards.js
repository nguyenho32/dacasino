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
	// create a card
	///////////////////////////////////////////////////////////////////////////////////////////////////
	cardCreate:function(opt) {
		
		if (!opt) {
			console.log('no options');
			return;
		} else {
			if (opt.card) {
				var full = opt.card;
			} else {
				console.log('no card to create');
				return;
			}
		}
		/*
		// value of the card
		var value = this.values[this.names.indexOf(name)];
		// rank of the card
		var rank = this.names.indexOf(name)+2;
		if (name == 'joker') {
			value = 15;
			rank = 15;
		}
		// data for this card
		var data = {name:name,suit:suit,rank:rank,value:value};
*/
		// create the card
		var card = game.add.sprite(0,0,'cards',full);
		// make this card useful
		if (opt.clickable) {
			card.inputEnabled = true;
			card.input.useHandCursor = true;
			if (opt.callback) {
				callback = opt.callback;
			} else {
				callback = this.clicked;
			}
			card.events.onInputDown.add(callback,card);
		}
//		card.data = data;

/*
		// the back of the card
		var back = group.create(0,0,'cards','back');
		group.back = back;

		// return the card
		group.showCard = this.showCard;
*/
		card.selected = false;
		card.key = full;
		return card;
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// click a card
	///////////////////////////////////////////////////////////////////////////////////////////////////
	cardClicked:function(card,pointer) {
		console.log(card);
		if (card.selected) {
			card.selected = false;
			card.y += 5;
		} else {
			card.selected = true;
			card.y -= 5;
		}
		// for now we are going off the parent.back.alpha
		/*
		if (img.parent.back.alpha != 1) {
			console.log(img.data);
		}
		*/
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// show / hide a card
	///////////////////////////////////////////////////////////////////////////////////////////////////
	cardShow:function() {
		if (this.back.alpha != 1) {
			this.back.alpha = 1;
		} else {
			this.back.alpha = 0;
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
		if (cards.opt) {
			hand.opt = cards.opt;
		}
		return hand;
	},
}