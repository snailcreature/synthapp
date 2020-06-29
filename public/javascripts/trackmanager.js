// Manager for tracks

class Track {
    let id;

    let instrument;

    let canvas;
    let ctx;
    let noteman;

    constructor(id) {
        this.id = id;
        this.instrument = Tone.PolySynth();
    }

    init()  {
        document.body.innerHTML += `<section class="track" id="tracksection-${this.id}"><canvas id="trackcanvas-${this.id}" width="${widthPerBeat}" height="${trackHeight}"></canvas></section>`;
        this.canvas = document.querySelector(`#trackcanvas-${this.id}`);
        this.ctx = this.canvas.getContext('2d');
    }

}