"use strict";
class DrawingApp {
    constructor() {
        this.isDrawing = false;
        this.currentColor = '#000000';
        this.currentLineWidth = 5;
        this.canvas = document.getElementById('drawingCanvas');
        this.context = this.canvas.getContext('2d');
        this.setupCanvas();
        this.addEventListeners();
        this.loadControls();
    }
    setupCanvas() {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.7;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = this.currentLineWidth;
    }
    addEventListeners() {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        document.getElementById('color')?.addEventListener('change', (e) => {
            this.currentColor = e.target.value;
            this.context.strokeStyle = this.currentColor;
        });
        document.getElementById('lineWidth')?.addEventListener('change', (e) => {
            this.currentLineWidth = parseInt(e.target.value);
            this.context.lineWidth = this.currentLineWidth;
        });
        document.getElementById('clearBtn')?.addEventListener('click', this.clearCanvas.bind(this));
    }
    startDrawing(event) {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
    }
    draw(event) {
        if (!this.isDrawing)
            return;
        this.context.lineTo(event.offsetX, event.offsetY);
        this.context.stroke();
    }
    stopDrawing() {
        this.isDrawing = false;
        this.context.closePath();
    }
    clearCanvas() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    loadControls() {
        document.getElementById('color').value = this.currentColor;
        document.getElementById('lineWidth').value = this.currentLineWidth.toString();
    }
}
new DrawingApp();
//# sourceMappingURL=main.js.map