/* Copyright (C) 2015 Zachary Richley - All Rights Reserved
 * You may not use, distribute or modify this code without
 * the express permission of the author.
 *
 * Zachary Richley overmind@juxtaflows.com
 */
Casino.Preloader = function(game) {};
Casino.Preloader.prototype = {
	preload: function() {
//		this.preloadBg = this.add.sprite((Casino._WIDTH-297)*0.5, (Casino._HEIGHT-145)*0.5, 'preloaderBg');
//		this.preloadBar = this.add.sprite((Casino._WIDTH-158)*0.5, (Casino._HEIGHT-50)*0.5, 'preloaderBar');
//		this.load.setPreloadSprite(this.preloadBar);

		this.load.atlas('cards', 'assets/bi-full-deck-with-joker-and-back.png','assets/bi-deck.json');
	},
	create: function() {
		this.game.state.start('MainMenu');
	}
};