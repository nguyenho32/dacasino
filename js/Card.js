var Card = {
	clicked:function() {
		console.log(this.value);
		
	},
	spawn:function(card,suit,x,y) {
		var full = card+'_'+suit;
		
		var button = game.add.button(x,y,'cards',this.clicked,this,full,full,full);
		
		button.inputEnabled = true;
		button.useHandCursor = true;
		window.rich = button;
		button.card = card;
		button.suit = suit;
		button.value = card;
		return button;
	}
}