
class FxWords {
    
    constructor() {
        this.loading = {progress: 0, total: 2};
    }

    init() {
        
        setTimeout(() => {        
            this.noise1D = [];
            for (var i = 0; i < 2048; i++) {
                this.noise1D.push(Math.random());
            }
            
            this.ocanvas = newCanvas(1920, 1200);
            this.octx = newContext(this.ocanvas);
            this.loading.progress++;

            this.words = [
                this.scanWord('randomize.', 30),
                this.scanWord('Flowers ?', 18),
            ]

            this.octx.clearRect(0, 0, this.octx.W, this.octx.H);

            this.loading.progress++;
        }, 1);
    }

    scanWord(word, size) {
        const sp = [];
        var tl = P(1920, 1200);
        var br = P (0, 0);

        this.octx.save();
        this.octx.fillStyle = '#000';
        this.octx.fillRect(0, 0, 1920, 1200);
        this.octx.fillStyle = '#fff';
        this.octx.font = '' + size + 'px cursive';
        this.octx.fillText(word, 20, 300);
        // this.octx.fillRect(0, 1198, 2, 2);
        this.octx.restore();

        const imgData = this.octx.getImageData(0, 0, this.octx.W, this.octx.H);
        const px = imgData.data;
        for (var i = 0; i < (this.octx.W * this.octx.H); i++) {
            const r = px[i * 4];
            if (r > 125) {
                const p = P(i % imgData.width, Math.round(i / imgData.width));
                sp.push(p);
                if (p.x < tl.x) tl.x = p.x;
                if (p.y < tl.y) tl.y = p.y;
                if (p.x > br.x) br.x = p.x;
                if (p.y > br.y) br.y = p.y;
            }
        }

        const width = br.x - tl.x;
        const height = br.y - tl.y;
        const midX = tl.x + width / 2;
        const midY = tl.y + height / 2;
        return { width, height, pixels: sp.map(p => P(p.x - midX, p.y - midY)) };
    }

    renderChaos({ctx, time}) {
        const ltime = time % 12;

        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.translate(960, 600);
        var i = 0;

        ctx.shadowBlur = tlerp(8, 9, 0, 6, ltime);

        const word = this.words[0];
        for (var px of word.pixels) {
            if (px.e === undefined) {
                px.e = P(Math.random()*2-1, Math.random()*2-1);
            }
            const hue = (i / word.pixels.length + ltime) * 360;
            const f1 = step(0, 2, ltime); // scale in
            const f2 = step(9, 11, ltime); // explode
            const f3 = step(8, 9, ltime) - step(9, 9.1, ltime); // shaking
            const a = 1 - step(10, 11, ltime);

            const sx = (Math.random() * 2 - 1) * 3;
            const sy = (Math.random() * 2 - 1) * 3;

            const x = px.x * f1 + px.e.x * 300 * f2 + sx * f3;
            const y = px.y * f1 + px.e.y * 300 * f2 + sy * f3;

            if (ltime > 4) { // colored
                ctx.fillStyle = `hsla(${ hue % 360 }, 100%, 50%, ${a})`;
            } else {
                ctx.fillStyle = rgba(1, 1, 1, 1);
            }
            ctx.shadowColor = ctx.fillStyle;

            ctx.fillRect(x*11-4, y*11-4, 9, 9);
            ++i;
        }
        ctx.restore();
    }

    spawnFlowerParticle({x, y}, l) {
        this.particles.push({
            l,
            ang: randBetween(-5, 5) * Math.PI/180 * 0,
            spd: (l ? 3 : 1 ) * randBetween(10, 13),
            duration: l ? 10 : randBetween(1, 3),
            lifetime: 0,
            dir: Vector2.normalized(P(randBetween(-1, 1), randBetween(-1, 1))),
            pos: {x, y},
            orig: {x, y},
            color: {
                r: Math.round(Math.random() * 255),
                g: Math.round(Math.random() * 255),
                b: Math.round(Math.random() * 255),
            },
        });  
    }

    renderFlower({ctx, time}) {
        time *= 4;
        var dt = time - (this.lastTime || time);
        if (dt < 0) {
            this.octx.clearRect(0, 0, this.octx.W, this.octx.H);
            this.particles = [];
        }
        this.lastTime = time;

        if (!this.particles || this.particles.length == 0) {
            this.particles = [];
            for (var px of this.words[1].pixels) {
                const x = px.x * 20;
                const y = px.y * 20;
                for (var i = 0; i < 9; ++i) {
                    this.spawnFlowerParticle({x:x+(i%3)*5, y:y+((i/3)|0)*5}, false);
                }
                this.spawnFlowerParticle({x, y}, true);
            }
            this.particles.sort(() => Math.random() - 0.5);
        }

        this.octx.save();
        this.octx.scale(this.octx.W/1920, this.octx.H/1200);
        this.octx.translate(960, 600);

        this.octx.shadowBlur = 3;
        this.octx.shadowOffsetX = this.octx.shadowOffsetY = 2;
        this.octx.shadowColor = '#0005';

        var cap = dt;
        dt = 0.05;
        var t = 0;
        while (t <= cap) {
            
            for (var i = 0; i < Math.min(250, this.particles.length); ++i) {
                const particle = this.particles[i];

                particle.lifetime += dt;
                if (particle.lifetime >= particle.duration) {
                    this.particles.splice(i--, 1);
                    this.spawnFlowerParticle(particle.orig, particle.l);
                    continue;
                }

                const speed = particle.spd;

                particle.ang += (particle.l ? randBetween(-20, 20) : randBetween(-45, 45)) * Math.PI/180 * dt;
                const sina = Math.sin(particle.ang);
                const cosa = Math.cos(particle.ang);

                // rotate direction
                const ndirx = particle.dir.x * cosa - particle.dir.y * sina;
                const ndiry = particle.dir.x * sina + particle.dir.y * cosa;
                particle.dir.x = ndirx;
                particle.dir.y = ndiry;
                // console.log(particle.ttl);

                var dx = particle.dir.x * speed * dt;
                var dy = particle.dir.y * speed * dt;

                const npos = {
                    x: particle.pos.x + dx,
                    y: particle.pos.y + dy,
                }

                const lifeRatio = particle.l ? 0.4 : bounce(particle.lifetime / particle.duration);

                this.octx.fillStyle = `rgba(${particle.color.r},${particle.color.g},${particle.color.b},${lifeRatio})`;
                this.octx.beginPath();
                this.octx.arc(npos.x, npos.y, lifeRatio * 1.5, 0, Math.PI * 2);
                this.octx.fill();    

                particle.pos.x = npos.x;
                particle.pos.y = npos.y;
            }
            t += dt;
        }

        this.octx.restore();

        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.globalAlpha = tlerp(15, 18, 1, 0, time/4);
        ctx.drawImage(this.ocanvas, 0, -50);
        ctx.restore();
    }

    render({ctx, time}) {
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, ctx.W, ctx.H);

        // if (GUI.helpers.toggle1) {
        //     this.renderChaos({ctx, time});
        // }

        // if (GUI.helpers.toggle2) {
        //     this.renderFlower({ctx, time});
        // }

        ctx.restore();
    }
}
