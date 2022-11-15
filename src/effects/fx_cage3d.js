
const squareShape = (point) => P(point.x, point.y, point.z);

const sphereShape = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const zf = (point.z + 13 * 0.2) / (27 * 0.2);
    const r = Math.sqrt(1 - (zf * 2 - 1) ** 2) * 2.8;
    return P(dir.x * r, dir.y * r, point.z);
}

const coneShape = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const zf = (point.z + 13 * 0.2) / (27 * 0.2);
    const r = (1 - Math.abs((zf - 0.5)* 2)) * 14 * 0.2;
    return P(dir.x * r, dir.y * r, point.z);
}

const cylinderShape = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const r = 2;
    return P(dir.x * r, dir.y * r, point.z);
}

const flowerShape = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const a = Math.atan2(dir.x, dir.y);
    const r = Math.cos(a*2);
    const s = 1.8
    return  P(dir.x * r + dir.x * s, dir.y * r + dir.y * s, point.z);
}

const flowerShape2 = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const a = Math.atan2(dir.x, dir.y);
    const r = Math.cos(a*4);
    const s = 1.8
    return  P(dir.x * r + dir.x * s, dir.y * r + dir.y * s, point.z);
}

const flowerShape3 = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const a = Math.atan2(dir.x, dir.y);
    const r = Math.cos(a*6);
    const s = 1.8;
    return  P(dir.x * r + dir.x * s, dir.y * r + dir.y * s, point.z);
}

const triangleShape = (point) => {
    const dir = Vector3.normalized(P(point.x, point.y, 0));
    const p2 = Vector3.dot(P(point.x, point.y, 0), P(0, 1, 0));
    const df = (p2 + 2) / 4;
    return P(dir.x * 2 * df, p2, point.z);
}

class FxCage3D {
    
    constructor() {
        this.loading = {progress: 0, total: 1};
    }

    init() {
        setTimeout(() => {
          this.ocanvas = newCanvas(1920, 1200);
          this.octx = newContext(this.ocanvas);
          this.genFrames();
          this.loading.progress++;
        }, 1);
    }

    genFrameSegments(posZ) {
        // A -- B
        // |    |
        // D -- C
        const width = 2;
        const points = [
            /* A */ P(-width,  width, posZ),
            /* B */ P( width,  width, posZ),
            /* C */ P( width, -width, posZ),
            /* D */ P(-width, -width, posZ),
            /* A */ P(-width,  width, posZ),
        ];

        const nbSegments = 30;
        const L = width / nbSegments * 2;

        const segments = [];
        for (var j = 1; j < points.length; j++) {
            const pA = points[j - 1];
            const pB = points[j];
            const D = Vector3.normalized(Vector3.minus(pB, pA));
            for (var i = 0; i < nbSegments; i++) {
                const segA = P(
                    pA.x + D.x * L * (i - 0.02),
                    pA.y + D.y * L * (i - 0.02),
                    pA.z + D.z * L * (i - 0.02),
                )
                const segCenter = P(
                    pA.x + D.x * L * (i + 0.5),
                    pA.y + D.y * L * (i + 0.5),
                    pA.z + D.z * L * (i + 0.5),
                )
                const segB = P(
                    pA.x + D.x * L * (i + 1.02),
                    pA.y + D.y * L * (i + 1.02),
                    pA.z + D.z * L * (i + 1.02),
                )
                segments.push({ start: segA, end: segB, center: segCenter });
            }
        }
        return segments;
    }

    genFrames() {
        this.frames = [];
        for (var i = 0; i < 27; i++) { // budget max pour le max 50 frames de 30 segments
            const segments = this.genFrameSegments((i - 13) * 0.02);
            this.frames.push(segments);
        }
    }

    compareSegments(a, b) {
        return (b[0].z + b[1].z) / 2 - (a[0].z + a[1].z) / 2;
    };

    drawMorphings({ctx, time}) {
        var noiseFactor = 0;
        const rpp = 60 / 85;
        if (time >= 44.1) {
            const t = time - 44.1;
            const b1 = bounce(step(0, rpp/4, t % (rpp*2))) / 4;
            const b2 = bounce(step(rpp/4, 3*rpp/4, t % (rpp*2))) / 4;
            noiseFactor = b1 + b2;
        }

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, ctx.W, ctx.H);
        if (time < 1.97) return;
        time -= 2.45;

