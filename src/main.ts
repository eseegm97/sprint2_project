class DrawingApp {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private isDrawing: boolean = false;
    private currentColor: string = '#000000';
    private currentLineWidth: number = 5;
    private undoStack: ImageData[] = [];
    private redoStack: ImageData[] = [];
    private maxHistory: number = 10;
    private debug: boolean = true;

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
        document.getElementById('undoBtn')?.addEventListener('click', this.undo.bind(this));
        document.getElementById('redoBtn')?.addEventListener('click', this.redo.bind(this));
        document.getElementById('fractalBtn')?.addEventListener('click', () => {
            this.log('Fractal button clicked');
            this.snapshot();
            this.drawFractal(this.canvas.width / 2, this.canvas.height / 2, Math.min(this.canvas.width, this.canvas.height) * 0.25, 6);
        });
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveCanvas());
        document.getElementById('loadBtn')?.addEventListener('click', () => (document.getElementById('loadInput') as HTMLInputElement).click());
        document.getElementById('loadInput')?.addEventListener('change', (e) => this.loadFromFile(e));
    }

    private startDrawing(event: MouseEvent): void {
        this.isDrawing = true;
        this.context.beginPath();
        this.context.moveTo(event.offsetX, event.offsetY);
        this.log('startDrawing', event.offsetX, event.offsetY);
    }

    private draw(event: MouseEvent): void {
        if (!this.isDrawing) return;
        this.context.lineTo(event.offsetX, event.offsetY);
        this.context.stroke();
    }

    private stopDrawing(): void {
        this.isDrawing = false;
        this.context.closePath();
        this.log('stopDrawing');
        this.snapshot();
    }

    private clearCanvas(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.log('clearCanvas');
        this.snapshot();
    }

    private loadControls(): void {
        (document.getElementById('color') as HTMLInputElement).value = this.currentColor;
        (document.getElementById('lineWidth') as HTMLInputElement).value = this.currentLineWidth.toString();
    }

    private log(...args: any[]) {
        if (this.debug) console.log('[DrawingApp]', ...args);
    }

    private snapshot(): void {
        try {
            const data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.undoStack.push(data);
            if (this.undoStack.length > this.maxHistory) this.undoStack.shift();
            this.redoStack = [];
            this.log('snapshot saved, undoSize=', this.undoStack.length);
        } catch (e) {
            this.log('snapshot failed:', e);
        }
    }

    private undo(): void {
        if (this.undoStack.length === 0) {
            this.log('undo: no history');
            return;
        }
        const last = this.undoStack.pop()!;
        try {
            const current = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.redoStack.push(current);
            this.context.putImageData(last, 0, 0);
            this.log('undo performed, undoSize=', this.undoStack.length, 'redoSize=', this.redoStack.length);
        } catch (e) {
            this.log('undo failed:', e);
        }
    }

    private redo(): void {
        if (this.redoStack.length === 0) {
            this.log('redo: no history');
            return;
        }
        const next = this.redoStack.pop()!;
        try {
            const current = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
            this.undoStack.push(current);
            this.context.putImageData(next, 0, 0);
            this.log('redo performed, undoSize=', this.undoStack.length, 'redoSize=', this.redoStack.length);
        } catch (e) {
            this.log('redo failed:', e);
        }
    }

    private drawFractal(x: number, y: number, size: number, depth: number): void {
        if (depth <= 0 || size < 1) return;
        this.context.beginPath();
        this.context.strokeStyle = this.currentColor;
        this.context.lineWidth = Math.max(1, this.currentLineWidth * (depth / 6));
        this.context.arc(x, y, size, 0, Math.PI * 2);
        this.context.stroke();
        this.context.closePath();
        this.drawFractal(x + size * 0.6, y, size * 0.5, depth - 1);
        this.drawFractal(x - size * 0.6, y, size * 0.5, depth - 1);
        this.drawFractal(x, y + size * 0.6, size * 0.5, depth - 1);
        this.drawFractal(x, y - size * 0.6, size * 0.5, depth - 1);
    }

    private async saveCanvas(): Promise<void> {
        this.log('saveCanvas: starting');
        const blob: Blob | null = await new Promise(resolve => this.canvas.toBlob(resolve, 'image/png'));
        if (!blob) {
            this.log('saveCanvas: toBlob returned null');
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'drawing.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        this.log('saveCanvas: download triggered');
    }

    private async loadFromFile(e: Event | any): Promise<void> {
        const input = e.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;
    const file = input.files[0]!;
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            this.snapshot();
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            URL.revokeObjectURL(url);
            (input as HTMLInputElement).value = '';
            this.log('loadFromFile: image loaded');
        };
        img.onerror = (err) => {
            this.log('loadFromFile: load error', err);
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
}

new DrawingApp();