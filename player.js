const playImgSrc = './assets/play.png';
const stopImgSrc = './assets/stop.png';
const progressImgSrc = './assets/progress.png';
const coverImgSrc = './assets/cover.png';
const circleImgSrc = './assets/circle.png';


//--------------------------------------------Tape --------------------------------------------
//structure that builds the progression applying the settings
//includes the chords that are going to play N times and when 
class Tape {
    constructor(progressionItem, settingsPlayer, progressionPlayer){
        this.pointer = 0;
        this.content = [];
        this.schedule = [];

        this.progressionPlayer = progressionPlayer;
        
        var timeToPlay = progressionPlayer.getStartTime();
        var msChordDuration = progressionPlayer.getChordDuration();

        //for every chord
        for (var iChord = 0 ; iChord < progressionItem.getChordQuantity() ; iChord++){
            var chord = progressionItem.getChord(iChord);
            //each has to reach nRepetitionChord
            for(var counter = 0; counter < settingsPlayer.nRepetitionChord ; counter++){
                this.content.push(chord);
                this.schedule.push(timeToPlay);
                timeToPlay = new Date(timeToPlay.getTime() + msChordDuration);
            }
        }

        //add the End of Tape
        this.content.push("EOT");
        this.schedule.push(progressionPlayer.getEndTime());
    }

    getCurrentScheduledEventTime(){
        return this.schedule[this.pointer];
    }

    getCurrentChord(){
        return this.content[this.pointer];
    }

    getPreviousChord(){
        if(this.pointer == 0){
            return this.content[this.content.length - 1]; 
        }else{
            return this.content[this.pointer - 1];
        }
    }

    moveToNext(){
        this.pointer = this.pointer + 1;
        if(this.pointer == this.content.length){ 
            //move to the beginning 
            this.pointer = 0;

            //recalculate the schedule for next loop
            const diffTime = this.progressionPlayer.getTotalDuration(); 
            console.log("reseting pointer " + diffTime);
            //iterate through all the elements of the schedule
            for (var i = 0; i < this.schedule.length; i++){
                this.schedule[i] = new Date(this.schedule[i].getTime() + diffTime);
            }
            //new start time and new end time - set it to player
            var newEndTime = new Date(this.schedule[0].getTime() + this.progressionPlayer.getTotalDuration());
            this.progressionPlayer.setNewTimes(this.schedule[0], newEndTime);
        }
    }

    isPointerInStart(){
        if(this.pointer == 0){
            return true;
        }else{
            return false;
        }
    }

    isPointerInEnd(){
        if(this.pointer == (this.schedule.length-1)){
            return true;
        }else{
            return false;
        }
    }

    resetPointer(){
        this.pointer = 0;
    }
}
//--------------------------------------------Progression Player --------------------------------------------
//player for every progression.
class ProgressionPlayer {
    constructor(index, progressionItem, pagePlayer){
        this.index = index;
        this.pagePlayer = pagePlayer;
        this.progressionItem = progressionItem;
        this.startTime = 0;
        this.msBeatVal = 0;  //duration of every beat
        this.msChordDuration = 0; //duration of every chord
        this.msUpdateVal = 0;   //rate of update progress in ms
        this.msTotalDuration = 0;    //total duration
        this.endTime = 0;

        this.settingsPlayer = null; 
        this.tape = null;
        this.intervalId = 0;
    }

    calcSettingsData(settingsPlayer){
        this.settingsPlayer = settingsPlayer
        this.msBeatVal = 60000/settingsPlayer.BPM;
        this.msUpdateVal = this.msBeatVal/settingsPlayer.updateRate;
        this.msChordDuration = this.msBeatVal/settingsPlayer.chordsPerBeat;
        //duration equal to  msChordDuration * repetitionChord * chordQuantity 
        this.msTotalDuration = this.msChordDuration*this.settingsPlayer.nRepetitionChord*this.progressionItem.getChordQuantity();

    }

    createTape(startTime){
        this.startTime = startTime;
        this.endTime = new Date(startTime.getTime() + this.msTotalDuration);
        this.tape = new Tape(this.progressionItem, this.settingsPlayer, this);
    }