        const projection = Matrix4.frustum(90, ctx.W/ctx.H, 1, 20);
        const camera = Matrix4.lookAt(P(0, 0, 7), P(0, 0, 0), P(0, 1, 0));
        const toscreen = (p) => P(ctx.W * (p.x/p.w * 0.5 + 0.5), ctx.H * (1 - (p.y/p.w * 0.5 + 0.5)), p.z/p.w, p.w);
        const back = [];

        const shapes = [sphereShape, squareShape, flowerShape, cylinderShape, coneShape, flowerShape2, triangleShape, flowerShape3];
        const shapeThickness1 = [15, 24, 23, 29, 9, 25, 29, 24];
        const shapeThickness2 = [ 8,  9,  9,  9, 6,  8,  9,  8];

        const ma = 60/85/4*8//;lerp(1, 5, step(1, 140, time));
        const mb = 0.8;
        const msA = (time) / ma | 0;
        const msB = (time + mb) / ma | 0;
        const mf = easeinout(step(0, mb, (time - ma + mb) % ma));
        const shape1 = shapes[msA % shapes.length];
        const shape2 = shapes[msB % shapes.length];

        const tA1 = shapeThickness1[msA % shapes.length] / 5;
        const tB1 = shapeThickness1[msB % shapes.length] / 5;
        const thickness1 = lerp(tA1, tB1, mf);

        const tA2 = shapeThickness2[msA % shapes.length] / 5;
        const tB2 = shapeThickness2[msB % shapes.length] / 5;
        const thickness2 = lerp(tA2, tB2, mf);

        const thickness = (time > 14 ? tlerp(18, 18.5, thickness1, thickness2, time) : tlerp(9, 14, 0, thickness1, time)) + tlerp(32, 33, 0, 8, time);

        for (var iF = 1; iF < (time < 9 ? 2 : this.frames.length); iF++) {
            var modelview = Matrix4.identity();
            modelview = Matrix4.multiply(modelview, Matrix4.rotationX((time - 18) * tlerp(18, 19, 0, 0.6, time)));

            const a1 = Math.sin(time) * iF/10;
            const a2 = (time - 9) * tlerp(9, 14, 0, 0.7, time);
            modelview = Matrix4.multiply(modelview, Matrix4.rotationZ(lerp(a2, a1, step(38.9, 60, time))));

            modelview = Matrix4.multiply(modelview, camera);
            const modelViewProj = Matrix4.multiply(modelview, projection);
            for (var S of this.frames[iF]) {
                const ss = { ...S.start }; ss.z *= thickness;
                const se = { ...S.end   }; se.z *= thickness;
                const verts = [shape1(ss), shape1(se), shape2(ss), shape2(se)];
                for (var vert of verts) {
                    vert.x *= 1 + (Math.random() * 0.4 * noiseFactor);
                    vert.y *= 1 + (Math.random() * 0.4 * noiseFactor);
                    vert.z *= 1 + (Math.random() * 0.4 * noiseFactor);    
                }
                const a = Vector3.lerp(verts[0], verts[2], mf);
                const b = Vector3.lerp(verts[1], verts[3], mf);
                const projA = toscreen(Vector3.mat_mult(a, modelViewProj));
                const projB = toscreen(Vector3.mat_mult(b, modelViewProj));
                if (projA.z < 0 || projA.z > 1 || projB.z < 0 || projB.z > 1) continue; // clip
                back.push([projA, projB]);
            }
        }

        back.sort(this.compareSegments);
        for (var p of back) {
            const depth_factor = tlerp(8, 10, 0.5, step(0.575, 0.869, (p[0].z + p[1].z) / 2), time); // 0 near, 1 far
            const h = ((time*50)|0)%360;
            const l = lerp(1, 0.1, depth_factor) * lerp(1, Math.random() * 0.6 + 0.4, noiseFactor);
            ctx.strokeStyle = `hsl(${h|0}, 90%, ${(l * 100)|0}%)`;
            ctx.lineWidth = lerp(7, 3, depth_factor);
            ctx.beginPath();
            ctx.moveTo(p[0].x, p[0].y);
            ctx.lineTo(p[1].x, p[1].y);
            ctx.stroke();
        }
    }

    render({ctx, time}) {
        this.drawMorphings({ctx: this.octx, time});
        ctx.save();
        ctx.scale(ctx.W/1920, ctx.H/1200);
        ctx.drawImage(this.ocanvas, 0, 0);
        ctx.restore();
    }
}
