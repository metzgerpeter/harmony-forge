//This file will be both a library of progressions and a hub for processing progressions into desired chords based on the key provided.

//Structure of progressions:
//ID, [moods], [[chord1], [chord2], [chord3], [chord4]]

//Structure of chords in progressions
//root note 1-7 (by scale degree)
//triad type 1 major, 2 minor, 3 augmented, 4 diminished
//7th type 0 octave, 1 major, 2 minor, 3 diminished

//Processing
//receive mood, root note
//locate matching progressions (using mood library), process and output

//Output structure per prepared progression:
//[chordname, note1, note2, note3, note4]
//[...]

//Example: if the progression is "I, vi, IV, V7" and the root note is C, chords would be stored as:
	//[
		//ID number,
		//[mood1,mood2,mood3]
		//[1,1,0],
		//[6,2,0],
		//[4,1,0],
		//[5,1,2]
	//]

//and it would output:
	//[
	//	["C", 60, 64, 67, 72],
	//	["Am", 69, 72, 76, 81],
	//	["F", 65, 69, 72, 77],
	//	["G7", 67, 71, 74, 77]
	//]


//Structure of chords in progressionSources
	//root note 1-7 (by scale degree)
	//triad type 1 major, 2 minor, 3 augmented, 4 diminished
	//7th type 0 octave, 1 major, 2 minor, 3 diminished

class progressionSource{
	constructor(id, moods, chordRecipes) {
		this.id = id;
		this.moods = moods;
		this.chordRecipes = chordRecipes;
	}
}


// // identifying one mood to search for
// var moodInQuestion = "reflective";

// // conducting the search using the filter method.
// var matchingResults = progressionSources
// 						.filter(aProgression => aProgression.moods.includes(moodInQuestion));

class Chord {
	constructor(name, notes) {
		this.name = name;
		this.notes = notes;
	}
}

class Chordify {
	static chordify(root, recipe){	//root should be 0-11 for C-B respectively, recipe as defined above
		const noteNames = ["C", "Db", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
		
		//find semitone offset of chord by scale degree
		let rootMod = 0;
		if (recipe[0] == 1){
			rootMod = 0;
		}
		else if (recipe[0] == 2){
			rootMod = 2;
		}
		else if (recipe[0] == 3){
			rootMod = 4;
		}
		else if (recipe[0] == 4){
			rootMod = 5;
		}
		else if (recipe[0] == 5){
			rootMod = 7;
		}
		else if (recipe[0] == 6){
			rootMod = 9;
		}
		else if (recipe[0] == 7){
			rootMod = 11;
		}
		else{
			console.log("Error: Invalid scale degree in recipe.");
		}

		//use rootMod to begin name of chord
		let chordName = noteNames[(root+rootMod)%12];

		//append triad tonality if not major
		if (recipe[1] == 1){
		}
		else if (recipe[1] == 2){
			chordName += "m";
		}
		else if (recipe[1] == 3){
			chordName += "aug";
		}
		else if (recipe[1] == 4){
			chordName += "dim";
		}
		else{
			console.log("Error: Invalid triad tonality in recipe.");
		}

		//append 7th tonality if used
		if (recipe[2] == 0){
		}
		else if (recipe[2] == 1){
			chordName += "M7";
		}
		else if (recipe[2] == 2){
			chordName += "7";
		}
		else if (recipe[2] == 3){
			if (recipe[1] == 4){
				chordName += "7";
			}
			else{
				chordName += "dim7";
			}
		}
		else{
			console.log("Error: Invalid seventh tonality in recipe.");
		}

		console.log("The chord specified is a " + chordName + ".");

		//define MIDI note numbers for chord tones
		const chordRoot = 60+root+rootMod;
		let chordThird = chordRoot;
		let chordFifth = chordRoot;

		//build triad based on tonality
		//major
		if (recipe[1] == 1){
			chordThird += 4;
			chordFifth += 7;
		}
		
		//minor
		else if (recipe[1] == 2){
			chordThird += 3;
			chordFifth += 7;
		}
		
		//augmented
		else if (recipe[1] == 3){
			chordThird += 4;
			chordFifth += 8;
		}
		
		//diminished
		else if (recipe[1] == 4){
			chordThird += 3;
			chordFifth += 6;
		}

		else{
			console.log("Error: Invalid triad tonality in recipe.");
		}

		//append top note
		let chordTop = chordRoot;
		if (recipe[2] == 0){
			chordTop += 12;
		}
		else if (recipe[2] == 1){
			chordTop += 11;
		}
		else if (recipe[2] == 2){
			chordTop += 10;
		}
		else if (recipe[2] == 3){
			chordTop += 9;
		}
		else{
			console.log("Error: Invalid seventh tonality in recipe.");
		}

		console.log("Chord MIDI notes are " + chordRoot + ", " + chordThird + ", " + chordFifth + ", and " + chordTop + ".");
		
		
		//create Chord object
		return new Chord(chordName, [chordRoot, chordThird, chordFifth, chordTop]);

	}

	static buildProgItem(root, source){ //root should be 0-11 for C-B respectively, progSource as defined above
	
		//instantiate array to hold chords
		const myChords = [];

		//iterate through list of chord recipes to create chords in key
		for(let i = 0; i < source.chordRecipes.length; i++){
			const thisChord = Chordify.chordify(root,source.chordRecipes[i]);
			myChords.push(thisChord);
			console.log("Chord " + (i+1) + ": " + thisChord.name + ": " + thisChord.notes);
		}
		console.log(myChords);

		return myChords;
	}
}

//test using progSource1 and the key of C
console.log(Chordify.buildProgItem(0,progSource1));
