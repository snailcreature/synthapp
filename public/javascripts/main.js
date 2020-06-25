'use strict';

let synth = new Tone.Synth().toMaster();
const part = new Tone.Part(function(time, value){
    synth.triggerAttackRelease(value.note, value.length, time, value.velocity);
}, []);

const typeSelect = document.querySelector("#type-select");

const attackCtl = document.querySelector("#attackctrl");
const decayCtl = document.querySelector("#decayctrl");
const sustainCtl = document.querySelector("#sustainctrl");
const releaseCtl = document.querySelector("#releasectrl");

function loadpage() {
    Tone.start();
    console.log("Audio ready");
}

function playTone() {

    synth.oscillator.type = typeSelect.value;
    synth.envelope.attack = attackCtl.value;
    synth.envelope.decay = decayCtl.value;
    synth.envelope.sustain = sustainCtl.value;
    synth.envelope.release = releaseCtl.value;

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

window.addEventListener('load', loadpage);


