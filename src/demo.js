
class Demo {
    constructor() {
        this.FX = {
            CRT: new FxCRT(),
            Sound: new FxSound(),
            Intro: new FxIntro(),
            Sopalin: new FxSopalin(),
            Flowers: new FxFlowers(),
            Words: new FxWords(),
            Tunnel: new FxTunnel(),
            Cage3D: new FxCage3D(),
            Credits: new FxCredits(),
        };
        this.debug = false;
        this.ctx = undefined;
    }
    
    runFullscreen() {
        document.documentElement.requestFullscreen({navigationUI: 'hide'})
            .then(() => {
                document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement) window.location.reload() });
                setTimeout(() => { this.run({width: window.screen.width, height: window.screen.height}) }, 1000);
            })
            .catch((err) => { alert(`fullscreen rejected (${err.message}, ${err.name})`)})
    }
    
    run({width, height}) {
        // size canvas to respect aspect ratio
        const ratio = 16 / 10;
        var h = height, w = (h * ratio)|0;
        if (w > width) { h = (width / ratio)|0 }

        // setup screen canvas
        this.canvas = newCanvas(w, h);
        this.ctx = newContext(this.canvas);
        document.body.innerHTML = '';
        document.body.append(this.canvas);

        // load
        Object.values(this.FX).forEach(fx => fx.init({width: w, height: h}));
        requestAnimationFrame(() => this.renderLoading());
    }
    
    renderLoading() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.ctx.W, this.ctx.H);
        var total = 0;
        var progress = 0;
        Object.values(this.FX).forEach(fx => { total += fx.loading.total });
        Object.values(this.FX).forEach(fx => { progress += fx.loading.progress });
        
        const L = ctx.W * 0.7;
        const l = ctx.H * 0.05;
        ctx.save();
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#fff';
        ctx.fillStyle = '#fff';
        ctx.translate(ctx.W/2, ctx.H/2);
        ctx.fillRect(-L/2, -l/2, L * progress / total, l)
        ctx.strokeRect(-L/2, -l/2, L, l);
        ctx.restore();   

        if (progress >= total) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, ctx.W, ctx.H);
            setTimeout(() => {
                this.FX.Sound.start();
                this.initDebug();
                requestAnimationFrame(() => this.renderDemo());
            }, 2000);
        } else {
            requestAnimationFrame(() => this.renderLoading());
        }
    }
    
    renderDemo() {
        const soundTime = this.FX.Sound.currentTime();
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, ctx.W, ctx.H);

        const scenes = [
            [ 4.500, (time) => { this.FX.CRT.renderTurnOn({ctx, time}) } ],
            [ 2.000, (time) => { this.FX.CRT.render({ctx, time}) } ],
    
            [ 50.000, (time) => {
                this.FX.Intro.render({ctx, time});
                this.FX.CRT.render({ctx, time});
            } ],
    
            [ 40.000, (time) => {
                if (time < 25 || time > 30)
                this.FX.Sopalin.render({ctx, time});

                if (time > 21 && time < 32) {
                    this.FX.Words.renderChaos({ctx, time: time - 21});
                }

                ctx.fillStyle = rgba(0, 0, 0, step(39, 40, time));
                ctx.fillRect(0, 0, ctx.W, ctx.H);
                this.FX.CRT.render({ctx, time});
            } ],

            [ 30.000, (time) => {
                if (time > 17) {
                    this.FX.Flowers.render({ctx, time: time - 14});
                }

                if (time > 2 && time < 20) {
                    this.FX.Words.renderFlower({ctx, time: time - 2});
                }

                ctx.fillStyle = rgba(0, 0, 0, step(29, 30, time));
                ctx.fillRect(0, 0, ctx.W, ctx.H);
                this.FX.CRT.render({ctx, time});
            } ],

            [ 60.000, (time) => {
                this.FX.Cage3D.render({ctx, time});
                ctx.fillStyle = rgba(0, 0, 0, step(58.5, 59, time));
                ctx.fillRect(0, 0, ctx.W, ctx.H);
                this.FX.CRT.render({ctx, time});
            } ],

            [ 51.000, (time) => {
                this.FX.Tunnel.render({ctx, time});

                ctx.fillStyle = rgba(0, 0, 0, step(60.5, 61, time));
                ctx.fillRect(0, 0, ctx.W, ctx.H);
                this.FX.CRT.render({ctx, time});
            } ],

            [ 27.000, (time) => {
                this.FX.Credits.render({ctx, time});
                this.FX.CRT.render({ctx, time});
            } ],
            [ 4.500, (time) => {
                this.FX.CRT.renderTurnOn({ctx, time: 4.5 - time})
            } ],
            [ 3.000, () => {} ],
            [ 2.000, () => {
                window.location.reload()
            } ]
        ];

        var tt = 0;
        for (var s of scenes) {
            if (soundTime < tt + s[0]) {
                const sceneTime = soundTime - tt;
                s[1](sceneTime);

                if (this.debug) {
                    const sot = Math.trunc(soundTime * 100000) / 100000;
                    const b = Math.round(soundTime / (60 /* seconds */ / 85 /* bpm */ / 4));
                    const l = b / 32;
                    const ll = b % 32;
                    const sct = Math.trunc(sceneTime * 100000) / 100000;
                    ctx.fillStyle = '#fff';
                    ctx.font = '20px monospace';
                    ctx.fillText(`      beat: ${l|0}:${ll}`, 0, 50);
                    ctx.fillText(`sound time: ${sot}`, 0, 70);
                    ctx.fillText(`scene time: ${sct}`, 0, 90);
                }
                break;
            }
            tt += s[0];
        } 
        requestAnimationFrame(() => this.renderDemo());
    }

    initDebug() {
        if (window.location.href.indexOf('debug') < 0) return;
        this.debug = true;
        const ctr = document.createElement('div');
        ctr.style.textAlign = 'center';
        ctr.style.position = 'absolute';
        ctr.style.bottom = '20px';
        ctr.style.left = '0';
        ctr.style.right = '0';
        document.body.append(ctr);
        const timeSlider = document.createElement("input");
        timeSlider.type = 'range';
        timeSlider.min = 0;
        timeSlider.value = 0;
        timeSlider.max = (279 * 1000)|0;
        timeSlider.style.width = '80%';
        ctr.append(timeSlider);
        
        timeSlider.addEventListener('input', () => { demo.FX.Sound.audio.currentTime = timeSlider.value / 1000 });
    
        demo.FX.Sound.audio.addEventListener("timeupdate", () => {
            const currentTime = demo.FX.Sound.audio.currentTime;
            timeSlider.value = Math.round(currentTime * 1000);
        });
    
        document.addEventListener('keydown', (e) => {
            if (e.key == ' ') {
                if (demo.FX.Sound.audio.paused) {
                    demo.FX.Sound.audio.play();
                } else {
                    demo.FX.Sound.audio.pause();
                    demo.FX.Sound.audio.currentTime = ((demo.FX.Sound.audio.currentTime / (60/85/4))|0)*(60/85/4);
                }
            }
            if (e.key == 'ArrowRight') {
                if (!demo.FX.Sound.audio.paused) {
                    demo.FX.Sound.audio.pause();
                    demo.FX.Sound.audio.currentTime = ((demo.FX.Sound.audio.currentTime / (60/85/4))|0)*(60/85/4);
                }
                demo.FX.Sound.audio.currentTime += 60/85/4;
            }
            if (e.key == 'ArrowLeft') {
                if (!demo.FX.Sound.audio.paused) {
                    demo.FX.Sound.audio.pause();
                    demo.FX.Sound.audio.currentTime = ((demo.FX.Sound.audio.currentTime / (60/85/4))|0)*(60/85/4);
                }
                demo.FX.Sound.audio.currentTime -= 60/85/4;
            }
            if (e.code === 'Numpad0') demo.FX.Sound.audio.currentTime = 0;
            if (e.code === 'Numpad1') demo.FX.Sound.audio.currentTime = 6.5;
            if (e.code == 'Numpad2') demo.FX.Sound.audio.currentTime = 56.5;
            if (e.code == 'Numpad3') demo.FX.Sound.audio.currentTime = 96.5;
            if (e.code == 'Numpad4') demo.FX.Sound.audio.currentTime = 126.5;
            if (e.code == 'Numpad5') demo.FX.Sound.audio.currentTime = 186.5;
            if (e.code == 'Numpad6') demo.FX.Sound.audio.currentTime = 237.5;
            if (e.code == 'Numpad7') demo.FX.Sound.audio.currentTime = 264.5;
        });
    }

}

const demo = new Demo();
