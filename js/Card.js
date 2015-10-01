/**************************************************************************************************
	card constructor
**************************************************************************************************/
Card = function(game,x,y,key,callback) {
	this.game = game;
	// graphic / body /physics stuff
	Phaser.Sprite.call(this, this.game, x, y,'cards', key);
	this.scale.setTo(0.33);
	this.game.add.existing(this);

	var outline = this.game.add.sprite(-3.5, -3.5,'cards',key);
	outline.tint = 0x2F4F2F;
	outline.alpha = 0.15;
	outline.visible = false;
	this.addChild(outline);
	this.outline = outline;

	var right = this.game.add.sprite(-3.5, -3.5,'cards',key);
	right.tint = 0x00FF00;
	right.alpha = 0.15;
	right.visible = false;
	this.addChild(right);
	this.right = right;

	var wrong = this.game.add.sprite(-3.5, -3.5,'cards',key);
	wrong.tint = 0xFF0000;
	wrong.alpha = 0.15;
	wrong.visible = false;
	this.addChild(wrong);
	this.wrong = wrong;

	if (callback) {
		this.inputEnabled = true;
		this.input.useHandCursor = true;
		this.events.onInputDown.add(callback,this);
	}
	this.key = key;
};
Card.prototype = Object.create(Phaser.Sprite.prototype);
Card.prototype.constructor = Card;

Card.prototype.activate  = function(tint) {
	card.outline.visible = false;
	card.right.visible = false;
	card.wrong.visible = false;
	switch(tint) {
		case 'outline':
			card.outline.visible = true;
			break;
		case 'right':
			card.right.visible = true;
			break;
		case 'wrong':
			card.wrong.visible = true;
			break;
	}
};
