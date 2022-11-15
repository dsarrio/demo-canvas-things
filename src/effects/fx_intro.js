class FxIntro {
    
    constructor() {
        this.loading = {progress: 0, total: 1};
    }

    init() {
        
        setTimeout(() => {
            this.loading.progress = 1;     
        }, 1);
    }

    neon(ctx, lineWidth, shadowBlur, alpha, fn) {
        ctx.lineWidth = lineWidth;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowColor = `rgba(255, 0, 0, 1)`;
        ctx.strokeStyle = `rgba(255, 0, 0, ${alpha})`;
        for (var i = 2; i--;) fn();

        ctx.lineWidth = lineWidth / 3;
        ctx.shadowBlur = shadowBlur / 10;
        ctx.shadowColor = `rgba(255, 170, 170, 1)`;
        ctx.strokeStyle = `rgba(255, 170, 170, ${alpha})`;
        fn();
    }

    intro_p1({ctx, time}) {
        ctx.save();
        ctx.translate(960, 600);
        const s = lerp(7, 1.8, step(0, 8, time));
        ctx.scale(s, s);
        this.neon(ctx, 80, 80, 1 - easein(step(7.5, 8, time)), () => {
            ctx.beginPath();
            ctx.moveTo(-660, 1320);
            ctx.lineTo(0, -720);
            ctx.lineTo(660, 1320);
            ctx.stroke();
        });
        ctx.restore();
    }

    intro_p2({ctx, time}) {
        ctx.save();
        ctx.translate(800, 1200);
        const s = lerp(1.15, 0.82, step(0, 3, time));
        ctx.scale(s, s);
        this.neon(ctx, 80, 80, step(0, 0.5, time) - easein(step(2.5, 3, time)), () => {
            ctx.beginPath();
            ctx.moveTo(-910, -1600);
            ctx.lineTo(200+130, -680);
            ctx.lineTo(200+130, -1600);
            ctx.moveTo(700, -1600);
            ctx.lineTo(700, 22);
            ctx.moveTo(-1023, -775);
            ctx.lineTo(230, 85);
            ctx.stroke();
        });
        ctx.restore();
    }

    intro_p3({ctx, time}) {
        const t = step(0, 4, time);
        const alpha = step(0, 0.5, time) - easein(step(3.5, 4, time))

        ctx.save();
        ctx.translate(0, 550);
        ctx.scale(lerp(1.5, 0.95, t), 1);
        ctx.translate(-lerp(0, 100, t), 0);
        ctx.font = '3000px serif';
        this.neon(ctx, 70, 80, alpha, () => {
            ctx.strokeText('O', -1200, 1086);
        });
        ctx.restore();

        this.neon(ctx, 70, 80, alpha, () => {
            ctx.beginPath();
            ctx.moveTo(lerp(1820, 1880, t), -10);
            ctx.lineTo(lerp(1820, 1880, t), 1300);
            ctx.stroke();    
        });
    }

    intro_p4({ctx, time}) {
        const t = step(0, 4, time);
        const alpha = step(0, 0.5, time) - easein(step(3.5, 4, time))

        ctx.lineWidth = 50;
        ctx.shadowBlur = 80;
        ctx.shadowColor = "#FF0000";
        ctx.strokeStyle = "#FF0000";
        ctx.save();
        ctx.translate(960, 600);
        const s = lerp(1, 0.9, t);
        ctx.scale(s, s);
        this.neon(ctx, 60, 80, alpha, () => {
            ctx.font = '3000px serif';
            ctx.strokeText('S', lerp(-770, -140, t), -110);
            ctx.font = '3000px serif';
            ctx.strokeText('G', lerp(-1280, -1730, t), 2100);
        });
        ctx.restore();
    }

    intro_p5({ctx, time}) {
        const t = step(0, 4, time);
        const alpha = step(0, 0.5, time) - easein(step(3.5, 4, time))

        ctx.save();
        ctx.translate(960, 600);
        this.neon(ctx, 50, 80, alpha, () => {
            ctx.font = '3000px serif';
            ctx.strokeText('H',
                lerp(-10, -200, t),
                lerp(1760, 1360, t),
            );

            ctx.font = '2000px serif';
            ctx.strokeText('N',
                lerp(-1520, -1340, t),
                lerp(10, 470, t),
            );
        });
        ctx.restore();
    }

    intro_p6({ctx, time}) {
        ctx.save();
        ctx.translate(960, 600);

        ctx.font = '800px serif';
        const t2 = step(1, 6, time);
        this.neon(ctx, 30, 80, easein(step(1, 3, time)) - step(5.5, 6, time) , () => {
            ctx.strokeText('N', lerp(-850, -650, t2), 260);
            ctx.strokeText('G', lerp(390, 120, t2), 260);
        });

        ctx.font = '1500px serif';
        const t1 = step(0, 5, time);
        this.neon(ctx, 40, 80, step(0, 0.5, time) - easein(step(3, 5, time)), () => {
            ctx.strokeText('C', lerp(-1210, -1410, t1), lerp(-230, -60, t1) );
            ctx.strokeText('A', lerp(240, 340, t1), lerp(-210, -60, t1));
            ctx.strokeText('S', lerp(-1470, -1170, t1), lerp(1120, 1350, t1));
            ctx.strokeText('G', lerp(300, 0, t1), lerp(1120, 1350, t1));
        });

        ctx.restore();
    }

    intro_p7({ctx, time}) {
        // time = helpers.scale.value;
        const t = step(0, 20, time);
        ctx.save();

        const scale = lerp(5.3, 0.9, easeoutsine(t));
        const alpha = step(0, 0.5, time) - easeinout(step(16.5, 19, time));

        ctx.translate(1920/2, 1280/2);
        ctx.scale(scale, scale);
        // this.guiSettings.helpers.scale2+
        this.neon(ctx, 8, 20, alpha, () => {
            ctx.font = "260px serif";
            ctx.strokeText('C', 13+-10+480-960-(1-easeout(step(9.2, 14.8, time))) * 78, 668-653- 11);
            ctx.strokeText('S', 13+-15+1246-960+(1-easeout(step(7.8, 14, time))) * 70, 668-653- 11);
    
            ctx.font = "210px serif";
            // ctx.strokeText('NVAS', 644-960, 622-653);
            ctx.strokeText('A',  13+-11+24+644-960 - (1-step(1, 4, time)) * 60, 622-653);
            ctx.strokeText('N', 5+ 12+24+15+644-960+128 - (1-step(0, 3, time)) * 30, 622-653);
            ctx.strokeText('V', 13+ 12+24+9+644-960+280, 622-653);
            ctx.strokeText('A', 13+ 7+24+ -78+644-960+478  + 50 * (1-step(0.0, 8.5, time)) , 622-653 - (1-step(0.0, 8.5, time)) * 100);
    
            ctx.font = "160px serif";
            // ctx.strokeText('THINGS', 652-960, 296+470-653);
            ctx.strokeText('T', 652-960 - (1-step(3, 7, time)) * 90, 296+470-653);
            ctx.strokeText('H', 652-960 + 98, 296+470-653 + (1-step(3.1, 7, time)) * 150);
            ctx.strokeText('I', 652-960+214 - (1-step(0, 3.8, time)) * 100, 296+470-653);
            ctx.strokeText('N', 652-960+267, 296+470-653 + (1-step(0, 6, time)) * 120 );
            ctx.strokeText('GS', 652-960+382 + (1-step(0, 4.6, time)) * 100, 296+470-653);

            if (time >= 12) {
                const w = lerp(0, 935, step(12, 13.5, time));
                ctx.strokeRect(-10+490-960 + 935/2 - w /2, 440-653, w - 30, 18);
            }
            if (time >= 13.5) {
                ctx.strokeRect(-10+490-960+147, 692-653, -lerp(0, 147, step(13.5, 15, time)), 18);
                ctx.strokeRect(1250-960+10, 692-653, lerp(0, 127, step(13.5, 15, time)), 18);
            }
        });
        ctx.restore();

    }

    render({ctx, time}) {
        ctx.save();
        ctx.scale(ctx.W / 1920, ctx.H / 1200);

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1920, 1200);
        ctx.lineJoin = 'round';

        // this.intro_p7({ctx, time: this.guiSettings.helpers.scale1 / 10});

        const parts = [
            [ 8, (e) => this.intro_p1(e) ],
            [ 3, (e) => this.intro_p2(e) ],
            [ 4, (e) => this.intro_p3(e) ],
            [ 4, (e) => this.intro_p4(e) ],
            [ 4, (e) => this.intro_p5(e) ],
            [ 6, (e) => this.intro_p6(e) ],
            [ 20, (e) => this.intro_p7(e) ],
        ];

        var t = 0;
        for (const p of parts) {
            if (time <= t + p[0]) {
                p[1]({ctx, time: time - t});
                break;
            }
            t += p[0];
        }

        ctx.restore();
    }
}
