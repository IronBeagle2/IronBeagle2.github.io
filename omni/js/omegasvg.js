"use strict";
!(function () {
  function t(t) {
    if ("undefined" == typeof t)
      throw new Error(
        'Pathformer [constructor]: "element" parameter is required'
      );
    if (t.constructor === String && ((t = document.getElementById(t)), !t))
      throw new Error(
        'Pathformer [constructor]: "element" parameter is not related to an existing ID'
      );
    if (
      !(
        t instanceof window.SVGElement ||
        t instanceof window.SVGGElement ||
        /^svg$/i.test(t.nodeName)
      )
    )
      throw new Error(
        'Pathformer [constructor]: "element" parameter must be a string or a SVGelement'
      );
    (this.el = t), this.scan(t);
  }
  function e(t, e, n) {
    r(),
      (this.isReady = !1),
      this.setElement(t, e),
      this.setOptions(e),
      this.setCallback(n),
      this.isReady && this.init();
  }
  (t.prototype.TYPES = [
    "line",
    "ellipse",
    "circle",
    "polygon",
    "polyline",
    "rect",
  ]),
    (t.prototype.ATTR_WATCH = [
      "cx",
      "cy",
      "points",
      "r",
      "rx",
      "ry",
      "x",
      "x1",
      "x2",
      "y",
      "y1",
      "y2",
    ]),
    (t.prototype.scan = function (t) {
      for (
        var e, r, n, i, a = t.querySelectorAll(this.TYPES.join(",")), o = 0;
        o < a.length;
        o++
      )
        (r = a[o]),
          (e = this[r.tagName.toLowerCase() + "ToPath"]),
          (n = e(this.parseAttr(r.attributes))),
          (i = this.pathMaker(r, n)),
          r.parentNode.replaceChild(i, r);
    }),
    (t.prototype.lineToPath = function (t) {
      var e = {},
        r = t.x1 || 0,
        n = t.y1 || 0,
        i = t.x2 || 0,
        a = t.y2 || 0;
      return (e.d = "M" + r + "," + n + "L" + i + "," + a), e;
    }),
    (t.prototype.rectToPath = function (t) {
      var e = {},
        r = parseFloat(t.x) || 0,
        n = parseFloat(t.y) || 0,
        i = parseFloat(t.width) || 0,
        a = parseFloat(t.height) || 0;
      if (t.rx || t.ry) {
        var o = parseInt(t.rx, 10) || -1,
          s = parseInt(t.ry, 10) || -1;
        (o = Math.min(Math.max(0 > o ? s : o, 0), i / 2)),
          (s = Math.min(Math.max(0 > s ? o : s, 0), a / 2)),
          (e.d =
            "M " +
            (r + o) +
            "," +
            n +
            " L " +
            (r + i - o) +
            "," +
            n +
            " A " +
            o +
            "," +
            s +
            ",0,0,1," +
            (r + i) +
            "," +
            (n + s) +
            " L " +
            (r + i) +
            "," +
            (n + a - s) +
            " A " +
            o +
            "," +
            s +
            ",0,0,1," +
            (r + i - o) +
            "," +
            (n + a) +
            " L " +
            (r + o) +
            "," +
            (n + a) +
            " A " +
            o +
            "," +
            s +
            ",0,0,1," +
            r +
            "," +
            (n + a - s) +
            " L " +
            r +
            "," +
            (n + s) +
            " A " +
            o +
            "," +
            s +
            ",0,0,1," +
            (r + o) +
            "," +
            n);
      } else
        e.d =
          "M" +
          r +
          " " +
          n +
          " L" +
          (r + i) +
          " " +
          n +
          " L" +
          (r + i) +
          " " +
          (n + a) +
          " L" +
          r +
          " " +
          (n + a) +
          " Z";
      return e;
    }),
    (t.prototype.polylineToPath = function (t) {
      var e,
        r,
        n = {},
        i = t.points.trim().split(" ");
      if (-1 === t.points.indexOf(",")) {
        var a = [];
        for (e = 0; e < i.length; e += 2) a.push(i[e] + "," + i[e + 1]);
        i = a;
      }
      for (r = "M" + i[0], e = 1; e < i.length; e++)
        -1 !== i[e].indexOf(",") && (r += "L" + i[e]);
      return (n.d = r), n;
    }),
    (t.prototype.polygonToPath = function (e) {
      var r = t.prototype.polylineToPath(e);
      return (r.d += "Z"), r;
    }),
    (t.prototype.ellipseToPath = function (t) {
      var e = {},
        r = parseFloat(t.rx) || 0,
        n = parseFloat(t.ry) || 0,
        i = parseFloat(t.cx) || 0,
        a = parseFloat(t.cy) || 0,
        o = i - r,
        s = a,
        h = parseFloat(i) + parseFloat(r),
        l = a;
      return (
        (e.d =
          "M" +
          o +
          "," +
          s +
          "A" +
          r +
          "," +
          n +
          " 0,1,1 " +
          h +
          "," +
          l +
          "A" +
          r +
          "," +
          n +
          " 0,1,1 " +
          o +
          "," +
          l),
        e
      );
    }),
    (t.prototype.circleToPath = function (t) {
      var e = {},
        r = parseFloat(t.r) || 0,
        n = parseFloat(t.cx) || 0,
        i = parseFloat(t.cy) || 0,
        a = n - r,
        o = i,
        s = parseFloat(n) + parseFloat(r),
        h = i;
      return (
        (e.d =
          "M" +
          a +
          "," +
          o +
          "A" +
          r +
          "," +
          r +
          " 0,1,1 " +
          s +
          "," +
          h +
          "A" +
          r +
          "," +
          r +
          " 0,1,1 " +
          a +
          "," +
          h),
        e
      );
    }),
    (t.prototype.pathMaker = function (t, e) {
      var r,
        n,
        i = document.createElementNS("http://www.w3.org/2000/svg", "path");
      for (r = 0; r < t.attributes.length; r++)
        (n = t.attributes[r]),
          -1 === this.ATTR_WATCH.indexOf(n.name) &&
            i.setAttribute(n.name, n.value);
      for (r in e) i.setAttribute(r, e[r]);
      return i;
    }),
    (t.prototype.parseAttr = function (t) {
      for (var e, r = {}, n = 0; n < t.length; n++) {
        if (
          ((e = t[n]),
          -1 !== this.ATTR_WATCH.indexOf(e.name) && -1 !== e.value.indexOf("%"))
        )
          throw new Error(
            "Pathformer [parseAttr]: a SVG shape got values in percentage. This cannot be transformed into 'path' tags. Please use 'viewBox'."
          );
        r[e.name] = e.value;
      }
      return r;
    });
  var r, n, i, a;
  (e.LINEAR = function (t) {
    return t;
  }),
    (e.EASE = function (t) {
      return -Math.cos(t * Math.PI) / 2 + 0.5;
    }),
    (e.EASE_OUT = function (t) {
      return 1 - Math.pow(1 - t, 3);
    }),
    (e.EASE_IN = function (t) {
      return Math.pow(t, 3);
    }),
    (e.EASE_OUT_BOUNCE = function (t) {
      var e = -Math.cos(0.5 * t * Math.PI) + 1,
        r = Math.pow(e, 1.5),
        n = Math.pow(1 - t, 2),
        i = -Math.abs(Math.cos(2.5 * r * Math.PI)) + 1;
      return 1 - n + i * n;
    }),
    (e.prototype.setElement = function (t, e) {
      var r, n;
      if ("undefined" == typeof t)
        throw new Error(
          'OmegaSVG [constructor]: "element" parameter is required'
        );
      if (t.constructor === String && ((t = document.getElementById(t)), !t))
        throw new Error(
          'OmegaSVG [constructor]: "element" parameter is not related to an existing ID'
        );
      if (((this.parentEl = t), e && e.file)) {
        var n = this;
        r = function () {
          var t = document.createElement("div");
          t.innerHTML = this.responseText;
          var r = t.querySelector("svg");
          if (!r)
            throw new Error(
              "OmegaSVG [load]: Cannot find the SVG in the loaded file : " +
                e.file
            );
          (n.el = r),
            n.el.setAttribute("width", "100%"),
            n.el.setAttribute("height", "100%"),
            n.parentEl.appendChild(n.el),
            (n.isReady = !0),
            n.init(),
            (n = null);
        };
        var i = new window.XMLHttpRequest();
        return (
          i.addEventListener("load", r), i.open("GET", e.file), i.send(), void 0
        );
      }
      switch (t.constructor) {
        case window.SVGSVGElement:
        case window.SVGElement:
        case window.SVGGElement:
          (this.el = t), (this.isReady = !0);
          break;
        case window.HTMLObjectElement:
          (n = this),
            (r = function (e) {
              if (!n.isReady) {
                if (
                  ((n.el =
                    t.contentDocument &&
                    t.contentDocument.querySelector("svg")),
                  !n.el && e)
                )
                  throw new Error(
                    "OmegaSVG [constructor]: object loaded does not contain any SVG"
                  );
                n.el &&
                  (t.getAttribute("built-by-omegasvg") &&
                    (n.parentEl.insertBefore(n.el, t),
                    n.parentEl.removeChild(t),
                    n.el.setAttribute("width", "100%"),
                    n.el.setAttribute("height", "100%")),
                  (n.isReady = !0),
                  n.init(),
                  (n = null));
              }
            }),
            r() || t.addEventListener("load", r);
          break;
        default:
          throw new Error(
            'OmegaSVG [constructor]: "element" parameter is not valid (or miss the "file" attribute)'
          );
      }
    }),
    (e.prototype.setOptions = function (t) {
      var r = [
          "delayed",
          "sync",
          "async",
          "nsync",
          "oneByOne",
          "scenario",
          "scenario-sync",
        ],
        n = ["inViewport", "manual", "autostart"];
      if (void 0 !== t && t.constructor !== Object)
        throw new Error(
          'OmegaSVG [constructor]: "options" parameter must be an object'
        );
      if (((t = t || {}), t.type && -1 === r.indexOf(t.type)))
        throw new Error(
          "OmegaSVG [constructor]: " +
            t.type +
            " is not an existing animation `type`"
        );
      if (((this.type = t.type || r[0]), t.start && -1 === n.indexOf(t.start)))
        throw new Error(
          "OmegaSVG [constructor]: " +
            t.start +
            " is not an existing `start` option"
        );
      if (
        ((this.start = t.start || n[0]),
        (this.isIE =
          -1 !== window.navigator.userAgent.indexOf("MSIE") ||
          -1 !== window.navigator.userAgent.indexOf("Trident/") ||
          -1 !== window.navigator.userAgent.indexOf("Edge/")),
        (this.duration = a(t.duration, 120)),
        (this.delay = a(t.delay, null)),
        (this.dashGap = a(t.dashGap, 1)),
        (this.forceRender = t.hasOwnProperty("forceRender")
          ? !!t.forceRender
          : this.isIE),
        (this.reverseStack = !!t.reverseStack),
        (this.selfDestroy = !!t.selfDestroy),
        (this.onReady = t.onReady),
        (this.map = []),
        (this.frameLength = this.currentFrame = this.delayUnit = this.speed = this.handle = null),
        (this.ignoreInvisible = t.hasOwnProperty("ignoreInvisible")
          ? !!t.ignoreInvisible
          : !1),
        (this.animTimingFunction = t.animTimingFunction || e.LINEAR),
        (this.pathTimingFunction = t.pathTimingFunction || e.LINEAR),
        this.delay >= this.duration)
      )
        throw new Error(
          "OmegaSVG [constructor]: delay must be shorter than duration"
        );
    }),
    (e.prototype.setCallback = function (t) {
      if (t && t.constructor !== Function)
        throw new Error(
          'OmegaSVG [constructor]: "callback" parameter must be a function'
        );
      this.callback = t || function () {};
    }),
    (e.prototype.mapping = function () {
      var t, e, r, n, i, o, s, h;
      for (
        h = o = s = 0, e = this.el.querySelectorAll("path"), t = 0;
        t < e.length;
        t++
      )
        (r = e[t]),
          this.isInvisible(r) ||
            ((i = { el: r, length: Math.ceil(r.getTotalLength()) }),
            isNaN(i.length)
              ? window.console &&
                console.warn &&
                console.warn(
                  "OmegaSVG [mapping]: cannot retrieve a path element length",
                  r
                )
              : (this.map.push(i),
                (r.style.strokeDasharray =
                  i.length + " " + (i.length + 2 * this.dashGap)),
                (r.style.strokeDashoffset = i.length + this.dashGap),
                (i.length += this.dashGap),
                (o += i.length),
                this.renderPath(t)));
      for (
        o = 0 === o ? 1 : o,
          this.delay = null === this.delay ? this.duration / 3 : this.delay,
          this.delayUnit = this.delay / (e.length > 1 ? e.length - 1 : 1),
          this.reverseStack && this.map.reverse(),
          t = 0;
        t < this.map.length;
        t++
      ) {
        switch (((i = this.map[t]), this.type)) {
          case "delayed":
            (i.startAt = this.delayUnit * t),
              (i.duration = this.duration - this.delay);
            break;
          case "oneByOne":
            (i.startAt = (s / o) * this.duration),
              (i.duration = (i.length / o) * this.duration);
            break;
          case "sync":
          case "async":
          case "nsync":
            (i.startAt = 0), (i.duration = this.duration);
            break;
          case "scenario-sync":
            (r = i.el),
              (n = this.parseAttr(r)),
              (i.startAt = h + (a(n["data-delay"], this.delayUnit) || 0)),
              (i.duration = a(n["data-duration"], this.duration)),
              (h =
                void 0 !== n["data-async"]
                  ? i.startAt
                  : i.startAt + i.duration),
              (this.frameLength = Math.max(
                this.frameLength,
                i.startAt + i.duration
              ));
            break;
          case "scenario":
            (r = i.el),
              (n = this.parseAttr(r)),
              (i.startAt = a(n["data-start"], this.delayUnit) || 0),
              (i.duration = a(n["data-duration"], this.duration)),
              (this.frameLength = Math.max(
                this.frameLength,
                i.startAt + i.duration
              ));
        }
        (s += i.length), (this.frameLength = this.frameLength || this.duration);
      }
    }),
    (e.prototype.drawer = function () {
      var t = this;
      if (((this.currentFrame += this.speed), this.currentFrame <= 0))
        this.stop(), this.reset();
      else {
        if (!(this.currentFrame >= this.frameLength))
          return (
            this.trace(),
            (this.handle = n(function () {
              t.drawer();
            })),
            void 0
          );
        this.stop(),
          (this.currentFrame = this.frameLength),
          this.trace(),
          this.selfDestroy && this.destroy();
      }
      this.callback(this),
        this.instanceCallback &&
          (this.instanceCallback(this), (this.instanceCallback = null));
    }),
    (e.prototype.trace = function () {
      var t, e, r, n;
      for (
        n =
          this.animTimingFunction(this.currentFrame / this.frameLength) *
          this.frameLength,
          t = 0;
        t < this.map.length;
        t++
      )
        (r = this.map[t]),
          (e = (n - r.startAt) / r.duration),
          (e = this.pathTimingFunction(Math.max(0, Math.min(1, e)))),
          r.progress !== e &&
            ((r.progress = e),
            (r.el.style.strokeDashoffset = Math.floor(r.length * (1 - e))),
            this.renderPath(t));
    }),
    (e.prototype.renderPath = function (t) {
      if (this.forceRender && this.map && this.map[t]) {
        var e = this.map[t],
          r = e.el.cloneNode(!0);
        e.el.parentNode.replaceChild(r, e.el), (e.el = r);
      }
    }),
    (e.prototype.init = function () {
      (this.frameLength = 0),
        (this.currentFrame = 0),
        (this.map = []),
        new t(this.el),
        this.mapping(),
        this.starter(),
        this.onReady && this.onReady(this);
    }),
    (e.prototype.starter = function () {
      switch (this.start) {
        case "manual":
          return;
        case "autostart":
          this.play();
          break;
        case "inViewport":
          var t = this,
            e = function () {
              t.isInViewport(t.parentEl, 1) &&
                (t.play(), window.removeEventListener("scroll", e));
            };
          window.addEventListener("scroll", e), e();
      }
    }),
    (e.prototype.getStatus = function () {
      return 0 === this.currentFrame
        ? "start"
        : this.currentFrame === this.frameLength
        ? "end"
        : "progress";
    }),
    (e.prototype.reset = function () {
      return this.setFrameProgress(0);
    }),
    (e.prototype.finish = function () {
      return this.setFrameProgress(1);
    }),
    (e.prototype.setFrameProgress = function (t) {
      return (
        (t = Math.min(1, Math.max(0, t))),
        (this.currentFrame = Math.round(this.frameLength * t)),
        this.trace(),
        this
      );
    }),
    (e.prototype.play = function (t, e) {
      if (((this.instanceCallback = null), t && "function" == typeof t))
        (this.instanceCallback = t), (t = null);
      else if (t && "number" != typeof t)
        throw new Error("OmegaSVG [play]: invalid speed");
      return (
        e &&
          "function" == typeof e &&
          !this.instanceCallback &&
          (this.instanceCallback = e),
        (this.speed = t || 1),
        this.handle || this.drawer(),
        this
      );
    }),
    (e.prototype.stop = function () {
      return this.handle && (i(this.handle), (this.handle = null)), this;
    }),
    (e.prototype.destroy = function () {
      this.stop();
      var t, e;
      for (t = 0; t < this.map.length; t++)
        (e = this.map[t]),
          (e.el.style.strokeDashoffset = null),
          (e.el.style.strokeDasharray = null),
          this.renderPath(t);
    }),
    (e.prototype.isInvisible = function (t) {
      var e,
        r = t.getAttribute("data-ignore");
      return null !== r
        ? "false" !== r
        : this.ignoreInvisible
        ? ((e = t.getBoundingClientRect()), !e.width && !e.height)
        : !1;
    }),
    (e.prototype.parseAttr = function (t) {
      var e,
        r = {};
      if (t && t.attributes)
        for (var n = 0; n < t.attributes.length; n++)
          (e = t.attributes[n]), (r[e.name] = e.value);
      return r;
    }),
    (e.prototype.isInViewport = function (t, e) {
      var r = this.scrollY(),
        n = r + this.getViewportH(),
        i = t.getBoundingClientRect(),
        a = i.height,
        o = r + i.top,
        s = o + a;
      return (e = e || 0), n >= o + a * e && s >= r;
    }),
    (e.prototype.getViewportH = function () {
      var t = this.docElem.clientHeight,
        e = window.innerHeight;
      return e > t ? e : t;
    }),
    (e.prototype.scrollY = function () {
      return window.pageYOffset || this.docElem.scrollTop;
    }),
    (r = function () {
      e.prototype.docElem ||
        ((e.prototype.docElem = window.document.documentElement),
        (n = (function () {
          return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (t) {
              return window.setTimeout(t, 1e3 / 60);
            }
          );
        })()),
        (i = (function () {
          return (
            window.cancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.msCancelAnimationFrame ||
            function (t) {
              return window.clearTimeout(t);
            }
          );
        })()));
    }),
    (a = function (t, e) {
      var r = parseInt(t, 10);
      return r >= 0 ? r : e;
    }),
    "function" == typeof define && define.amd
      ? define([], function () {
          return e;
        })
      : "object" == typeof exports
      ? (module.exports = e)
      : (window.OmegaSVG = e);
})();
