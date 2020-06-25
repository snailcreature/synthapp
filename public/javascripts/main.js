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
    drawBlankScore();
}

/**
 * Play a middle C using the synth.
 * @function
 */
function playTone() {
    synth.triggerAttackRelease("C4", "4n");
}

/**
 * Play the score that has been created on the canvas.
 * @function
 */
function playScore()    {
    // Stop the part from playing and reset the Transport
    part.stop(0);
    Tone.Transport.pause("+0.1");
    Tone.Transport.seconds = 0;

    // Remove all notes from the part.
    part.removeAll();

    // Get the current score on the canvas
    let score = lineman.toNotes();
    for (const note of score) {
        part.add(note);
    }

    // Restart the transport and play the score
    Tone.Transport.start("+0.1");
    part.start(0);
}

/**
 * Clear the score for fresh masterpieces.
 * @function clearScore
 */
function clearScore()   {
    drawBlankScore();
    lineman.clearAll();
}

// Set up event listeners
// Buttons
document.querySelector("#testBttn").addEventListener('click', playTone);
document.querySelector("#playBttn").addEventListener('click', playScore);
document.querySelector("#clearBttn").addEventListener('click', clearScore);

// Control panel
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


