class FxCredits {
    
    constructor() {
        this.loading = {progress: 0, total: 1};
    }

    init() {
        setTimeout(() => {
            this.ocanvas2 = newCanvas(300, 300);
            this.octx2 = newContext(this.ocanvas2);
            this.ballImg = this.octx2.createImageData(300, 300);
            this.loading.progress++
        }, 1);
    }

    ball({ctx, time}) {

        const _d = (m) => {
            const sphereCenter = P(0.0, 0.0, 20.0);
            const w = P(Math.sin(m.x + time), Math.cos(m.y + time * 2), Math.sin(m.z - time * 3));
            const offset = (w.x * w.y * w.z) * 0.5 + 0.5;
            return Vector3.length(Vector3.minus(m, sphereCenter)) - (7 * (step(16, 19, time) - step(24, 26, time)) - offset * 2);
        }

        const _m = (ray) => {
            var	marchingDist = 0.0;
            for (var i = 0; i < 100; i++) {                          
                const m = Vector3.mult(ray, marchingDist);
                var dist = _d(m);                            
                if (dist < 0.01) return m;
                marchingDist += dist;                    
                if (marchingDist >= 30.0) break;
            }
            return null;
        }

        for (var y = 0; y < 300; y += 2) {
            const v = y / 300 - 0.5;
            for (var x = 0; x < 300; ++x) {
                const u = x / 300 - 0.5;
                const m = _m(Vector3.normalized(P(u, v, 1.25)));
                const pb = y * 1200 + x * 4;
                if (m !== null) {
                    const eps = 0.001;
                    const n = Vector3.normalized(P(
                        _d(P(m.x + eps, m.y, m.z)) - _d(P(m.x - eps, m.y, m.z)),
                        _d(P(m.x, m.y + eps, m.z)) - _d(P(m.x, m.y - eps, m.z)),
                        _d(P(m.x, m.y, m.z + eps)) - _d(P(m.x, m.y, m.z - eps)),
                    ));
                    const d = saturate(Vector3.dot(n, Vector3.normalized(P(Math.cos(time*3),Math.sin(time*3),-1))));
                    const c = P(lerp(0.6, 0.0, d), lerp(.8, 0.0, d), lerp(.8, 1.0, d));
                    this.ballImg.data[pb    ] = c.x * 255;
                    this.ballImg.data[pb + 1] = c.y * 255;
                    this.ballImg.data[pb + 2] = c.z * 255;
                    this.ballImg.data[pb + 3] = 255; 
                } else {
                    this.ballImg.data[pb + 3] = 0;
                }
            }
        }
        ctx.putImageData(this.ballImg, 0, 0);
    }

    neon(ctx, lineWidth, shadowBlur, fn) {
        ctx.lineWidth = lineWidth;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = ctx.strokeStyle = '#0059ff';
        for (var i = 2; i--;) fn();

        ctx.lineWidth = lineWidth / 3;
        ctx.shadowBlur = shadowBlur / 10;
        ctx.shadowColor = ctx.strokeStyle = '#fff';
        fn();
    }

    render({ctx, time}) {
        this.ball({ctx: this.octx2, time});

        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1920, 1200);

        ctx.drawImage(this.ocanvas2, 960 - 150 + 30, 600 - 150 - 30);

        const textPos = P(960, 600);
        var caretPos = 0;
        if (time > 3 && time < 21) {
            time -= 3;
            const f = (x) => { return (x > 0) ? Math.sin(x)*10 + f(x - 1) : 0 }
            const text = ['BeTomorrow', 'Canvas Things 2022', 'By David Sarrio', ][(time/6)|0].substring(0, f(time)|0);
            ctx.font = 'bold italic 90px consolas';
            const m = ctx.measureText(text);
            caretPos = m.width / 2;
            this.neon(ctx, 6.8, 17.4, () => {
                ctx.strokeText(text, textPos.x - m.width / 2, textPos.y);
            });
        }
        if ((time*2|0) % 2 > 0 && time < 21) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(textPos.x + caretPos + 10, textPos.y - 70, 3, 90);
        }
        ctx.restore();
    }
}