    playProgression(settingsPlayer){
        //change the action img
        var actionIcon = document.getElementById('action-' + this.index);
        actionIcon.src = stopImgSrc; //show option to stop
        //get the needed img to update
        var containerWidth = document.querySelector('.progress-container').offsetWidth;
        var coverProgression = document.getElementById('cover-' + this.index);

        //recalculate data based on given settings
        this.calcSettingsData(settingsPlayer);
        this.createTape(new Date());

        //play the first chord - update progression
        this.updateProgression();

        //start the counter - schedule the rest of the progression
        //imitating "thread"
        this.intervalId = setInterval(
            () => {     
                        var progress = this.updateProgression();
                        //console.log("progress = " + progress);
                        coverProgression.style.width = ((containerWidth * (100-progress)) / 100) + 'px';
                }, this.msUpdateVal
            );           
    }

    stopProgression(){
        console.log("stopped");

        clearInterval(this.intervalId);
        this.pagePlayer.getSampler().triggerRelease(this.midi2notes(this.tape.getPreviousChord().getNotes()));
        //clean the progression - cover 
        var containerWidth = document.querySelector('.progress-container').offsetWidth;
        var coverProgression = document.getElementById('cover-' + this.index);
        coverProgression.style.width = containerWidth + 'px';

        //change the action img
        var actionIcon = document.getElementById('action-' + this.index);
        actionIcon.src = playImgSrc; //show option to play again
    }

    updateProgression(){
        //console.log("update " + this.index);
        
        var now = new Date();
        var elapsedTime = now - this.startTime;
        var progress = (elapsedTime/this.msTotalDuration)*100; //gets the percentage

        //play chord in tape if the time is >= of the schedule.
        if(now >= this.tape.getCurrentScheduledEventTime()){
            var sampler = this.pagePlayer.getSampler();
            if(!this.tape.isPointerInStart()){ //if not the first
                //release the previous chord
                sampler.triggerRelease(this.midi2notes(this.tape.getPreviousChord().getNotes()));
                //console.log("released " + this.tape.getPreviousChord().getName());
            }
            //if tape reaches the end (EOT), renew the pointer and start over (if loop)
            if(this.tape.isPointerInEnd()){
                
                if(!this.settingsPlayer.loop){ //no loop
                    this.stopProgression()
                }else{ //loop
                    //release the last chord
                    sampler.triggerRelease(this.midi2notes(this.tape.getPreviousChord().getNotes()));
                    //renew tape
                    this.tape.moveToNext();
                    //play the first 
                    sampler.triggerAttack(this.midi2notes(this.tape.getCurrentChord().getNotes()));
                    this.tape.moveToNext();
                }
            }else{
                //if not the end of tape, PLAY the notes
                sampler.triggerAttack(this.midi2notes(this.tape.getCurrentChord().getNotes()));
                this.tape.moveToNext();
            }
        }
        return progress;
    }

    changeImgIcon(imgSource){
        var playIcon = document.getElementById('action-' + this.index);
        playIcon.src = imgSource;
    }

    getStartTime(){
        return this.startTime;
    }

    getTotalDuration(){
        return this.msTotalDuration;
    }

    getChordDuration(){
        return this.msChordDuration;
    }

    getEndTime(){
        return this.endTime;
    }

    getTape(){
        return this.tape;
    }

    setNewTimes(startTime, endTime){//tape will update these
        this.startTime = startTime;
        this.endTime = endTime;
    }

    midi2notes(arrayMidi){
        var newNotes = [];
        for(var i = 0; i < arrayMidi.length; i++){
            newNotes.push(Tone.Frequency(arrayMidi[i], "midi").toNote());
        }
        return newNotes;
    }

    copyToClipbard(){
        var allChords = this.progressionItem.getAllChords();
        var text = "";
        for(var i=0; i< allChords.length; i++){
            text+= allChords[i].getName() + "  ";
        }
        navigator.clipboard.writeText(text)
        .then(() => {
            console.log('Text copied to clipboard successfully:', text);
            //ons.notification.alert("Progression copied: \n" + text);
            ons.notification.toast("Progression copied: \n " + text, { timeout: 1500 , animation: 'fall' }); // Shows from 0s to 2s
        })
        .catch(err => {
            console.error('Failed to copy text to clipboard:', err);
        });
    }
}

