class DrawingApp {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private isDrawing: boolean = false;
    private currentColor: string = '#000000';
    private currentLineWidth: number = 5;

    constructor() {
        this.canvas = document.getElementById('drawingCanvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.setupCanvas();
        this.addEventListeners();
        this.loadControls();
    }

    private setupCanvas(): void {
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerHeight * 0.7;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = this.currentLineWidth;
    }

    private addEventListeners(): void {
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        document.getElementById('color')?.addEventListener('change', (e) => {
            this.currentColor = (e.target as HTMLInputElement).value;
            this.context.strokeStyle = this.currentColor;
        });

        document.getElementById('lineWidth')?.addEventListener('change', (e) => {
            this.currentLineWidth = parseInt((e.target as HTMLInputElement).value);
            this.context.lineWidth = this.currentLineWidth;
        });

        document.getElementById('clearBtn')?.addEventListener('click', this.clearCanvas.bind(this));
    }

    private startDrawing(event: MouseEvent): void {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
    }

    private draw(event: MouseEvent): void {
        if (!this.isDrawing) return;
        this.context.lineTo(event.offsetX, event.offsetY);
        this.context.stroke();
    }

    private stopDrawing(): void {
        this.isDrawing = false;
        this.context.closePath();
    }

    private clearCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private loadControls(): void {
        (document.getElementById('color') as HTMLInputElement).value = this.currentColor;
        (document.getElementById('lineWidth') as HTMLInputElement).value = this.currentLineWidth.toString();
    }
}

new DrawingApp();

