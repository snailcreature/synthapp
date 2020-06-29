'use strict';

// main.js should only contain eventlistener additions

// Create the synth
//let synth = new Tone.Synth().toMaster();
const synth = new Tone.PolySynth(6, Tone.Synth);
const masterVol = new Tone.Volume();
synth.chain(masterVol, Tone.Master);
// Create a part to play the notes using the synth
let count = 0;
const part = new Tone.Part(function(time, value){
    synth.triggerAttackRelease(value.note, value.length, time, value.velocity);
    count++;
    if (count >= this.length)   {
        synth.releaseAll(`+${value.length}`);
        count = 0;
    }
}, []);

Tone.Transport.length = Tone.Time("8n")*16;

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
    synth.releaseAll();
    synth.triggerAttackRelease("C4", "4n");
}

/**
 * Play the score that has been created on the canvasmanager.
 * @function
 */
function playScore()    {
    // Stop the part from playing and reset the Transport
    part.stop(0);
    Tone.Transport.pause("+0.1");
    Tone.Transport.seconds = 0;

    // Remove all notes from the part.
    part.removeAll();

    // Get the current score on the canvasmanager
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
    synth.releaseAll();
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
    //synth.oscillator.type = typeSelect.value;
    synth.set({
        "oscillator": {
            "type": typeSelect.value
        }
    });
});
attackCtl.addEventListener('change', function () {
    //synth.envelope.attack = attackCtl.value;
    synth.set({
        "envelope": {
            "attack": attackCtl.value
        }
    });
});
decayCtl.addEventListener('change', function ()  {
    //synth.envelope.decay = decayCtl.value;
    synth.set({
        "envelope": {
            "decay": decayCtl.value
        }
    });
});
sustainCtl.addEventListener('change', function ()   {
    //synth.envelope.sustain = sustainCtl.value;
    synth.set({
        "envelope": {
            "sustain": sustainCtl.value
        }
    });
});
releaseCtl.addEventListener('change', function ()   {
    //synth.envelope.release = releaseCtl.value;
    synth.set({
        "envelope": {
            "release": releaseCtl.value
        }
    });
});

window.addEventListener('load', loadpage);


