'use strict';

// canvasmanager.js should only contain rendering services

// Canvas element
const canvas= document.querySelector("#sequencer");

// Canvas rendering context
const ctx = canvas.getContext('2d');

/**
 * Score object for managing the canvas
 * @class
 */
class Score {
    canvas;
    ctx;
    lineman;

    /**
     *
     * @param {Element} canvas - The canvas element to draw on.
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');

        this.lineman = new LineManager(this.ctx);

        // Assign event listeners to the canvasmanager
        this.canvas.addEventListener("mousemove", function (e) {
            this.lineman.onMove(e);
        }, false);
        this.canvas.addEventListener("mousedown", function (e) {
            this.lineman.onDown(e);
        }, false);
        this.canvas.addEventListener("mouseup", function (e) {
            this.lineman.onUpOrOut(e);
        }, false);
        this.canvas.addEventListener("mouseout", function (e) {
            this.lineman.onUpOrOut(e);
        }, false);
    }

    /**
     * Create a blank score to draw on.
     * @function drawBlankScore
     * @memberof Score
     */
    drawBlankScore()    {
        let width = widthPerBeat * timeSig;
        let division = widthPerBeat / resolution;
        this.ctx.clearRect(0, 0, width, trackHeight);
        this.ctz.strokeRect(0, 0, width, trackHeight);

        this.ctx.font = '16px serif';
        ctx.strokeStyle = 'grey';

        for (let x = division; x < width; x += division)    {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, 200);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        for (let y = trackHeight/keys.length; y <= trackHeight; y += trackHeight/keys.length)   {
            this.ctx.fillText(keys[(y/25)-1], 0, y);

            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(800, y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
}


/**
 * Create a blank score to draw on.
 * @function drawBlankScore
 */
function drawBlankScore()   {
    // Clear the canvasmanager
    ctx.clearRect(0, 0, 800, 200);
    // Draw a box around the canvasmanager
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

    ctx;

    /**
     *
     * @param {Object} context - The rendering context to draw with.
     */
    constructor(context)    {
        this.ctx = context;
    }

    /**
     * Draw the next line segment to the canvasmanager.
     * @function draw
     * @memberof LineManager
     */
    draw()  {
        this.ctx.beginPath();
        this.ctx.moveTo(this.prevX, this.prevY);
        this.ctx.lineTo(this.currX, this.currY);
        this.ctx.strokeStyle = "red";
        this.ctx.stroke();
        this.ctx.closePath();
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
     * When the mouse button is released or leaves the canvasmanager, finish the line and add it to the list.
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
     * @returns {Note[]}
     */
    toNotes()   {
        let notes = [];
        for (let note of this.lines)    {
            notes.push(note.toNote());
        }
        return notes;
    }

    /**
     * Gets rid of stored lines, clearing the score.
     * @fuction clearAll
     * @memberof LineManager
     */
    clearAll()  {
        this.lines.length = 0;
    }
}

// Main line manager object
const lineman = new LineManager(ctx);

// Assign event listeners to the canvasmanager
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
