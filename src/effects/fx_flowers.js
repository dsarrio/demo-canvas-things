
class FxFlowers {
    
    constructor() {
        this.loading = {progress: 0, total: 1};
    }

    init() {
        
        setTimeout(() => {
            this.flowers = [];
            this.ocanvas = newCanvas(1920, 1200);
            this.octx = newContext(this.ocanvas);
            this.ocanvas2 = newCanvas(1920, 1200);
            this.octx2 = newContext(this.ocanvas2);
            this.loading.progress++;
        }, 1);
    }

    __buildFlower({l, cs, tw, cy, np, cp1, cp2}) {
        const points = [
            /* left  */ { x: -tw, y: cy},
            /* top   */ { x: 0, y: l},
            /* right */ { x: tw, y: cy},
        ];
        const control_points = [
            /* quad_left      */ { x: -tw, y: cy - cp1 },
            /* quad_right     */ { x:  tw, y: cy - cp1 },
            /* bezier_left_1  */ { x: -tw, y: cy + cp1 },
            /* bezier_left_2  */ { x: -cp2, y: l},
            /* bezier_right_1 */ { x: tw, y: cy + cp1 },
            /* bezier_right_2 */ { x: cp2, y: l},
        ]

        const color_center = randColor();
        const color_petal = randColor();

        return { length: l, points, control_points, nb_petal: np, color_center, color_petal, center_size: cs, life: 0 };
    }

    randomFlower() {
        const center_size = randIntBetween(10, 25);
        const length = center_size + randBetween(20, 90);
        const center_y = randBetween(0.4, 0.9) * length;
        const top_width = randBetween(0.2, 0.7) * length / 2;
        const cp1 = randBetween(0.4, 0.9) * center_y;
        const cp2 = randBetween(0.2, 0.9) * top_width;
        const nb_petal = Math.round(randBetween(4, 10));
        const params = {
            l: length,
            cs: center_size,
            tw: top_width,
            cy: center_y,
            np: nb_petal,
            cp1, cp2
        };
        return this.__buildFlower(params);
    }

    drawFlower({ctx, time, flower}) {
        ctx.globalAlpha = 0.88;

        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "#333";

        const f = saturate(flower.life / 1.5);
        const f2 = easeout(saturate(flower.life / 1.5));

        // petal
        ctx.fillStyle = flower.color_petal;
        const angle = Math.PI * 2 / flower.nb_petal;
        ctx.save();
        ctx.rotate(time / 2);
        for (var i = 0; i < flower.nb_petal; i++) {
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(flower.control_points[0].x * f, flower.control_points[0].y, flower.points[0].x * f, flower.points[0].y * f);
            ctx.bezierCurveTo(flower.control_points[2].x * f, flower.control_points[2].y * f, flower.control_points[3].x * f, flower.control_points[3].y * f, flower.points[1].x * f, flower.points[1].y * f);
            ctx.bezierCurveTo(flower.control_points[5].x * f, flower.control_points[5].y * f, flower.control_points[4].x * f, flower.control_points[4].y * f, flower.points[2].x * f, flower.points[2].y * f);
            ctx.quadraticCurveTo(flower.control_points[1].x * f, flower.control_points[1].y * f, 0, 0);
            ctx.fill();
        }
        ctx.restore();
        
        // center
        ctx.fillStyle = flower.color_center;
        ctx.beginPath();
        ctx.arc(0, 0, flower.center_size * f2, 0, Math.PI * 2);
        ctx.fill();

        // debug
        // ctx.strokeStyle = "red";
        // for (const pt of flower.points) this.dot(ctx, pt, "blue");
        // for (const pt of flower.control_points) this.dot(ctx, pt, "green");
    }

    render({ctx, time}) {
        if (!this.lastTime) this.lastTime = time;
        const dt = time - this.lastTime;
        this.lastTime = time;

        if (dt < 0) {
            this.octx2.clearRect(0, 0, 1920, 1200);
            this.flowers = [];
        }

        this.nextSpawn -= dt;
        if (!this.nextSpawn || this.nextSpawn <= 0) {
            this.flowers.push({
                shape: this.randomFlower(),
                pos: P(Math.random() * 1920, Math.random() * 1200),
            });
            this.nextSpawn = 0.04;
        }

        this.octx2.clearRect(0, 0, this.octx2.W, this.octx2.H);
        for (var i = 0; i < this.flowers.length; ++i) {
            const flower = this.flowers[i];
            //console.log(flower);

            this.octx2.save();
            this.octx2.translate(flower.pos.x, flower.pos.y);
            this.drawFlower({ctx: this.octx2, time, flower: flower.shape});
            this.octx2.restore();

            if (flower.shape.life + dt >= 1.5) {
                this.flowers.splice(i--, 1);
                this.octx.save();
                this.octx.translate(flower.pos.x, flower.pos.y);
                this.drawFlower({ctx: this.octx, time, flower: flower.shape});
                this.octx.restore();                
            }

            flower.shape.life += dt;

            //console.log(flower.life);
        }

        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1920, 1200);
        ctx.drawImage(this.ocanvas, 0, 0);
        ctx.drawImage(this.ocanvas2, 0, 0);
        ctx.restore();
    }
}
