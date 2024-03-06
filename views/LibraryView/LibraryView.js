class LibraryView {

	// initialization tasks here.
	constructor() {
		console.log("LibraryView is being initialized.");

		// set the content render target
		this.renderTarget = app.navigator.topPage;

		this.renderTarget.querySelector(".content").innerHTML = "";

		// invoke the render method.
		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("LibraryView is being rendered.");



		this.renderTarget.querySelector(".content").innerHTML = `
		<ons-button onclick="app.switchView('SecondView')">Click Me</ons-button>
		<ons-button onclick="app.currentView.doSomethingSpecial('hello')">Do something special</ons-button>`;
	}


	// executed before view is closed
	destroy() {
		console.log("LibraryView is being destroyed.");
	}
}

viewController.registerView("LibraryView", LibraryView);