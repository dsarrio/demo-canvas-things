
class FxTunnel {
  
  constructor() {
    this.loading = {progress: 0, total: 1};
  }

  init() {
    
      setTimeout(() => {
        this.ocanvas = newCanvas(1920, 1200);
        this.octx = newContext(this.ocanvas);
        this.loading.progress++;
      }, 1);
  }

  timeFn(time) {
    var t = time;
    t -= step(0, 2, time) * 2;
    t -= easeout(step(2, 8, time)) * 2;
    return t;
  }

  _render({ctx, time}) {
    var depth = tlerp(0, 2, 0, 27, time) + tlerp(30, 35, 0, 50, time) - tlerp(40, 43, 0, 21, time);
    var clearAlpha = tlerp(2, 8, 1, 0.4, time) + tlerp(11, 13, 0, 0.6, time) - lerp(0, 1, step(35, 60, time));

    this.tt = this.timeFn(time) * tlerp(45, 55, 7, 11, time);

    ctx.fillStyle = 'rgba(0,0,0,'+ clearAlpha + ')';
    ctx.fillRect(0, 0, ctx.W, ctx.H);
    ctx.save();
    ctx.translate(ctx.W/2, ctx.H/2);

    const d_max = depth;
    for (var d = 1; d < d_max; d++) {
      const sliceIdx = (this.tt | 0) + d;
      const ft = this.tt % 1;
      const w = (ctx.W + 800) / (2 * (d - ft));
      const part = (sliceIdx / 20)|0;

      if (sliceIdx + d >= 379) continue;

      var sectionAngle = tlerp(130, 160, 0.128, 0.183, sliceIdx) - tlerp(217, 225, 0, 0.004, sliceIdx);
      var sectionCount = tlerp(130, 160, 48, 24, sliceIdx) + tlerp(217, 225, 0, 10, sliceIdx);;
      var frameAlpha = tlerp(50, 80, 0, 0.1, sliceIdx) - tlerp(220, 240, 0, 0.1, sliceIdx) + tlerp(310, 340, 0, 0.1, sliceIdx) - tlerp(370, 379, 0, 0.1, sliceIdx);

      var wormCurviness = tlerp(50, 80, 300, 170, sliceIdx) - tlerp(130, 160, 0, 170, sliceIdx) + tlerp(180, 200, 0, 170, sliceIdx);
      var wormSmooth = tlerp(50, 80, 0.1, 30, sliceIdx);
      var wormCylindarness = tlerp(130, 160, 0, 1, sliceIdx);
      var color = {
        h: sliceIdx > 120 ? (part * 80) % 360 : 198,
        s: tlerp(90, 100, 0, 1-(d-ft)/d_max, sliceIdx),
        v: step(0, 2, time)
      };

      const a = 1 / 2 * d;
      const b = 1 / 2 * (d - 1);
      const aa = lerp(a, b, ft);
      ctx.globalAlpha = d <= 2 ? frameAlpha * aa : frameAlpha;
      ctx.fillStyle = hsv2hsl(color);
      ctx.beginPath();

      for (var j = 0; j < sectionCount + 1; j++) {
        const a = Math.PI + (j - sectionCount / 2) * sectionAngle;
        const ff = lerp(1.9, 40, easein(wormCylindarness));
        const r = [
          1.1,
          Math.min(1 / Math.abs(Math.cos(a+sliceIdx/3)), 1 / Math.abs(Math.sin(a+sliceIdx/3))), // carré tourne
          Math.min(1 / Math.abs(Math.cos(a)), 1 / Math.abs(Math.sin(a))), // carré fixe
          Math.abs(Math.sin(a/((Math.max(29, 200 - sliceIdx*30))/100)))/4 + 0.7, //
          Math.abs(Math.sin(a/0.5+sliceIdx))/ff + (1-1/ff*0.86) * 1.1, // fleur
        ][sliceIdx < 120 ? 4 : part%5];

        // worm tunnel
        const p = P(Math.sin(a) * r * w, Math.cos(a) * r * w);
        const f = (d-ft) / d_max;
        p.x += Math.sin(sliceIdx / wormSmooth) * wormCurviness * f;
        p.y += Math.cos(sliceIdx / wormSmooth) * wormCurviness * f;

        // ligths
        if (d <= 18 && j%2) {
          ctx.save();
          const ff = (1-(d - 1 - ft) / 30);
          const l = easein(ff) * 12;
          ctx.globalAlpha = ff * [1,
            (Math.sin(time*7 + sliceIdx + j) * 0.5 + 0.5)
          ][sliceIdx < 95 ? 0 : sliceIdx < 121 ? 1 : part%2];
          ctx.fillRect(p.x-l/2, p.y-l/2, l, l);
          ctx.restore();
        }
        j == 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.fill();
      ctx.clip();
    }

    ctx.restore();
  }

  render({ctx, time}) {
    this._render({ctx: this.octx, time});

    ctx.save();
    ctx.scale(ctx.W/1920, ctx.H/1200);
    ctx.drawImage(this.ocanvas, 0, 0);
    ctx.restore();
  }
}
