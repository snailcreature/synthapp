'use strict';

// Create the synth
let synth = new Tone.Synth().toMaster();
// Create a part to play the notes using the synth
const part = new Tone.Part(function(time, value){
    synth.triggerAttackRelease(value.note, value.length, time, value.velocity);
}, []);

// Store the control panel elements
const typeSelect = document.querySelector("#type-select");

const attackCtl = document.querySelector("#attackctrl");
const decayCtl = document.querySelector("#decayctrl");
const sustainCtl = document.querySelector("#sustainctrl");
const releaseCtl = document.querySelector("#releasectrl");

/**
 * When the page loads, start Tone.js
 * @function
 */
function loadpage() {
    Tone.start();
}

// Play a middle C on the synth
function playTone() {
    synth.triggerAttackRelease("C4", "4n");
}


function playScore()    {
    part.stop(0);
    Tone.Transport.pause("+0.1");
    Tone.Transport.seconds = 0;

    part.removeAll();

    let score = lineman.toNotes();
    let note;
    for (note of score) {
        part.add(note);
    }

    Tone.Transport.start("+0.1");
    part.start(0);
}

document.querySelector("#testBttn").addEventListener('click', playTone);
document.querySelector("#playBttn").addEventListener('click', playScore);

typeSelect.addEventListener('change', function ()   {
    synth.oscillator.type = typeSelect.value;
});
attackCtl.addEventListener('change', function () {
    synth.envelope.attack = attackCtl.value;
});
decayCtl.addEventListener('change', function ()  {
    synth.envelope.decay = decayCtl.value;
});
sustainCtl.addEventListener('change', function ()   {
    synth.envelope.sustain = sustainCtl.value;
});
releaseCtl.addEventListener('change', function ()   {
    synth.envelope.release = releaseCtl.value;
});

window.addEventListener('load', loadpage);


