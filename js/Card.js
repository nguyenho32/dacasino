var Card = {
	suits:['diamond','club','heart','spade'],
	getSuit:function(card) {
		var name = card.split('_');
		return name[1];
	},
	names:['two','three','four','five','six','seven','eight','nine','ten','jack','queen','king','ace'],
	getName:function(card) {
		var name = card.split('_');
		return name[0];
	},
	values:[2,3,4,5,6,7,8,9,10,10,10,10,11],
	pictures:['10','jack','queen','king'],
	getRank:function(card) {
		var name = card.split('_');
		
		var rank = name[0] != 'joker' ? this.names.indexOf(name[0])+2 : 0; 
		return rank;
	},
	create:function(opt) {
		
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
		card.key = full;
		return card;
	},
	clicked:function(card,pointer) {
		console.log(card.key);
		// for now we are going off the parent.back.alpha
		/*
		if (img.parent.back.alpha != 1) {
			console.log(img.data);
		}
		*/
	},
	showCard:function() {
		if (this.back.alpha != 1) {
			this.back.alpha = 1;
		} else {
			this.back.alpha = 0;
		}
	}
}