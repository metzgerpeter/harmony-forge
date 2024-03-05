class HomeView {

	// initialization tasks here.
	constructor() {
		console.log("HomeView is being initialized.");

		// set the content render target
		this.renderTarget = app.navigator.topPage;

		// invoke the render method.
		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("HomeView is being rendered.");

		this.renderTarget.querySelector(".content").innerHTML += `
		<ons-button onclick="app.switchView('SecondView')">Click Me</ons-button>
		<ons-button onclick="app.currentView.doSomethingSpecial()">Do something special</ons-button>`;
	}

	doSomethingSpecial() {
		ons.notification.alert("Hey, this is something special.");
	}

	// executed before view is closed
	destroy() {
		console.log("SecondView is being destroyed.");
	}
}

viewController.registerView("HomeView", HomeView);