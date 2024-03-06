class HomeView {

	// initialization tasks here.
	constructor() {
		console.log("HomeView is being initialized.");

		// set the content render target
		this.renderTarget = app.navigator.topPage;

		this.renderTarget.querySelector(".content").innerHTML = "";

		// invoke the render method.
		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("HomeView is being rendered.");



		this.renderTarget.querySelector(".content").innerHTML = `
		<ons-button onclick="app.switchView('SecondView')">Click Me</ons-button>
		<ons-button onclick="app.currentView.doSomethingSpecial('hello')">Do something special</ons-button>`;
	}

	doSomethingSpecial(input) {
		app.switchView("LibraryView");
	}

	// executed before view is closed
	destroy() {
		console.log("HomeView is being destroyed.");
	}
}

viewController.registerView("HomeView", HomeView);