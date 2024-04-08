class Model{
	constructor(){
		this.allRoots = ["C", "C# / Db", "D", "D# / Eb", "E", "F", "F# / Gb", "G", "G# / Ab", "A", "A# / Bb", "B"];
		this.allMoods = ["bright", "dark", "joyous", "reflective"];
		this.rootSel =  1;
		this.moodSel = "dark";
		this.settingsPlayer = new SettingsPlayer();
	}
}

//-------------------------------------------- Settings --------------------------------------------
//general settings - change if necessary
class SettingsPlayer {
    constructor() {
        this.BPM = 70;
        this.chordsPerBeat = 1;
        this.nRepetitionChord = 4;
        this.updateRate = 30;
        this.loop = true;
    }
}