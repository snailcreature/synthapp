'use strict';

const canvas = document.querySelector("#sequencer");
const ctx = canvas.getContext('2d');

const keys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A5', 'B5', 'C5'];

ctx.strokeRect(0, 0, 800, 200);
ctx.font = '16px serif';
ctx.strokeStyle = "grey";

for (let x = 50; x < 800; x += 50)   {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 200);
    ctx.closePath();
    ctx.stroke();
}

for (let y = 25; y <= 200; y += 25)  {
    ctx.fillText(keys[(y/25)-1], 0, y);

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(800, y);
    ctx.closePath();
    ctx.stroke();
}

class NoteLine  {
    constructor(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = startX;
        this.points = [[startX, startY]]
        this.length = 0;
    }

    addPoint(x, y)  {
        this.points.push([x, y]);
        if (x > this.endX)  {
            this.endX = x;
        }
        else if (x < this.startX)   {
            this.startX = x;
        }
    }

    toNote()    {
        return {"time": this.getStartBeat(), "note": this.getKey(), "length": this.getNoteLength(), "velocity": 1};
    }

    getKey()    {
        let numKey = parseInt(this.startY/25);
        console.log(numKey);
        switch (numKey) {
            case 0:
                return "C4";
            case 1:
                return "D4";
            case 3:
                return "E4";
            case 4:
                return "F4";
            case 5:
                return "G4";
            case 6:
                return "A5";
            case 7:
                return "B5";
            case 8:
                return "C5";
            default:
                return "C4";
        }
    }

    getStartBeat()  {
        return Tone.Time("8n")*parseInt(this.startX/50)+1;
    }

    getNoteLength() {
        return Tone.Time("8n")*parseInt(((this.endX-this.startX)/50)+1);
    }
}

class LineManager   {
    flag = false;
    prevX = 0;
    prevY = 0;
    currX = 0;
    currY = 0;

    lines = [];

    currLine;

    draw()  {
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.currX, this.currY);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.closePath();
    }

    onDown(res, e)  {
        this.prevX = this.currX;
        this.prevY = this.currY;
        this.currX = e.clientX - canvas.offsetLeft;
        this.currY = e.clientY - canvas.offsetTop;

        this.flag = true;

        this.currLine = new NoteLine(this.currX, this.currY);
    }

    onUpOrOut(res, e)   {
        this.flag = false;
        this.lines.push(this.currLine);
    }

    onMove(res, e)  {
        if (this.flag) {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - canvas.offsetLeft;
            this.currY = e.clientY - canvas.offsetTop;
            this.draw();

            this.currLine.addPoint(this.currX, this.currY);
        }

    }

    toNotes()   {
        let notes = [];
        for (let note of this.lines)    {
            notes.push(note.toNote());
            console.log("AAAA")
        }
        return notes;
    }
}

const lineman = new LineManager();

canvas.addEventListener("mousemove", function (e) {
    lineman.onMove("move", e);
}, false);
canvas.addEventListener("mousedown", function (e) {
    lineman.onDown("down", e);
}, false);
canvas.addEventListener("mouseup", function (e) {
    lineman.onUpOrOut("up", e);
}, false);
canvas.addEventListener("mouseout", function (e) {
    lineman.onUpOrOut("out", e);
}, false);
