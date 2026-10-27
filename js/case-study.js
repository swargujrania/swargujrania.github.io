// Case study interactions: scroll reveal, tabs and the hierarchy explorer.
// Content stays readable without this script (see html:not(.cs-js) rules).
(function () {
  document.documentElement.classList.add('cs-js');

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

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
})();