//--------------------------------------------Page Player --------------------------------------------
class PagePlayer {
    constructor(arrayOfProgressions, settingsPlayer){
        this.progressions = arrayOfProgressions;
        this.players = [];
        // Create a player for each progression
        for (let i = 0; i < arrayOfProgressions.length; i++) {
            this.players.push(new ProgressionPlayer(i, this.progressions[i], this)); 
        }
        // -1 means none is getting played. 1,2,3... are index being played
        this.indexPlaying = -1;
        this.settingsPlayer = settingsPlayer;
        this.sampler = new Tone.Sampler({
            urls: {
              A0: "A0.mp3",
              C1: "C1.mp3",
              "D#1": "Ds1.mp3",
              "F#1": "Fs1.mp3",
              A1: "A1.mp3",
              C2: "C2.mp3",
              "D#2": "Ds2.mp3",
              "F#2": "Fs2.mp3",
              A2: "A2.mp3",
              C3: "C3.mp3",
              "D#3": "Ds3.mp3",
              "F#3": "Fs3.mp3",
              A3: "A3.mp3",
              C4: "C4.mp3",
              "D#4": "Ds4.mp3",
              "F#4": "Fs4.mp3",
              A4: "A4.mp3",
              C5: "C5.mp3",
              "D#5": "Ds5.mp3",
              "F#5": "Fs5.mp3",
              A5: "A5.mp3",
              C6: "C6.mp3",
              "D#6": "Ds6.mp3",
              "F#6": "Fs6.mp3",
              A6: "A6.mp3",
              C7: "C7.mp3",
              "D#7": "Ds7.mp3",
              "F#7": "Fs7.mp3",
              A7: "A7.mp3",
              C8: "C8.mp3"
            },
            release: 1,
            baseUrl: "https://tonejs.github.io/audio/salamander/"
          }).toDestination();
    }

    getSampler(){
        return this.sampler;
    }

    pressActionProgression(index){
        console.log('Clicked progression...' + index);
        
        //if none is playing
        if(this.indexPlaying < 0){
            //play the progression
            this.indexPlaying = index;
            //PLAY!!!
            this.players[index].playProgression(this.settingsPlayer);
        }else if(this.indexPlaying == index){
            // if some progression is playing  - is the same index
            //STOP OLD!!!
            this.players[index].stopProgression();
            this.indexPlaying = -1;
        }else { //diff index: stop playing previous and start playing the new one
            //STOP OLD!!!
            this.players[this.indexPlaying].stopProgression();
           
            //PLAY NEW!!!
            this.players[index].playProgression(this.settingsPlayer);
            this.indexPlaying = index;
        }
    }

    stopCurrentProgression(){
        if(this.indexPlaying > -1){
            this.players[this.indexPlaying].stopProgression();
            this.indexPlaying = -1;
        }
    }

    createAllItems(){
        console.log("Creating progression items PagePlayer");
        this.progressions.forEach((progression, index)=> {
                    this.createItem(progression.getAllChords(), index);
        });
    }

    createItem(arrayOfChords,index) {

        var itemList = document.getElementById('item-list');

        var itemWrap = document.createElement('div');
        itemWrap.classList.add('item-player-wrap');

        var item = document.createElement('div');
        item.classList.add('item-player');

        var topWrap = document.createElement('div');
        topWrap.classList.add('top-wrap');

        // Create and append span elements to topWrap
        
        arrayOfChords.forEach(function(chord) {
            var span = document.createElement('span');
            span.textContent = chord.getName();
            topWrap.appendChild(span);
        });

        var controlWrap = document.createElement('div');
        controlWrap.classList.add('control-wrap');

        var playWrap = document.createElement('div');
        playWrap.classList.add('play-wrap');

        var playIcon = document.createElement('img');
        playIcon.classList.add('control-icon');
        playIcon.setAttribute('id', 'action-' + index);
        playIcon.src = playImgSrc;
        playIcon.alt = '';
        playIcon.addEventListener('click', () => {
                    // Call playProgression within the context of the PagePlayer instance
                    this.pressActionProgression(Number(index));
                });

        var progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');

        var progressIcon = document.createElement('img');
        progressIcon.classList.add('progress');
        progressIcon.src = progressImgSrc;
        progressIcon.alt = '';

        var coverIcon = document.createElement('img');
        coverIcon.setAttribute('id', 'cover-' + index);
        coverIcon.classList.add('cover');
        coverIcon.src = coverImgSrc;
        coverIcon.alt = '';

        progressContainer.appendChild(progressIcon);
        progressContainer.appendChild(coverIcon);

        playWrap.appendChild(playIcon);
        playWrap.appendChild(progressContainer);

        var controlIcon = document.createElement('img');
        controlIcon.classList.add('control-icon');
        controlIcon.addEventListener('click', () => {
                // Copy progression to clipboard
                this.players[index].copyToClipbard();
                });
        controlIcon.src = circleImgSrc;
        controlIcon.alt = '';

        controlWrap.appendChild(playWrap);
        controlWrap.appendChild(controlIcon);

        item.appendChild(topWrap);
        item.appendChild(controlWrap);

        itemWrap.appendChild(item);

        itemList.appendChild(itemWrap);
    }
}

