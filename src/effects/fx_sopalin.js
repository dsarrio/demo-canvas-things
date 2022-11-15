class FxSopalin {

    constructor() {
        this.loading = {progress: 0, total: 2};
    }

    init() {
        
        
        setTimeout(() => {
            this.initDottedFlower();
            this.loading.progress++;
            
            this.ocanvas = document.createElement('canvas');
            this.ocanvas.width = 1920 / 2;
            this.ocanvas.height = 1200 / 2;
            this.octx = newContext(this.ocanvas);

            this.ocanvas2 = document.createElement('canvas');
            this.ocanvas2.width = 1920 / 2;
            this.ocanvas2.height = 1200 / 2;
            this.octx2 = newContext(this.ocanvas2);

            this.loading.progress++;
        }, 1);
    }

    initDottedFlower() {
        this.dottedFlowerDots = [];
        const petalShape = this.dottedPetalShape();

        const toPath = (points, tx) => {
            const r = new Path2D();
            for (var i = 0; i < 3; i++) {
                for (const p of points) {
                    const pos = Vector2.rotated(tx(p), 2/3 * Math.PI * i);
                    this.dottedFlowerDots.push(pos);
                    r.moveTo(pos.x, pos.y);
                    r.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                }    
            }
            return r;
        }

        // outer ring
        const lPoints = this.dividePath(petalShape, 40);
        lPoints.splice(0, 6);
        lPoints.splice(-7, 7);
        this.LPath = toPath(lPoints, ({x,y}) => P(x * 1.3, y * 1.1 - 88));

        // medium ring
        const mPoints = this.dividePath(petalShape, 28);
        mPoints.splice(0, 2);
        mPoints.splice(-2, 2);
        this.MPath = toPath(mPoints, ({x,y}) => P(x * 0.9, y * 0.75));

        // inner ring
        const sPoints = this.dividePath(petalShape, 14);
        sPoints.splice(0, 1);
        this.SPath = toPath(sPoints, ({x,y}) => P(x * 0.5, y * 0.45 + 74.4));

        // middle points
        this.InnerDots = toPath([P(0, 183)], (p) => p);
        this.dottedFlowerDots.push(P(0, 0));
        this.InnerDots.moveTo(0, 0);
        this.InnerDots.arc(0, 0, 8, 0, Math.PI * 2);
    }

    renderDotterflower({ctx, time, pos, idx}) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(time);

        const t = (time/2) * 300 + 300;

        ctx.fillStyle = `hsl(${(t) % 360},100%,50%)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill(this.InnerDots);
        ctx.fillStyle = `hsla(${(t * 1.2) % 360},100%,50%, 1)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill(this.SPath);
        ctx.fillStyle = `hsla(${(t * 1.4) % 360},100%,50%, 1)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill(this.MPath);
        ctx.fillStyle = `hsla(${(t * 1.6) % 360},100%,50%, 1)`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill(this.LPath);
        ctx.restore();
    }

    renderStars({ctx, time}) {
        const dots = this.dottedFlowerDots;
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.clearRect(0, 0, 1920, 1200);
        ctx.translate(960, 600);
        ctx.scale(1.2, 1.2);
        for (var i = 0; i < dots.length; ++i) {
            const dot = dots[i];
            const n = cellnoise(dot.x * dot.y);
            const shown = n < tlerp(0, 15, 1, 0, time) ? 0 : 1;
            const flick = Math.cos(i + time*4) * 0.5 + 0.5 + tlerp(13, 15, 0, 0.5, time);
            ctx.fillStyle = rgba(1, 1, 1, shown * flick);
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);    
            ctx.fill();
        }
        ctx.restore();
    }

    renderShady({ctx, time}) {
        const dots = this.dottedFlowerDots;
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.clearRect(0, 0, 1920, 1200);
        ctx.translate(960, 600);
        ctx.scale(1.2, 1.2);
        for (var i = 0; i < dots.length; ++i) {
            const dot = dots[i];
            const f = (i / dots.length + time / 3) % 1;
            const ff = f < 0.5 ? f * 2 : 1 - (f - 0.5) * 2;
//            ctx.fillStyle = rgba(1, 1, 1, ff);
            ctx.fillStyle = rgba(1,1,1,noise1D((dot.x * dot.y)/50 + time)*0.5+0.5);
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);    
            ctx.fill();
        }
        ctx.restore();
    }

    renderColored({ctx, time}) {
        const dots = this.dottedFlowerDots;
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.clearRect(0, 0, 1920, 1200);
        ctx.translate(960, 600);
        ctx.scale(1.2, 1.2);
        for (var i = 0; i < dots.length; ++i) {
            const dot = dots[i];
            const hue = (i + time * 10) * 10;

            ctx.fillStyle = `hsl(${hue % 360},100%,60%)`;
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);    
            ctx.fill();
        }
        ctx.restore();
    }

    renderTest({ctx, time}) {
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1920, 1200);
        
        for (var x = 0; x < 1920; x += 13) {
            const n = noise1D(x/50)*0.5+0.5;
            ctx.fillStyle = rgba(1,1,1, n);
            ctx.fillRect(x, 0, 10, 1200);
        }

        ctx.restore();
    }

    render({ctx, time}) {
        this.renderStars({ctx: this.octx, time});
        this.renderColored({ctx: this.octx2, time});

        // render flowers
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1920, 1200);

        ctx.globalAlpha = (time < 28) ? 1 - step(20, 23, time)*0.8 : 1;

        for (var i = -1; i < 4; ++i) {
            var y = i*(100+218) + 200;

            for (var j = 0; j < 8; ++j) {
                var x = j*(196+82);
                var yy = y + ((j % 2 > 0) ? 159 : 0);

                var wavepos = tlerp(17, 18, 0-600, 1920+600, time);
                var wavef = 1 - easeout(saturate(Math.abs(x-wavepos) / 500));
                yy -= wavef * 80;    

                ctx.save();
                ctx.translate(x, yy);
                ctx.scale(1 - wavef, 1);
                ctx.rotate(Math.PI*2/3*(j+i));

                if (time > 28) { // chaos
                    const n = noise2D(x, y);
                    ctx.scale(Math.sin(n * time), Math.cos(n * time));
                    ctx.translate(Math.sin(n * time) * 400, Math.cos(n * time) * 400);
                    ctx.rotate(Math.sin(n * time));
                }

                if (x > wavepos) {
                    ctx.drawImage(this.ocanvas, 0, 0, this.ocanvas.width, this.ocanvas.height, - this.ocanvas.width / 2, - this.ocanvas.height/2, this.ocanvas.width, this.ocanvas.height);            
                } else {
                    ctx.drawImage(this.ocanvas2, 0, 0, this.ocanvas2.width, this.ocanvas2.height, - this.ocanvas2.width / 2, - this.ocanvas2.height/2, this.ocanvas2.width, this.ocanvas2.height);            
                }

                ctx.restore();
            }    
        }

        ctx.restore();
    }

    dividePath(path, nb_subdivs) {
        var total_length = 0;
        const segment_length = [];

        for (var i = 1; i < path.length; i++) {
            const l = Math.hypot(path[i].x - path[i-1].x, path[i].y - path[i-1].y);
            segment_length.push(l);
            total_length += l;
        }

        const subdiv_length = total_length / nb_subdivs;
        const edges = [path[0]];

        var pi = 0;
        var A = path[0];
        var B = path[1];
        var l = segment_length[0];
        var r = subdiv_length;
        var d = 0;
        while (edges.length <= nb_subdivs) {
            while (r - l > 0.0000001) {
                r -= l;
                pi++;
                A = path[pi];
                B = path[pi + 1];
                l = segment_length[pi];
                d = 0;
            }

            const f = (d + r) / segment_length[pi];
            const x = lerp(A.x, B.x, f);
            const y = lerp(A.y, B.y, f);
            edges.push(P(x,y));
            d += r;
            l -= r;
            r = subdiv_length;
        }

        return edges;
    }

    dottedPetalShape() {
        const p1 = [];
        const p2 = [];
        const s = Math.sqrt(14) / 50;
        for (var i = 0; i <= 50; i++) {
            const y = s * i;
            const b = 1 - ((y**2 / 7) - 1)**2;
            const x = (b < 0 ? 0 : Math.sqrt(b));
            p1.push(P(x * 100, y * 100));
            p2.unshift(P(-x * 100, y * 100));
        }
        return [...p1, ...p2];
    }
}
