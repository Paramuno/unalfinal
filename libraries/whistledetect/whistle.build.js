! function(t) {
  var e = {};

  function r(n) {
    if (e[n]) return e[n].exports;
    var o = e[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return t[n].call(o.exports, o, o.exports, r), o.l = !0, o.exports
  }
  r.m = t, r.c = e, r.d = function(t, e, n) {
    r.o(t, e) || Object.defineProperty(t, e, {
      enumerable: !0,
      get: n
    })
  }, r.r = function(t) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(t, "__esModule", {
      value: !0
    })
  }, r.t = function(t, e) {
    if (1 & e && (t = r(t)), 8 & e) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var n = Object.create(null);
    if (r.r(n), Object.defineProperty(n, "default", {
        enumerable: !0,
        value: t
      }), 2 & e && "string" != typeof t)
      for (var o in t) r.d(n, o, function(e) {
        return t[e]
      }.bind(null, o));
    return n
  }, r.n = function(t) {
    var e = t && t.__esModule ? function() {
      return t.default
    } : function() {
      return t
    };
    return r.d(e, "a", e), e
  }, r.o = function(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e)
  }, r.p = "", r(r.s = 0)
}([function(t, e, r) {
  window.whistlerr = r(1)
}, function(t, e, r) {
  /**
   * A whistle detector based on the research paper  --
   * "Human Whistle Detection and Frequency Estimation" by M. Nilsson and others.
   *
   * @author	   Shubham Jain (hi@shubhamjain.co)
   * @license    MIT License
   */
  var n, o = r(2),
    i = r(3),
    a = r(4),
    s = r(5),
    f = r(6),
    u = {
      sampleRate: 44100,
      maxLevel: 8,
      freqBinCount: 512,
      jDiffThreshold: .45,
      whistleBlockThreshold: 25,
      sampleThreshold: 10
    };
  t.exports = {
    setConfig: function(t) {
      u = f(u, t)
    },
    detect: function(t) {
      var e = new AudioContext;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia,
        function(t, e, r) {
          try {
            navigator.getUserMedia(t, e, r)
          } catch (t) {
            alert("getUserMedia threw exception :" + t)
          }
        }({
          audio: !0
        }, function(t) {
          var r = e.createMediaStreamSource(t);
          (n = e.createAnalyser()).fftSize = u.freqBinCount, r.connect(n), g()
        }, function() {
          alert("There was an error accessing audio input. Please check.")
        });
      var r, f, l, c, h, p, d, m, b, v = new Uint8Array(u.freqBinCount),
        y = 0,
        w = 0;

      function g() {
        for (n.getByteTimeDomainData(v), o.init(v, u.maxLevel).calculate(), (r = new i(u.freqBinCount, u.sampleRate)).forward(o.normalize()), f = a.bandpass(r.spectrum, {
            sampleRate: u.sampleRate,
            fLower: 500,
            fUpper: 5e3
          }), l = a.bandstop(r.spectrum, {
            sampleRate: u.sampleRate,
            fLower: 500,
            fUpper: 5e3
          }), c = 0, h = 0, p = 100, b = 0; b < u.freqBinCount / 2; b++) f[b] > c && (c = f[b]), f[b] < p && (p = f[b]), h += Math.abs(l[b]);
        for (meanpbs = h / (b - 1), h = 0, b = 0; b < u.freqBinCount / 2; b++) f[b] = f[b] - p + 2 / u.freqBinCount, h += f[b];
        for (b = 0; b < u.freqBinCount / 2; b++) f[b] /= h;
        d = c / (meanpbs + 1), m = s(f, u.freqBinCount), d > u.whistleBlockThreshold && m > u.jDiffThreshold && ++w > u.sampleThreshold && t({
          ratio: d,
          jDiff: m
        }), 50 === y ? (y = 0, w = 0) : y += 1, window.requestAnimationFrame(g)
      }
    }
  }
}, function(t, e) {
  var r = {
    timeArr: [],
    smqtArr: [],
    maxLevel: 0,
    init: function(t, e) {
      return this.timeArr = t, this.maxLevel = e, this
    },
    calculate: function() {
      return this.smqtArr = this.SMQT(this.timeArr, 1), this
    },
    addUp: function(t, e, r) {
      for (var n = e.concat(r), o = 0; o < n.length; o++) t[o] += n[o];
      return t
    },
    SMQT: function(t, e) {
      if (e === this.maxLevel + 1) return [];
      for (var r, n = [], o = [], i = [], a = 0, s = 0; s < t.length; s++) a += t[s];
      for (r = a / t.length, s = 0; s < t.length; s++) t[s] >= r ? (n.push(1 * Math.pow(2, this.maxLevel - e)), o.push(t[s])) : (n.push(0), i.push(t[s]));
      return this.addUp(n, this.SMQT(o, e + 1), this.SMQT(i, e + 1))
    },
    normalize: function() {
      for (var t = 0; t < this.smqtArr.length; t++) this.smqtArr[t] = (this.smqtArr[t] - Math.pow(2, this.maxLevel - 1)) / Math.pow(2, this.maxLevel - 1);
      return this.smqtArr
    }
  };
  t.exports = r
}, function(t, e) {
  function r(t, e) {
    "function" != typeof this[t] && "object" != typeof this[t] && ("function" == typeof this[e] && "object" != typeof this[e] ? this[t] = this[e] : this[t] = function(t) {
      return t instanceof Array ? t : "number" == typeof t ? new Array(t) : void 0
    })
  }

  function n(t, e) {
    (function(t, e) {
      this.bufferSize = t, this.sampleRate = e, this.bandwidth = 2 / t * e / 2, this.spectrum = new Float32Array(t / 2), this.real = new Float32Array(t), this.imag = new Float32Array(t), this.peakBand = 0, this.peak = 0, this.getBandFrequency = function(t) {
        return this.bandwidth * t + this.bandwidth / 2
      }, this.calculateSpectrum = function() {
        for (var e, r, n, o = this.spectrum, i = this.real, a = this.imag, s = (this.bufferSize, Math.sqrt), f = 0, u = t / 2; f < u; f++)(n = s((e = i[f]) * e + (r = a[f]) * r)) > this.peak && (this.peakBand = f, this.peak = n), o[f] = n
      }
    }).call(this, t, e), this.reverseTable = new Uint32Array(t);
    for (var r, n = 1, o = t >> 1; n < t;) {
      for (r = 0; r < n; r++) this.reverseTable[r + n] = this.reverseTable[r] + o;
      n <<= 1, o >>= 1
    }
    for (this.sinTable = new Float32Array(t), this.cosTable = new Float32Array(t), r = 0; r < t; r++) this.sinTable[r] = Math.sin(-Math.PI / r), this.cosTable[r] = Math.cos(-Math.PI / r)
  }
  r("Float32Array", "WebGLFloatArray"), r("Int32Array", "WebGLIntArray"), r("Uint16Array", "WebGLUnsignedShortArray"), r("Uint8Array", "WebGLUnsignedByteArray"), n.prototype.forward = function(t) {
    var e = this.bufferSize,
      r = this.cosTable,
      n = this.sinTable,
      o = this.reverseTable,
      i = this.real,
      a = this.imag,
      s = (this.spectrum, Math.floor(Math.log(e) / Math.LN2));
    if (Math.pow(2, s) !== e) throw "Invalid buffer size, must be a power of 2.";
    if (e !== t.length) throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + e + " Buffer Size: " + t.length;
    var f, u, l, c, h, p, d, m, b, v = 1;
    for (b = 0; b < e; b++) i[b] = t[o[b]], a[b] = 0;
    for (; v < e;) {
      f = r[v], u = n[v], l = 1, c = 0;
      for (var y = 0; y < v; y++) {
        for (b = y; b < e;) p = l * i[h = b + v] - c * a[h], d = l * a[h] + c * i[h], i[h] = i[b] - p, a[h] = a[b] - d, i[b] += p, a[b] += d, b += v << 1;
        l = (m = l) * f - c * u, c = m * u + c * f
      }
      v <<= 1
    }
    return this.calculateSpectrum()
  }, t.exports = n
}, function(t, e) {
  t.exports = {
    bandpass: function(t, e) {
      for (var r = t.slice(), n = e.sampleRate / (2 * r.length), o = 0; void 0 !== r[o]; o++)(o * n < e.fLower || o * n > e.fUpper) && (r[o] = .15);
      return r
    },
    bandstop: function(t, e) {
      for (var r = t.slice(), n = e.sampleRate / (2 * r.length), o = 0; void 0 !== r[o]; o++) o * n > e.fLower && o * n < e.fUpper && (r[o] = .15);
      return r
    }
  }
}, function(t, e) {
  var r = 5.545177444479573;
  t.exports = function(t, e) {
    return function(t, e) {
      for (var r = 0, n = 0; void 0 !== t[n]; n++) {
        var o = (t[n] + 2 / e) / 2;
        r -= o * Math.log(o)
      }
      return r
    }(t, e) - (function(t) {
      for (var e = 0, r = 0; void 0 !== t[r]; r++) e -= t[r] * Math.log(t[r]);
      return e
    }(t) + r) / 2
  }
}, function(t, e, r) {
  "use strict";
  var n = Object.prototype.hasOwnProperty,
    o = Object.prototype.toString,
    i = Object.defineProperty,
    a = Object.getOwnPropertyDescriptor,
    s = function(t) {
      return "function" == typeof Array.isArray ? Array.isArray(t) : "[object Array]" === o.call(t)
    },
    f = function(t) {
      if (!t || "[object Object]" !== o.call(t)) return !1;
      var e, r = n.call(t, "constructor"),
        i = t.constructor && t.constructor.prototype && n.call(t.constructor.prototype, "isPrototypeOf");
      if (t.constructor && !r && !i) return !1;
      for (e in t);
      return void 0 === e || n.call(t, e)
    },
    u = function(t, e) {
      i && "__proto__" === e.name ? i(t, e.name, {
        enumerable: !0,
        configurable: !0,
        value: e.newValue,
        writable: !0
      }) : t[e.name] = e.newValue
    },
    l = function(t, e) {
      if ("__proto__" === e) {
        if (!n.call(t, e)) return;
        if (a) return a(t, e).value
      }
      return t[e]
    };
  t.exports = function t() {
    var e, r, n, o, i, a, c = arguments[0],
      h = 1,
      p = arguments.length,
      d = !1;
    for ("boolean" == typeof c && (d = c, c = arguments[1] || {}, h = 2), (null == c || "object" != typeof c && "function" != typeof c) && (c = {}); h < p; ++h)
      if (null != (e = arguments[h]))
        for (r in e) n = l(c, r), c !== (o = l(e, r)) && (d && o && (f(o) || (i = s(o))) ? (i ? (i = !1, a = n && s(n) ? n : []) : a = n && f(n) ? n : {}, u(c, {
          name: r,
          newValue: t(d, a, o)
        })) : void 0 !== o && u(c, {
          name: r,
          newValue: o
        }));
    return c
  }
}]);
