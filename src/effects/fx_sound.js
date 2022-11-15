
class FxSound {

  constructor() {
    this.loading = {progress: 0, total: song.numChannels};
    this.audio =  document.createElement('audio');
  }

  init() {
    
    setTimeout(() => {
      this.player = new SoundPlayer();
      this.player.init(song);

      const next = () => {
        this.loading.progress = this.player.generate();
        if (this.loading.progress >= this.loading.total) {
          const wav = this.player.createWave();
          this.audio.src = URL.createObjectURL(new Blob([wav], {type: "audio/wav"}));
          return;
        }
        setTimeout(next, 1);
      }
      next();

    }, 1);
  }

  start() {
    this.audio.play();
  }

  currentTime() {
    return this.audio.currentTime;
  }
}

/* Copyright (c) 2011-2013 Marcus Geelnard */
/* Note: ALTERED SOURCES */
class SoundPlayer {
  constructor() {
    var _, $, n, r, i, t = function (_) { return Math.sin(6.283184 * _); }, e = function (_) { return .003959503758 * 2 ** ((_ - 128) / 12); }, a = function (_, $, n) {
      var r, i, t, a, o, u, c = f[_.i[0]], v = _.i[1], s = _.i[3] / 32, h = f[_.i[4]], g = _.i[5], l = _.i[8] / 32, w = _.i[9], L = _.i[10] * _.i[10] * 4, d = _.i[11] * _.i[11] * 4, p = _.i[12] * _.i[12] * 4, C = 1 / p, D = -_.i[13] / 16, m = _.i[14], B = n * 2 ** (2 - _.i[15]), P = new Int32Array(L + d + p), y = 0, A = 0; for (r = 0, i = 0; r < L + d + p; r++, i++)
        i >= 0 && (m = m >> 8 | (255 & m) << 4, i -= B, o = e($ + (15 & m) + _.i[2] - 128), u = e($ + (15 & m) + _.i[6] - 128) * (1 + 8e-4 * _.i[7])), t = 1, r < L ? t = r / L : r >= L + d && (t = (1 - (t = (r - L - d) * C)) * 3 ** (D * t)), y += o * t ** s, a = c(y) * v, A += u * t ** l, a += h(A) * g, w && (a += (2 * Math.random() - 1) * w), P[r] = 80 * a * t | 0; return P;
    }, f = [t, function (_) { return _ % 1 < .5 ? 1 : -1; }, function (_) { return 2 * (_ % 1) - 1; }, function (_) { var $ = _ % 1 * 4; return $ < 2 ? $ - 1 : 3 - $; } ]; this.init = function (t) { _ = t, $ = t.endPattern, n = 0, r = t.rowLen * t.patternLen * ($ + 1) * 2, i = new Int32Array(r); }, this.generate = function () {
      var e, o, u, c, v, s, h, g, l, w, L, d, p, C, D = new Int32Array(r), m = _.songData[n], B = _.rowLen, P = _.patternLen, y = 0, A = 0, W = !1, b = []; for (u = 0; u <= $; ++u)
        for (c = 0, h = m.p[u]; c < P; ++c) {
          var j = h ? m.c[h - 1].f[c] : 0; j && (m.i[j - 1] = m.c[h - 1].f[c + P] || 0, j < 17 && (b = [])); var k = f[m.i[16]], q = m.i[17] / 512, x = 2 ** (m.i[18] - 9) / B, z = m.i[19], E = m.i[20], F = 135.82764118168 * m.i[21] / 44100, G = 1 - m.i[22] / 255, H = 1e-5 * m.i[23], I = m.i[24] / 32, J = m.i[25] / 512, K = 6.283184 * 2 ** (m.i[26] - 9) / B, M = m.i[27] / 255, N = m.i[28] * B & -2; for (v = 0, L = (u * P + c) * B; v < 4; ++v)
            if (s = h ? m.c[h - 1].n[c + v * P] : 0) {
              b[s] || (b[s] = a(m, s, B)); var O = b[s]; for (o = 0, e = 2 * L; o < O.length; o++, e += 2)
                D[e] += O[o];
            } for (o = 0; o < B; o++)
            (w = D[g = (L + o) * 2]) || W ? (d = F, z && (d *= k(x * g) * q + .5), y += (d = 1.5 * Math.sin(d)) * A, p = G * (w - A) - y, A += d * p, w = 3 == E ? A : 1 == E ? p : y, H && (w *= H, w = w < 1 ? w > -1 ? t(.25 * w) : -1 : 1, w /= H), w *= I, W = w * w > 1e-5, C = w * (1 - (l = Math.sin(K * g) * J + .5)), w *= l) : C = 0, g >= N && (C += D[g - N + 1] * M, w += D[g - N] * M), D[g] = 0 | C, D[g + 1] = 0 | w, i[g] += 0 | C, i[g + 1] += 0 | w;
        } return ++n;
    }, this.createAudioBuffer = function (_) {
      for (var $ = _.createBuffer(2, r / 2, 44100), n = 0; n < 2; n++)
        for (var t = $.getChannelData(n), e = n; e < r; e += 2)
          t[e >> 1] = i[e] / 65536; return $;
    }, this.createWave = function () { var _ = 44 + 2 * r - 8, $ = _ - 36, n = new Uint8Array(44 + 2 * r); n.set([82, 73, 70, 70, 255 & _, _ >> 8 & 255, _ >> 16 & 255, _ >> 24 & 255, 87, 65, 86, 69, 102, 109, 116, 32, 16, 0, 0, 0, 1, 0, 2, 0, 68, 172, 0, 0, 16, 177, 2, 0, 4, 0, 16, 0, 100, 97, 116, 97, 255 & $, $ >> 8 & 255, $ >> 16 & 255, $ >> 24 & 255]); for (var t = 0, e = 44; t < r; ++t) { var a = i[t]; a = a < -32767 ? -32767 : a > 32767 ? 32767 : a, n[e++] = 255 & a, n[e++] = a >> 8 & 255; } return n; }, this.getData = function (_, $) { for (var n = 2 * Math.floor(44100 * _), r = Array($), t = 0; t < 2 * $; t += 1) { var e = n + t; r[t] = _ > 0 && e < i.length ? i[e] / 32768 : 0; } return r; };
  }
}
