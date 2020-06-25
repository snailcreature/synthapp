'use strict';

let synth = new Tone.Synth().toMaster();

const typeSelect = document.querySelector("#type-select");

const attackCtl = document.querySelector("#attackctrl");
const decayCtl = document.querySelector("#decayctrl");
const sustainCtl = document.querySelector("#sustainctrl");
const releaseCtl = document.querySelector("#releasectrl");

function loadpage() {
    Tone.start();
    console.log("Audio ready");
}

async function playTone() {

    synth.oscillator.type = typeSelect.value;
    synth.envelope.attack = attackCtl.value;
    synth.envelope.decay = decayCtl.value;
    synth.envelope.sustain = sustainCtl.value;
    synth.envelope.release = releaseCtl.value;

    synth.triggerAttackRelease("C4", "8n");
}

document.querySelector("#testBttn").addEventListener('click', playTone);

window.addEventListener('load', loadpage);


