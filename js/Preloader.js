Casino.Preloader = function(game) {};
Casino.Preloader.prototype = {
	preload: function() {
//		this.preloadBg = this.add.sprite((Casino._WIDTH-297)*0.5, (Casino._HEIGHT-145)*0.5, 'preloaderBg');
//		this.preloadBar = this.add.sprite((Casino._WIDTH-158)*0.5, (Casino._HEIGHT-50)*0.5, 'preloaderBar');
//		this.load.setPreloadSprite(this.preloadBar);

		this.load.atlas('cards', 'assets/full-deck-with-joker.png','assets/full-deck-with-joker.json');
	},
	create: function() {
		this.game.state.start('Game');
	}
};