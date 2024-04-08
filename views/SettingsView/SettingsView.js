class SettingsView {

	// initialization tasks here.
	constructor() {
		console.log("SettingsView is being initialized.");
		console.log(this);

		// invoke the render method.
		this.render();

		// retrieve the mood & root id.
		var config = app.navigator.topPage.data;

		// config.root, config.mood.
	}

	// render-related tasks here.
	render() {

		console.log("SettingsView is being rendered.");
		//------ Zehui code to manage the content
		//creating roots dynamically
		var outputHTML = "";
		for(var i = 0; i < app.model.allRoots.length; i ++) {
			var active = "";
			if(i == app.model.rootSel){
				active = " active";
			}
			outputHTML += `
				<div class="item root-item${active}" data-value='${i}'>
                    <span>${app.model.allRoots[i]}</span>
                </div>`;
		}
		const rootContainer = document.getElementById('root-container');
		rootContainer.innerHTML = outputHTML;

		//creating moods dynamically
		outputHTML = "";
		for(var i = 0; i < app.model.allMoods.length; i ++) {
			var active = "";
			if(app.model.allMoods[i] == app.model.moodSel){
				active = " active";
			}
			outputHTML += `
				<div class="item mood-item${active}" data-value='${app.model.allMoods[i]}' >
				    <span>${app.model.allMoods[i]}</span>
				</div>`;
		}
		const moodContainer = document.getElementById('mood-container');
		moodContainer.innerHTML = outputHTML;

		//defining actions for roots and moods
		const rootItemWrap = document.querySelector('.root-item-wrap')
		rootItemWrap.addEventListener('click', e => {
		    for (let value of rootItemWrap.children) {
		        value.classList.remove('active')
		    }
		    e.target.classList.add('active');
		    app.model.rootSel = e.target.getAttribute('data-value');
		    //console.log("selectedRoot= " + app.model.rootSel)
		})
		const moodItemWrap = document.querySelector('.mood-item-wrap')
		moodItemWrap.addEventListener('click', e => {
		    for (let value of moodItemWrap.children) {
		        value.classList.remove('active')
		    }
		    e.target.classList.add('active');
		    app.model.moodSel = e.target.getAttribute('data-value');
		    //console.log("selectedMood= " + app.model.moodSel)
		})
	}

	generateChords() {
		// generate the chords.
		app.switchView("PlayerView", "pushPage", {
			root: app.model.rootSel,
			mood: app.model.moodSel
		});
	}

	// executed before view is closed
	destroy() {
		console.log("SettingsView is being destroyed.");
	}
}

viewController.registerView("SettingsView", SettingsView);