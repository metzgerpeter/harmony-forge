class AboutView {

	// initialization tasks here.
	constructor() {
		console.log("AboutView is being initialized.");
		console.log(this);

		// invoke the render method.
		this.render();

	}

	// render-related tasks here.
	render() {

		console.log("AboutView is being rendered.");
		
		setTimeout(() => {
		           this.finishSplash(); // after 3 seconds
		       }, 3000);
	}

	finishSplash(){
		console.log("finishSplash");
		app.finishView()
		app.switchView("SettingsView", "pushPage");
	}


	// executed before view is closed
	destroy() {
		console.log("AboutView is being destroyed.");
		

	}
}

viewController.registerView("AboutView", AboutView);