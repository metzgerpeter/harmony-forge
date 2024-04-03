class SettingsView {

	// initialization tasks here.
	constructor() {
		console.log("SettingsView is being initialized.");

		// invoke the render method.
		this.render();
	}

	// render-related tasks here.
	render() {
		console.log("SettingsView is being rendered.");
		//------ Zehui code to manage the content

		var pitches = ["C", "C# / Db", "D"];
		var outputHTML = "";
		for(var i = 0; i < pitches.length; i ++) {
			outputHTML += `
				<div class="item root-item" data-value='${i}'>
                    <span>${pitches[i]}</span>
                </div>`;
		}

		const rootItemWrap = document.querySelector('.root-item-wrap')
		rootItemWrap.addEventListener('click', e => {
		    for (let value of rootItemWrap.children) {
		        value.classList.remove('active')
		    }
		    e.target.classList.add('active')
		})
		const moodItemWrap = document.querySelector('.mood-item-wrap')
		moodItemWrap.addEventListener('click', e => {
		    for (let value of moodItemWrap.children) {
		        value.classList.remove('active')
		    }
		    e.target.classList.add('active')
		})

		//------- old code ----- delete when player view is complete
		/*this.renderTarget.querySelector(".content").innerHTML = `
		<ons-button onclick="app.switchView('SecondView')">Click Me</ons-button>
		<ons-button onclick="app.currentView.doSomethingSpecial('hello')">Do something special</ons-button>`;*/
	}

	doSomethingSpecial(input) {
		app.switchView("LibraryView");
	}

	// executed before view is closed
	destroy() {
		console.log("SettingsView is being destroyed.");
	}
}

viewController.registerView("SettingsView", SettingsView);