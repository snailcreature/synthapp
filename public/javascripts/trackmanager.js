// Manager for tracks

class Track {
    id;

    instrument;

    score;
    noteman;

    constructor(id) {
        this.id = id;
        this.instrument = Tone.PolySynth();
    }

    init()  {
        document.body.innerHTML += `<section class="track" id="tracksection-${this.id}"><canvas id="trackcanvas-${this.id}" width="${widthPerBeat}" height="${trackHeight}"></canvas></section>`;
        canvas = document.querySelector(`#trackcanvas-${this.id}`);

        this.score = new Score(canvas);
    }

}