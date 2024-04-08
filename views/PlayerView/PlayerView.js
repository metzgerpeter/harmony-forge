class PlayerView {

	// initialization tasks here.
	constructor() {
		console.log("PlayerView is being initialized.");

		this.selected = app.navigator.topPage.data;
		console.log("MY SETTINGS ");
		console.log(this.selected);

		//get the chords using chordifier
		this.allProgressions = Chordify.getProgs(Number(this.selected.root),this.selected.mood);


		this.pagePlayer = new PagePlayer(this.allProgressions, app.model.settingsPlayer);
		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("PlayerView is being rendered.");

		this.pagePlayer.createAllItems();
	
	}

	backToSettings() {
		//go back to settings view
		this.pagePlayer.stopCurrentProgression(); //stop if progression is playing
		app.finishView();
	}


	// executed before view is closed
	destroy() {
		console.log("PlayerView is being destroyed.");
	}
}

viewController.registerView("PlayerView", PlayerView);