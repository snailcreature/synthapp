'use strict';

// Canvas element
const canvas = document.querySelector("#sequencer");

// Canvas rendering context
const ctx = canvas.getContext('2d');

// Notes on the score
const keys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];

// Draw a box around the canvas
ctx.strokeRect(0, 0, 800, 200);
ctx.font = '16px serif';
ctx.strokeStyle = "grey";

// Draw the beat divisions
for (let x = 50; x < 800; x += 50)   {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 200);
    ctx.closePath();
    ctx.stroke();
}

// Draw the note divisions
for (let y = 25; y <= 200; y += 25)  {
    ctx.fillText(keys[(y/25)-1], 0, y);

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.closePath();
    ctx.stroke();
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
     * @returns {{note: string, length: number, time: number, velocity: number}}
     */
    toNote()    {
        return {"time": this.getStartBeat(), "note": this.getKey(), "length": this.getNoteLength(), "velocity": 1};
    }

    /**
     * Get the note to play.
     * @function getKey
     * @memberof NoteLine
     * @returns {string}
     */
    getKey()    {
        let numKey = parseInt(this.startY/25);
        console.log(numKey);
        return keys[numKey];
    }

    /**
     * Get the starting beat count of the note relative to the tempo.
     * @function getStartBeat
     * @memberof NoteLine
     * @returns {number}
     */
    getStartBeat()  {
        return Tone.Time("8n")*parseInt(this.startX/50)+1;
    }

    /**
     * Get the length of the note relative to the tempo.
     * @function getNoteLength
     * @memberof NoteLine
     * @returns {number}
     */
    getNoteLength() {
        return Tone.Time("8n")*parseInt(((this.endX-this.startX)/50)+1);
    }
}

/**
 * Manage the lines drawn on the score.
 * @class
 */
class LineManager   {
    flag = false;
    prevX = 0;
    prevY = 0;
    currX = 0;
    currY = 0;

    lines = [];

    currLine;

    /**
     * Draw the next line segment to the canvas.
     * @function draw
     * @memberof LineManager
     */
    draw()  {
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.currX, this.currY);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * When the mouse button is pressed down, get its position and create a new NoteLine object to store its features.
     * @function onDown
     * @memberof LineManager
     * @param {MouseEvent} e - Mouse attributes on event call.
     */
    onDown(e)  {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - canvas.offsetLeft;
        this.currY = e.clientY - canvas.offsetTop;

        this.flag = true;

        this.currLine = new NoteLine(this.currX, this.currY);
    }

    /**
     * When the mouse button is released or leaves the canvas, finish the line and add it to the list.
     * @function onUpOrOut
     * @memberof LineManager
     * @param {MouseEvent} e - Mouse attributes on event call.
     */
    onUpOrOut(e)   {
        this.flag = false;
        this.lines.push(this.currLine);
    }

    /**
     * When the mouse moves, add to the line created.
     * @function onMove
     * @memberof LineManager
     * @param {MouseEvent} e - Mouse attributes on event call.
     */
    onMove(e)  {
        if (this.flag) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - canvas.offsetLeft;
            this.currY = e.clientY - canvas.offsetTop;
            this.draw();

            this.currLine.addPoint(this.currX, this.currY);
        }

    }

    /**
     * Convert all stored NotLine objects into playable note objects.
     * @function toNotes
     * @memberof LineManager
     * @returns {{note: string, length: number, time: number, velocity: number}[]}
     */
    toNotes()   {
        let notes = [];
        for (let note of this.lines)    {
            notes.push(note.toNote());
        }
        return notes;
    }
}

// Main line manager object
const lineman = new LineManager();

// Assign event listeners to the canvas
canvas.addEventListener("mousemove", function (e) {
    lineman.onMove(e);
}, false);
canvas.addEventListener("mousedown", function (e) {
    lineman.onDown(e);
}, false);
canvas.addEventListener("mouseup", function (e) {
    lineman.onUpOrOut(e);
}, false);
canvas.addEventListener("mouseout", function (e) {
    lineman.onUpOrOut(e);
}, false);
