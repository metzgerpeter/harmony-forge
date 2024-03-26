//This file will be both a library of progressions and a hub for processing progressions into desired chords based on the key provided.

//Structure of progressions:
//ID, [chord1], [chord2], [chord3], [chord4]

//mood library will just be a list of ID's that match

//Structure of chords in progressions
//root note 1-7
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

