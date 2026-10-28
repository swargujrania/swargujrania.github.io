// Case study interactions: scroll reveal, tabs and the hierarchy explorer.
// Content stays readable without this script (see html:not(.cs-js) rules).
(function () {
  document.documentElement.classList.add('cs-js');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Embeds marked with data-src start loading only after the page has loaded,
  // so a slow third-party prototype never holds up the page loader.
  function loadEmbeds() {
    document.querySelectorAll('iframe[data-src]').forEach(function (f) {
      f.src = f.getAttribute('data-src');
      f.removeAttribute('data-src');
    });
  }
  if (document.readyState === 'complete') loadEmbeds();
  else window.addEventListener('load', loadEmbeds);

  ready(function () {
    // Reveal elements as they scroll into view
    var revealables = document.querySelectorAll('.cs-reveal, .cs-stagger, .cs-observe, .cs-block');
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealables.forEach(function (el) { observer.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }

    // Tabs
    document.querySelectorAll('.cs-tabs').forEach(function (tabs) {
      var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
      function select(idx, focus) {
        buttons.forEach(function (btn, i) {
          var on = i === idx;
          btn.setAttribute('aria-selected', on);
          btn.tabIndex = on ? 0 : -1;
          document.getElementById(btn.getAttribute('aria-controls')).hidden = !on;
        });
        if (focus) buttons[idx].focus();
      }
      buttons.forEach(function (btn, i) {
        btn.addEventListener('click', function () { select(i); });
        btn.addEventListener('keydown', function (ev) {
          if (ev.key === 'ArrowRight') select((i + 1) % buttons.length, true);
          if (ev.key === 'ArrowLeft') select((i - 1 + buttons.length) % buttons.length, true);
        });
      });
      select(0);
    });

    // Hierarchy explorer: shows each level's definition, cycling until the visitor picks one
    document.querySelectorAll('.cs-chain-wrap').forEach(function (wrap) {
      var nodes = Array.prototype.slice.call(wrap.querySelectorAll('.cs-chain-node'));
      var detail = wrap.querySelector('.cs-chain-detail');
      var current = 0;
      var timer = null;
      function show(idx) {
        current = idx;
        nodes.forEach(function (n, i) { n.setAttribute('aria-pressed', i === idx); });
        var node = nodes[idx];
        detail.innerHTML = '<strong></strong><span></span>';
        detail.firstChild.textContent = node.querySelector('.cs-chain-label').textContent;
        detail.lastChild.textContent = node.querySelector('.cs-chain-def').textContent;
      }
      function stop() { if (timer) { clearInterval(timer); timer = null; } }
      nodes.forEach(function (n, i) {
        n.addEventListener('click', function () { stop(); show(i); });
        n.addEventListener('mouseenter', function () { stop(); show(i); });
      });
      show(0);
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) {
        timer = setInterval(function () { show((current + 1) % nodes.length); }, 2600);
      }
    });
  });
  // ---------- Phones and tablets: reflow the rebuilt slides ----------
  // Each .cs-slide places text, shapes and cut-outs at measured positions and
  // scales with the column, which leaves the text tiny on a narrow screen. Below
  // MOBILE the slide is hidden and a stacked copy is shown instead: the items
  // are split into rows and columns (recursive XY cut), paragraphs reflow at a
  // readable size, panels keep their colour, and anything that only works as a
  // picture (diagrams, labels over images) stays positioned, scaled to fit.
  // Wider screens never build this, so the desktop layout is untouched.
  var MOBILE = '(max-width: 900px)';
  var REF = 840;          // column width (px) the slides were tuned for
  var U = REF / 1500;     // slide units -> desktop px
  var GAP = 6;
  var MAXH = 440;         // px: tall photos and screens stop growing here            // slide units between items that counts as a gap

  function deskPx(fs) {   // font-size "1.59cqw" -> px at the desktop column width
    var v = parseFloat(fs) || 0;
    return /cqw/.test(fs) ? v * REF / 100 : v;
  }
  function ext(items) {
    var b = [1e9, 1e9, -1e9, -1e9];
    items.forEach(function (i) {
      b[0] = Math.min(b[0], i.b[0]); b[1] = Math.min(b[1], i.b[1]);
      b[2] = Math.max(b[2], i.b[2]); b[3] = Math.max(b[3], i.b[3]);
    });
    return b;
  }
  function inter(a, b) {
    return [Math.min(a[2], b[2]) - Math.max(a[0], b[0]), Math.min(a[3], b[3]) - Math.max(a[1], b[1])];
  }

  // Long slides were cut into parts at wide black gaps; consecutive parts are
  // laid out together so a row of icons keeps the captions in the next part.
  function measure(parts) {
    var or = parts[0].getBoundingClientRect();
    if (!or.width) return null;
    var k = 1500 / or.width, items = [];
    parts.forEach(function (slide) {
    var sr = slide.getBoundingClientRect();
    var P = { el: slide, oy: (sr.top - or.top) * k, H: sr.height * k, idx: slide.csIdx };
    var pic = [];
    Array.prototype.forEach.call(slide.children, function (el) {
      if (el.getAttribute('data-m') === 'drop') return;     // left out of the phone layout
      if (el.tagName.toLowerCase() === 'svg') {
        var vy = el.viewBox && el.viewBox.baseVal ? el.viewBox.baseVal.y : 0;
        Array.prototype.forEach.call(el.children, function (c) {
          if (c.getAttribute('data-m') === 'drop') return;
          var bb = c.getBBox(), sw = (parseFloat(c.getAttribute('stroke-width')) || 0) / 2;
          (slide.getAttribute('data-m') === 'pic' ? pic : items).push({ t: 'v', el: c, svg: el, p: P, b: [bb.x - sw, bb.y - vy - sw + P.oy, bb.x + bb.width + sw, bb.y - vy + bb.height + sw + P.oy] });
        });
        return;
      }
      var r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      var cl = el.classList;
      var t = cl.contains('cs-t') ? 't' : cl.contains('cs-s') ? 's' : cl.contains('cs-f') ? 'f' : cl.contains('cs-x') ? 'x' : 'g';
      var it = { t: t, el: el, p: P, b: [(r.left - or.left) * k, (r.top - or.top) * k, (r.right - or.left) * k, (r.bottom - or.top) * k] };
      if (t === 't') it.fs = deskPx(el.style.fontSize);
      if (t === 's') it.round = /50%/.test(el.style.borderRadius);
      // a picture keeps its labels; paragraphs beside it still reflow
      (slide.getAttribute('data-m') === 'pic' && !(t === 't' && el.textContent.trim().length > 60) ? pic : items).push(it);
    });
    // data-m="pic": a diagram that only reads as a picture, kept whole
    if (pic.length) items.push({ t: 'c', pic: true, parts: pic, b: ext(pic) });
    });
    return { items: compound(items), k: k };
  }

  // Pieces of one drawing (an icon made of dots and rings, a diagram's nodes
  // and connectors) travel together. Text, screenshots, tables and panels that
  // hold text stay separate.
  function compound(items) {
    var texts = items.filter(function (i) { return i.t === 't'; });
    var holdsText = function (i) {
      return !i.round && texts.some(function (t) {
        var cx = (t.b[0] + t.b[2]) / 2, cy = (t.b[1] + t.b[3]) / 2;
        return cx > i.b[0] && cx < i.b[2] && cy > i.b[1] && cy < i.b[3];
      });
    };
    var art = items.filter(function (i) { return i.t === 'g' || i.t === 'v' || (i.t === 's' && !holdsText(i)); });
    var rest = items.filter(function (i) { return art.indexOf(i) < 0; });
    var par = art.map(function (i, n) { return n; });
    function find(a) { while (par[a] !== a) a = par[a] = par[par[a]]; return a; }
    for (var a = 0; a < art.length; a++) for (var b = a + 1; b < art.length; b++) {
      var o = inter(art[a].b, art[b].b);
      if (o[0] > -18 && o[1] > -18) par[find(a)] = find(b);
    }
    var groups = {};
    art.forEach(function (i, n) { (groups[find(n)] = groups[find(n)] || []).push(i); });
    Object.keys(groups).forEach(function (k) {
      var g = groups[k];
      // a diagram keeps the short labels sitting next to it
      if (g.some(function (i) { return i.t === 'v' || (i.t === 's' && i.round); })) {
        var e = ext(g), big = size({ b: e }) > 200;
        rest = rest.filter(function (t) {
          if (t.t !== 't' || t.el.textContent.trim().length > 30) return true;
          var o = inter(e, t.b);
          // big diagrams keep the labels around them; badges keep the digit inside them
          if (big ? (o[0] > -40 && o[1] > -40) : centerIn(t, { b: e })) { g.push(t); return false; }
          return true;
        });
      }
      rest.push(g.length === 1 ? g[0] : { t: 'c', parts: g, b: ext(g) });
    });
    // stray bullets and specks cut out of the slide
    return rest.filter(function (i) { return !(i.t === 'g' && size(i) < 16); });
  }
  function flat(items) {
    var out = [];
    items.forEach(function (i) { if (i.t === 'c') out.push.apply(out, i.parts); else out.push(i); });
    return out;
  }

  // Split along one axis wherever nothing crosses a gap
  function split(items, ax, minGap) {
    var G = minGap === undefined ? GAP : minGap;
    var s = items.slice().sort(function (a, b) { return a.b[ax] - b.b[ax]; });
    var groups = [[s[0]]], gaps = [], end = s[0].b[ax + 2], best = 0;
    for (var i = 1; i < s.length; i++) {
      var g = s[i].b[ax] - end;
      if (g > G) { groups.push([s[i]]); gaps.push(g); best = Math.max(best, g); }
      else groups[groups.length - 1].push(s[i]);
      end = Math.max(end, s[i].b[ax + 2]);
    }
    return { groups: groups, gaps: gaps, best: best };
  }

  function tree(items) {
    // lone vertical rules and dots carry no content once the layout is stacked
    if (flat(items).every(function (i) { return i.t === 'v'; })) {
      var e = ext(items);
      return (e[2] - e[0]) > 3 * (e[3] - e[1]) && e[2] - e[0] > 40 ? { type: 'mini', items: items } : null;
    }
    if (items.length > 1) {
      var y = split(items, 1), x = split(items, 0);
      if (y.groups.length > 1) {
        // a row of drawings followed by rows of captions in the same columns is
        // one block: split it into columns so each drawing keeps its caption
        var b = bands(y.groups);
        if (b.length === 1 && x.groups.length > 1) y = { groups: [items], best: -1 };   // one block of columns
        else {
          var gaps = [];
          for (var i = 1; i < b.length; i++) gaps.push(ext(b[i])[1] - ext(b[i - 1])[3]);
          return { type: 'rows', gaps: gaps, kids: b.map(function (g) { return { b: ext(g), n: tree(g) }; }) };
        }
      }
      // nothing apart by a clear gap: take any gap between rows (a label just above its icon row)
      if (y.groups.length < 2 && x.groups.length < 2) {
        var yt = split(items, 1, 0);
        if (yt.groups.length > 1) y = yt;
      }
      if (y.groups.length > 1 || x.groups.length > 1) {
        var rows = y.groups.length > 1 && (x.groups.length < 2 || y.best >= x.best);
        var sp = rows ? y : x;
        return { type: rows ? 'rows' : 'cols', gaps: sp.gaps,
          kids: sp.groups.map(function (g) { return { b: ext(g), n: tree(g) }; }) };
      }
    }
    return leaf(items);
  }

  function bands(groups) {
    var isText = function (i) { return i.t === 't'; };
    var cols = function (g) { return g.length > 1 ? split(g, 0).groups.length : 1; };
    var out = [], i = 0;
    var short = function (q) { return q.t === 't' && q.el.textContent.trim().length <= 40; };
    while (i < groups.length) {
      var g = groups[i];
      // column headings above a row with the same columns head those columns
      if (i + 1 < groups.length && g.length > 1 && g.every(short) && cols(g) >= 2 && cols(groups[i + 1]) === cols(g)) {
        out.push(g.concat(groups[i + 1])); i += 2; continue;
      }
      if (cols(g) >= 2 && !g.some(isText)) {
        var j = i + 1, acc = g.slice();
        while (j < groups.length && (groups[j].every(isText) || !groups[j].some(isText)) && cols(groups[j]) >= 2) {
          if (!groups[j].some(isText) && !groups[j - 1].some(isText) && cols(groups[j]) !== cols(g)) break;
          acc = acc.concat(groups[j]); j++;
        }
        if (j > i + 1) { out.push(acc); i = j; continue; }
      }
      out.push(g); i++;
    }
    return out;
  }

  function size(i) { return Math.max(i.b[2] - i.b[0], i.b[3] - i.b[1]); }
  function boxArea(i) { return (i.b[2] - i.b[0]) * (i.b[3] - i.b[1]); }
  function centerIn(i, P) {
    var cx = (i.b[0] + i.b[2]) / 2, cy = (i.b[1] + i.b[3]) / 2;
    return cx > P.b[0] && cx < P.b[2] && cy > P.b[1] && cy < P.b[3];
  }

  function groupRest(rest) {
    if (rest.length === 1) return [{ b: rest[0].b, n: leaf(rest) }];
    var t = tree(rest);
    return t && t.type === 'rows' ? t.kids : [{ b: ext(rest), n: t }];
  }

  function leaf(items) {
    // corner pieces and stray bullets cut out of the slide mean nothing on their own
    if (items.length > 1) {
      var thin = function (q) { return Math.min(q.b[2] - q.b[0], q.b[3] - q.b[1]) < 14; };
      var kept = items.filter(function (i) {
        if (i.t === 'g' && size(i) < 16) return false;
        if ((i.t === 'c' && !i.pic && i.parts.every(function (q) { return q.t === 'g' && thin(q); })) || (i.t === 'g' && thin(i) && size(i) > 200)) return false;
        return true;
      });
      if (kept.length && kept.length < items.length) items = kept;
    }
    // every flat panel (or card image) that holds text keeps that text inside it
    var holders = items.filter(function (i) {
      return i.t === 's' && !i.round &&
        items.some(function (t) { return t.t === 't' && centerIn(t, i); });
    }).sort(function (a, b) { return boxArea(a) - boxArea(b); });
    if (holders.length && items.length > 2) {
      var taken = [], panels = [];
      holders.forEach(function (P) {
        if (taken.indexOf(P) >= 0) return;
        var inner = items.filter(function (i) { return i !== P && taken.indexOf(i) < 0 && centerIn(i, P) && boxArea(i) < boxArea(P); });
        if (!inner.some(function (i) { return i.t === 't'; })) return;
        taken.push(P); taken.push.apply(taken, inner);
        panels.push({ b: P.b.slice(), n: { type: 'panel', P: P, n: inner.length > 1 ? tree(inner) : leaf(inner) } });
      });
      if (panels.length && (panels.length > 1 || taken.length < items.length)) {
        var rest = items.filter(function (i) {
          if (taken.indexOf(i) >= 0) return false;
          // a shadow or border drawn around a card goes with the card
          var art = i.t === 'g' || (i.t === 'c' && !i.pic && i.parts.every(function (q) { return q.t === 'g' || q.t === 's'; }));
          return !(art && panels.some(function (pn) {
            var o = inter(i.b, pn.b);
            return o[0] > 0.9 * (pn.b[2] - pn.b[0]) && o[1] > 0.9 * (pn.b[3] - pn.b[1]) && boxArea(i) > 1.2 * boxArea(pn);
          }));
        });
        var kids = panels.concat(rest.length ? groupRest(rest) : []);
        kids.sort(function (a, b) { return a.b[1] - b.b[1] || a.b[0] - b.b[0]; });
        return { type: 'rows', gaps: kids.slice(1).map(function (k, i) { return k.b[1] - kids[i].b[3]; }), kids: kids };
      }
      if (panels.length) return panels[0].n;
    }
    if (items.length === 1) {
      var it = items[0];
      if (it.t === 'v') {
        var e = it.b;   // a lone line only reads as a rule when it runs across
        return (e[2] - e[0]) > 3 * (e[3] - e[1]) && e[2] - e[0] > 40 ? { type: 'mini', items: items } : null;
      }
      if (it.t === 'g') {
        var w = it.b[2] - it.b[0], h = it.b[3] - it.b[1];
        if (h > 3.5 * w) return null;                           // elbow connectors, vertical rules
        if (h < 30 && w > 2.5 * h && !(w > 200 && h < 10)) return null;  // small arrows
      }
      // arrows and elbow connectors point at neighbours that are now stacked
      if (it.t === 'c' && !it.pic && it.parts.every(function (i) {
        return i.t === 'v' || (i.t === 'g' && Math.min(i.b[2] - i.b[0], i.b[3] - i.b[1]) < 40);
      })) return null;
      if (it.t === 'c') return { type: 'mini', items: it.parts };
      return it.t === 't' ? { type: 'text', it: it } : it.t === 'x' ? { type: 'raw', it: it } :
        it.t === 'g' || it.t === 'f' ? { type: 'img', it: it } : { type: 'mini', items: items };
    }
    // a panel: the largest flat shape holds everything else, text included
    var shapes = items.filter(function (i) { return i.t === 's' && !i.round; });
    if (shapes.length) {
      var area = function (i) { return (i.b[2] - i.b[0]) * (i.b[3] - i.b[1]); };
      var P = shapes.sort(function (a, b) { return area(b) - area(a); })[0];
      var rest = items.filter(function (i) { return i !== P; });
      var inside = rest.every(function (i) {
        var cx = (i.b[0] + i.b[2]) / 2, cy = (i.b[1] + i.b[3]) / 2;
        return cx > P.b[0] && cx < P.b[2] && cy > P.b[1] && cy < P.b[3];
      });
      if (inside && rest.some(function (i) { return i.t === 't'; })) return { type: 'panel', P: P, n: tree(rest) };
    }
    // circles and line art drawn behind a paragraph are backdrop: drop them and let the text flow
    var longText = items.filter(function (i) { return i.t === 't' && i.el.textContent.trim().length > 40; });
    var backdrop = items.filter(function (i) {
      var parts = i.t === 'c' && !i.pic ? i.parts : i.t === 's' && i.round ? [i] : null;
      if (!parts) return false;
      var rings = parts.filter(function (q) { return q.t === 's' && q.round; });
      var traced = function (q) {      // the cut-out of a circle's own edge
        return q.t === 'g' && rings.some(function (r) {
          var o = inter(q.b, r.b);
          return o[0] > 0 && o[1] > 0 && o[0] * o[1] > 0.8 * (q.b[2] - q.b[0]) * (q.b[3] - q.b[1]);
        });
      };
      if (parts.some(function (q) { return q.t !== 's' && q.t !== 'v' && !traced(q); })) return false;
      return longText.some(function (t) {
        var o = inter(i.b, t.b);
        return o[0] > 0 && o[1] > 0 && o[0] * o[1] > 0.2 * Math.min((t.b[2] - t.b[0]) * (t.b[3] - t.b[1]), (i.b[2] - i.b[0]) * (i.b[3] - i.b[1]));
      });
    });
    if (backdrop.length && items.length > backdrop.length) {
      return tree(items.filter(function (i) { return backdrop.indexOf(i) < 0; }));
    }
    // connectors and rings: a diagram, keep it as a picture
    if (items.some(function (i) { return i.t === 'v' || (i.t === 's' && i.round); })) return { type: 'mini', items: flat(items) };
    // otherwise only things that really overlap stay together
    var comp = items.map(function (i, n) { return n; });
    function find(a) { while (comp[a] !== a) a = comp[a] = comp[comp[a]]; return a; }
    for (var a = 0; a < items.length; a++) for (var b = a + 1; b < items.length; b++) {
      var A = items[a], B = items[b];
      if (A.t === 't' && B.t === 't') continue;
      // only short labels belong to the art they sit on; paragraphs stay text
      if ((A.t === 't' && A.el.textContent.trim().length > 40) || (B.t === 't' && B.el.textContent.trim().length > 40)) continue;
      var o = inter(A.b, B.b);
      var small = Math.min((A.b[2] - A.b[0]) * (A.b[3] - A.b[1]), (B.b[2] - B.b[0]) * (B.b[3] - B.b[1]));
      if (o[0] > 2 && o[1] > 2 && o[0] * o[1] > 0.12 * small) comp[find(a)] = find(b);
    }
    var groups = {};
    items.forEach(function (i, n) { (groups[find(n)] = groups[find(n)] || []).push(i); });
    var parts = Object.keys(groups).map(function (k) { return groups[k]; });
    parts.sort(function (p, q) { var a = ext(p), b = ext(q); return (a[1] + a[3]) - (b[1] + b[3]) || a[0] - b[0]; });
    if (parts.length === 1) return { type: 'mini', items: flat(items) };
    return { type: 'rows', gaps: parts.slice(1).map(function () { return 20; }),
      kids: parts.map(function (g) { return { b: ext(g), n: leaf(g) }; }) };
  }

  function el(tag, cls, css) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (css) e.style.cssText = css;
    return e;
  }

  function textEl(it) {
    var src = it.el, st = src.style, p = src.cloneNode(true);
    var al = st.textAlign === 'center' || /translateX\(-50%\)/.test(st.transform) ? 'center' :
      st.textAlign === 'right' ? 'right' : 'left';
    var fs = Math.max(14, Math.min(it.fs || 14, 30));
    if (/^\s*•/.test(src.textContent)) al = 'left';   // bullet lists read left-aligned
    p.removeAttribute('style');
    p.className = 'cs-t cs-mt';
    p.style.cssText = 'font-size:' + fs.toFixed(1) + 'px;font-weight:' + (st.fontWeight || 400) + ';color:' + st.color +
      ';text-align:' + al + ';' + (st.fontFamily ? 'font-family:' + st.fontFamily + ';' : '') +
      (st.fontStyle ? 'font-style:' + st.fontStyle + ';' : '') + (st.letterSpacing ? 'letter-spacing:' + st.letterSpacing + ';' : '');
    var bullet = /^\s*(•|–|-|\d+[.)])\s/;
    var lines = Array.prototype.slice.call(src.querySelectorAll('span')).filter(function (sp) { return /block/.test(sp.style.display); });
    var brs = src.querySelectorAll('br').length;
    var texts = (src.innerText || src.textContent).split('\n').map(function (t) { return t.trim(); }).filter(Boolean);
    // a short list (names, labels) keeps its line breaks
    var keep = (lines.length + brs) > 0 && texts.length > 1 && texts.every(function (t) { return t.length <= 32 && !/[.,;:]$/.test(t); });
    if (keep) bullet = /^/;
    // lines were placed one by one; let them wrap again, keeping list items on their own line
    Array.prototype.slice.call(p.querySelectorAll('span')).forEach(function (sp) {
      if (!/block/.test(sp.style.display)) return;
      if (bullet.test(sp.textContent)) { sp.removeAttribute('style'); sp.style.display = 'block'; return; }
      var frag = document.createDocumentFragment();
      var before = sp.previousSibling;
      if (before && !/\s$/.test(before.textContent || '')) frag.appendChild(document.createTextNode(' '));
      while (sp.firstChild) frag.appendChild(sp.firstChild);
      frag.appendChild(document.createTextNode(' '));
      sp.parentNode.replaceChild(frag, sp);
    });
    Array.prototype.slice.call(p.querySelectorAll('br')).forEach(function (br) {
      var next = br.nextSibling;
      if (next && bullet.test(next.textContent || '')) return;
      br.parentNode.replaceChild(document.createTextNode(' '), br);
    });
    return p;
  }

  function imgEl(it, cw) {
    var w = (it.b[2] - it.b[0]) * U, h = (it.b[3] - it.b[1]) * U, rw = Math.min(w, cw, MAXH * w / h);
    var box = el('div', 'cs-mimg', 'width:' + rw.toFixed(1) + 'px;height:' + (rw * h / w).toFixed(1) + 'px;');
    var c = it.el.cloneNode(true);
    c.style.cssText = 'display:block;width:100%;height:100%;margin:0;';
    box.appendChild(c);
    return box;
  }

  function rawEl(it) {
    var wrap = el('div', 'cs-mscroll');
    var c = it.el.cloneNode(true);
    c.removeAttribute('style');
    c.className = it.el.className + ' cs-mraw';
    wrap.appendChild(c);
    return wrap;
  }

  function miniEl(items, cw, slide, M) {
    items = flat(items);
    var P = items[0].p, pad = 4;
    items = items.filter(function (i) { return i.p === P; });
    var b = ext(items);
    b = [Math.max(0, b[0] - pad), Math.max(0, b[1] - P.oy - pad), Math.min(1500, b[2] + pad), Math.min(P.H, b[3] - P.oy + pad)];
    var lw = b[2] - b[0], lh = b[3] - b[1];
    if (lw <= 0 || lh <= 0) return null;
    var target = lw * U, rw = Math.min(target, cw, MAXH * lw / lh);
    var fonts = items.filter(function (i) { return i.t === 't'; }).map(function (i) { return i.fs || 14; });
    if (fonts.length) rw = Math.min(target, Math.max(cw, 9.5 * target / Math.min.apply(null, fonts)));
    var s = rw / lw;                                 // px per slide unit
    var view = el('div', 'cs-mview', 'width:' + rw.toFixed(1) + 'px;height:' + (lh * s).toFixed(1) + 'px;');
    var inner = el('div', 'cs-slide is-visible cs-minner', 'left:' + (-b[0] * s).toFixed(1) + 'px;top:' + (-b[1] * s).toFixed(1) +
      'px;width:' + (1500 * s).toFixed(1) + 'px;height:' + (P.H * s).toFixed(1) + 'px;');
    var svgs = [];
    // keep the slide's stacking order: panels first, text on top
    items = items.slice().sort(function (a, b) {
      var x = a.t === 'v' ? a.svg : a.el, y = b.t === 'v' ? b.svg : b.el;
      return x === y ? 0 : x.compareDocumentPosition(y) & 4 ? -1 : 1;
    });
    items.forEach(function (i) {
      if (i.t !== 'v') { inner.appendChild(i.el.cloneNode(true)); return; }
      var k = svgs.indexOf(i.svg);
      if (k < 0) { svgs.push(i.svg); var sc = i.svg.cloneNode(false); svgs.push(sc); inner.insertBefore(sc, inner.firstChild); k = svgs.length - 2; }
      svgs[k + 1].appendChild(i.el.cloneNode(true));
    });
    view.appendChild(inner);
    if (rw <= cw + 1) return view;
    var wrap = el('div', 'cs-mwide');
    var sc2 = el('div', 'cs-mscroll');
    sc2.appendChild(view);
    wrap.appendChild(sc2);
    var hint = el('p', 'cs-mhint');
    hint.textContent = 'Swipe sideways to see the whole diagram';
    wrap.appendChild(hint);
    return wrap;
  }

  var DEBUG = /mdebug/.test(location.search);
  if (DEBUG) window.csDebug = { measure: measure, tree: tree, leaf: leaf };
  function render(n, cw, slide, M) {
    var r = render0(n, cw, slide, M);
    if (DEBUG && r && n) {
      var it = n.it || (n.items && n.items[0]) || (n.P);
      if (it) { var f = flat([it])[0]; if (f.p) r.setAttribute('data-part', f.p.idx); }
    }
    return r;
  }
  function render0(n, cw, slide, M) {
    if (!n) return null;
    if (n.type === 'text') return textEl(n.it);
    if (n.type === 'img') return imgEl(n.it, cw);
    if (n.type === 'raw') return rawEl(n.it);
    if (n.type === 'mini') return miniEl(n.items, cw, slide, M);
    if (n.type === 'panel') {
      var st = n.P.el.style;
      var box = el('div', 'cs-mpanel', 'background:' + st.background + ';' + (st.border ? 'border:' + st.border + ';' : ''));
      var inner = render(n.n, cw - 28, slide, M);
      if (inner) box.appendChild(inner);
      return box;
    }
    // rows and columns
    var kids = n.kids;
    // a small icon beside its label stays a row: icon left, text right
    if (n.type === 'cols') {
      var icon = function (k) { return k && k.n && /^(img|mini)$/.test(k.n.type) && k.b[2] - k.b[0] < 200 && k.b[3] - k.b[1] < 200; };
      var label = function (k) { return k && k.n && textLen(k.n) > 0 && textLen(k.n) <= 140 && isTextOnly(k.n); };
      // each icon takes the nearer label beside it (labels sit left or right of their icon)
      var mate = kids.map(function () { return -1; }), paired = 0;
      kids.forEach(function (k, q) {
        if (!icon(k)) return;
        var L = q > 0 && mate[q - 1] < 0 && label(kids[q - 1]) ? k.b[0] - kids[q - 1].b[2] : Infinity;
        var R = q + 1 < kids.length && label(kids[q + 1]) ? kids[q + 1].b[0] - k.b[2] : Infinity;
        if (L === Infinity && R === Infinity) return;
        var o = L < R ? q - 1 : q + 1;
        mate[q] = o; mate[o] = q; paired++;
      });
      var units = [];
      kids.forEach(function (k, q) {
        if (mate[q] < 0) { units.push(k); return; }
        if (mate[q] < q) return;
        var a = icon(k) ? k : kids[mate[q]], t = icon(k) ? kids[mate[q]] : k;
        units.push({ b: ext([a, t]), pair: [a, t] });
      });
      if (paired) {
        var mkRow = function (u, w) {
          var iw = Math.min(56, (u.pair[0].b[2] - u.pair[0].b[0]) * U);
          var row = el('div', 'cs-mrow');
          var ic = render(u.pair[0].n, iw, slide, M), tx = render(u.pair[1].n, w - iw - 14, slide, M);
          if (ic) { ic.style.flex = '0 0 ' + iw.toFixed(0) + 'px'; row.appendChild(ic); }
          if (tx) { tx.style.flex = '1 1 auto'; tx.style.minWidth = '0'; row.appendChild(tx); }
          return row;
        };
        if (units.length === 1) return mkRow(units[0], cw);
        var st2 = el('div', 'cs-mstack');
        units.forEach(function (u) {
          var r = u.pair ? mkRow(u, cw) : render(u.n, cw, slide, M);
          if (!r) return;
          if (st2.firstChild) r.style.marginTop = '14px';
          st2.appendChild(r);
        });
        return st2;
      }
    }
    if (n.type === 'cols' && kids.length > 1 && kids.every(function (k) { return k.b[2] - k.b[0] < 0.5 * 1500; })) {
      var chars = 0;
      kids.forEach(function (k) { chars = Math.max(chars, k.n ? textLen(k.n) : 0); });
      var min = chars < 60 ? 130 : 220, cols = Math.max(1, Math.min(kids.length, Math.floor((cw + 18) / (min + 18))));
      if (cols > 1) {
        var grid = el('div', 'cs-mgrid', 'grid-template-columns:repeat(' + cols + ',minmax(0,1fr));');
        var colW = (cw - 18 * (cols - 1)) / cols;
        kids.forEach(function (k) { var r = render(k.n, colW, slide, M); if (r) grid.appendChild(r); });
        return grid;
      }
    }
    var stack = el('div', 'cs-mstack');
    kids.forEach(function (k, i) {
      var r = render(k.n, cw, slide, M);
      if (!r) return;
      if (stack.firstChild) {
        var g = n.type === 'rows' ? (n.gaps[i - 1] || 20) * U : 30;
        r.style.marginTop = Math.round(Math.max(10, Math.min(40, g * 0.5))) + 'px';
        // lines of one phrase set apart only by weight read as one block
        var prev = stack.lastChild;
        if (n.type === 'rows' && g < 16 && /cs-mt/.test(prev.className) && /cs-mt/.test(r.className)) {
          r.style.marginTop = '0';
          if (prev.style.textAlign === 'center' || r.style.textAlign === 'center') prev.style.textAlign = r.style.textAlign = 'center';
        }
      }
      stack.appendChild(r);
    });
    return stack;
  }
  function isTextOnly(n) {
    if (!n) return true;
    if (n.type === 'text') return true;
    if (n.kids) return n.kids.every(function (k) { return isTextOnly(k.n); });
    return false;
  }
  function textLen(n) {
    if (!n) return 0;
    if (n.type === 'text') return n.it.el.textContent.length;
    if (n.type === 'panel') return textLen(n.n);
    if (n.kids) return n.kids.reduce(function (s, k) { return s + textLen(k.n); }, 0);
    return 0;
  }

  function reflowAll() {
    document.querySelectorAll('.cs-mflow').forEach(function (f) { f.parentNode.removeChild(f); });
    var slides = Array.prototype.slice.call(document.querySelectorAll('.cs .cs-slide:not(.cs-minner)'));
    slides.forEach(function (s, i) { s.csIdx = i; s.classList.remove('has-mflow'); s.classList.add('cs-measuring'); });
    // data-m="skip": the slide stays as on desktop (scaled to the column).
    // data-m="custom": the slide is replaced by the hand-written .cs-mcustom block after it.
    slides = slides.filter(function (s) {
      var m = s.getAttribute('data-m');
      if (m === 'custom') s.classList.add('has-mflow');
      return m !== 'skip' && m !== 'custom';
    });
    var runs = [];
    slides.forEach(function (s) {
      var prev = s.previousElementSibling, last = runs[runs.length - 1];
      if (last && prev === last[last.length - 1]) last.push(s); else runs.push([s]);
    });
    var plans = runs.map(function (parts) {
      var M = measure(parts);
      return M && M.items.length ? { s: parts[parts.length - 1], all: parts, M: M, cw: parts[0].getBoundingClientRect().width, t: tree(M.items) } : null;
    });
    slides.forEach(function (s) { s.classList.remove('cs-measuring'); });
    if (DEBUG) {
      var st = document.createElement('style');
      st.textContent = '[data-part]{outline:1px dashed rgba(255,0,0,.5);position:relative}[data-part]::before{content:attr(data-part);position:absolute;left:-14px;top:0;font:10px monospace;color:#f44;z-index:9}';
      document.head.appendChild(st);
    }
    plans.forEach(function (pl) {
      if (!pl) return;
      var out = render(pl.t, pl.cw, pl.s, pl.M);
      if (!out) return;
      var flow = el('div', 'cs-mflow');
      flow.appendChild(out);
      pl.s.parentNode.insertBefore(flow, pl.s.nextSibling);
      pl.all.forEach(function (s) { s.classList.add('has-mflow'); });
    });
  }

  if (window.matchMedia) {
    var mq = window.matchMedia(MOBILE), lastW = 0, pending = null;
    var run = function () {
      if (!mq.matches || !document.querySelector('.cs .cs-slide')) return;
      var w = document.documentElement.clientWidth;
      if (Math.abs(w - lastW) < 30) return;
      lastW = w;
      reflowAll();
    };
    var start = function () {
      (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(run);
      window.addEventListener('resize', function () { clearTimeout(pending); pending = setTimeout(run, 250); });
    };
    if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
  }
})();
