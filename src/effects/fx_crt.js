class FxCRT {
    
    constructor() {
        this.loading = {progress: 0, total: 4};
    }

    init({width, height}) {
        
        setTimeout(() => {
            this.turnOnCanvasCtx = newContext(this.turnOnCanvas = newCanvas(width, height));
            this.loading.progress++;            

            const overlayCtx = newContext(this.crtOverlay = newCanvas(width, height));
            this.drawLines(overlayCtx);
            this.drawFrame(overlayCtx);
            this.loading.progress++;            

            this.tearingCtx = newContext(this.tearingCanvas = newCanvas(width, height));
            this.loading.progress++;

            this.generateNoise(width, height);
            this.loading.progress++;
        }, 1);
    }

    drawLines(ctx) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(210, 210, 210, 0.15)';

        for (var i = 0; i < ctx.H/2; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i*5);
            ctx.lineTo(ctx.W, i*5);
            ctx.stroke();
        }
    }

    drawFrame(ctx) {
        ctx.save();
        const sW = ctx.W / 1920;
        const sH = ctx.H / 1200;
        ctx.scale(sW, sH);

        const offset = 10;
        const radstart = 700;
        ctx.lineWidth = 5;
        ctx.fillStyle = '#000';
        ctx.shadowColor = '#000';
        for (var i = 0; i < 10; i++) {
            ctx.shadowBlur = 30 - i * 2;
            ctx.beginPath();
            ctx.moveTo(offset + radstart, offset);

            ctx.lineTo(1920 - offset - radstart, offset);
            ctx.bezierCurveTo(
                1920 + 10, offset,
                1920 - offset, -10,
                1920 - offset, offset + radstart
            );

            ctx.lineTo(1920 - offset, 1200 - offset - radstart);
            ctx.bezierCurveTo(
                1920 - offset, 1200 + 10,
                1920 + 10, 1200 - offset,
                1920 - offset - radstart, 1200 - offset
            );

            ctx.lineTo(offset + radstart, 1200 - offset);
            ctx.bezierCurveTo(
                -10, 1200 - offset,
                offset, 1200 - offset + 10,
                offset, 1200 - offset - radstart
            );

            ctx.lineTo(offset, offset + radstart);
            ctx.bezierCurveTo(
                offset, -10,
                -10, offset,
                offset + radstart, offset
            );

            ctx.rect(1920, 0, -1920, 1200);
            ctx.fill();
        }
        ctx.restore();
    }

    generateNoise(width, height) {
        const ctx = newContext(this.noiseCanvas = newCanvas(width*2, height*2));
        const imgData = ctx.createImageData(ctx.W, ctx.H);
        const imgBuff = imgData.data;
        for (var i = 0, n = imgBuff.length; i < n; i += 4) {
            imgBuff[i] = imgBuff[i+1] = imgBuff[i+2] = Math.random() * 255;
            imgBuff[i+3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    renderTurnOn({ctx, time}) {
        this.turnOnCanvasCtx.save();
        this.turnOnCanvasCtx.clearRect(0, 0, ctx.W, ctx.H);
        this.turnOnCanvasCtx.fillStyle = '#fff';
        const s1 = step(0, 0.4, time);
        const w = easein(s1) * ctx.W;
        const s2 = step(0.4, 1.0, time);
        const h = easeout(s2) * ctx.H;
        this.turnOnCanvasCtx.shadowColor = '#fff';
        this.turnOnCanvasCtx.shadowBlur = 80;
        this.turnOnCanvasCtx.fillRect(ctx.W / 2 - w / 2, ctx.H / 2 - h / 2, w, h + 2);
        this.turnOnCanvasCtx.globalCompositeOperation = 'source-atop';
        const ox = (ctx.W * -Math.random())|0;
        const oy = (ctx.H * -Math.random())|0;
        this.turnOnCanvasCtx.drawImage(this.noiseCanvas, ox, oy);      
        this.render({ctx: this.turnOnCanvasCtx, time});
        this.turnOnCanvasCtx.restore();

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, ctx.W, ctx.H);
        ctx.drawImage(this.turnOnCanvas, 0, 0);
    }

    render({ctx, time}) {
        if (time > 6 && time % 10 < 0.2) {
            this.tearingCtx.fillStyle = '#000';
            this.tearingCtx.fillRect(0, 0, ctx.W, ctx.H);
            const tp = { x: 20, y: Math.random() * ctx.H };
            this.tearingCtx.drawImage(ctx.canvas, 0, 0, ctx.W, tp.y, 0, 0, ctx.W, tp.y);
            this.tearingCtx.drawImage(ctx.canvas,
                0, tp.y, ctx.W - tp.x, ctx.H - tp.y,
                tp.x, tp.y, ctx.W - tp.x, ctx.H - tp.y
            );
            this.tearingCtx.drawImage(ctx.canvas,
                ctx.W - tp.x, tp.y, tp.x, ctx.H - tp.y,
                0, tp.y, tp.x, ctx.H - tp.y
            );
            ctx.drawImage(this.tearingCanvas, 0, 0);
        }

        const h = time * 120 % (ctx.H + 80) - 80;
        const gradient = ctx.createLinearGradient(0, h-40, 0, h+40);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, h - 40, ctx.W, 80);

        ctx.drawImage(this.crtOverlay, 0, 0);
    }
}
