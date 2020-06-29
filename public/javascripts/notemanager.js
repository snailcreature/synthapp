// Holder for all note data

// Notes on the score
const keys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

/**
 * Holds the values for a playable note.
 * @class
 */
class Note  {
    /**
     * @param {number} time - When the note will start.
     * @param {String} note - The pitch to play.
     * @param {number} length - How long to hold the note for.
     * @param {number} velocity - How hard to play the note. Influences lifetime.
     */
    constructor(time, note, length, velocity)   {
        this.time = time;
        this.note = note;
        this.length = length;
        this.velocity = velocity;
    }
}


/**
 * Holds the data for a line drawn on the score.
 * @class
 */
class NoteLine  {
    /**
     * @constructor
     * @memberof NoteLine
     * @param {number} startX - Starting X coord of the line.
     * @param {number} startY - Starting Y coord of the line.
     */
    constructor(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX;
        this.points = [[startX, startY]]
        this.length = 0;
    }

    /**
     * Adds a point to the line.
     * @function addPoint
     * @memberof NoteLine
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate
     */
    addPoint(x, y)  {
        this.points.push([x, y]);
        if (x > this.endX)  {
            this.endX = x;
        }
        else if (x < this.startX)   {
            this.startX = x;
        }
    }

    /**
     * Convert the line to a playable note object.
     * @function toNote
     * @memberof NoteLine
     * @returns {Note}
     */
    toNote()    {
        return new Note(this.getStartBeat(), this.getKey(), this.getNoteLength(), 1);
    }

    /**
     * Get the note to play.
     * @function getKey
     * @memberof NoteLine
     * @returns {string}
     */
    getKey()    {
        let numKey = parseInt(this.startY/25);
        return keys[numKey];
    }

    /**
     * Get the starting beat count of the note relative to the tempo.
     * @function getStartBeat
     * @memberof NoteLine
     * @returns {number}
     */
    getStartBeat()  {
        return Tone.Time("8n")*parseInt(this.startX/50);
    }

    /**
     * Get the length of the note relative to the tempo.
     * @function getNoteLength
     * @memberof NoteLine
     * @returns {number}
     */
    getNoteLength() {
        let startBeat = parseInt(this.startX/50);
        let endBeat = parseInt(this.endX/50);
        return Tone.Time("8n")*(endBeat-startBeat);
    }
}