'use strict';

const synth = new Tone.Synth().toMaster();

function loadpage() {
    Tone.start();
    console.log("Audio ready");
}

async function playTone() {
    synth.triggerAttackRelease("C4", "8n");
}

document.querySelector("#playBttn").addEventListener('click', playTone);

window.addEventListener('load', loadpage);


