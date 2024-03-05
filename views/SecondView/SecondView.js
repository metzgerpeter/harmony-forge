class SecondView {

	// initialization tasks here.
	constructor() {
		console.log("SecondView is being initialized.");

		this.viewRenderTarget = app.navigator.topPage;

		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("SecondView is being rendered.");

		

	}

	// executed before view is closed
	destroy() {
		console.log("SecondView is being destroyed.");
	}

}

viewController.registerView("SecondView", SecondView);