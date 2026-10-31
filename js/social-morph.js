/* The contact links in the bottom-right footer move into the Contact section's row of
   big icons while that section is showing, and slide back when it is left. The move runs
   alongside fullPage's scroll (js/main.js calls socialMorph.toSection from onLeave and
   afterLoad). Where fullPage hands scrolling to the browser (body.fp-responsive: phones,
   touch tablets) nothing moves and the Contact section shows its own icons. */
(function () {
	'use strict';

	var MS = 700; // fullPage's scrollingSpeed
	var active = false;

	function footerItems() {
		return document.querySelectorAll('.page-footer .footer-right .social li');
	}

	function enabled() {
		return !document.body.classList.contains('fp-responsive');
	}

	// Page position of an element from its offsets, ignoring transforms (fullPage moves the
	// sections with one, and the Contact content is still mid fade-in when this runs)
	function offset(el) {
		var x = 0, y = 0;
		for (; el; el = el.offsetParent) { x += el.offsetLeft; y += el.offsetTop; }
		return { x: x, y: y };
	}

	// Where each Contact icon will be on screen once the section has scrolled into place
	function targets() {
		var section = document.querySelector('.section[data-section="contact"]');
		var origin = offset(section), out = {};
		var links = section.querySelectorAll('.social a[data-social]');
		for (var i = 0; i < links.length; i++) {
			var icon = links[i].querySelector('i'), at = offset(icon);
			out[links[i].getAttribute('data-social')] = {
				x: at.x - origin.x + icon.offsetWidth / 2,
				y: at.y - origin.y + icon.offsetHeight / 2,
				size: parseFloat(getComputedStyle(icon).fontSize)
			};
		}
		return out;
	}

	function place(animate) {
		var to = active ? targets() : null;
		var items = footerItems(), was = [], rest = [], i;
		document.body.classList.toggle('social-morphed', active);
		// Resting geometry: measured with the moves taken off for a moment (same frame, so
		// nothing flickers); offsets inside a transformed item are relative to the item itself
		for (i = 0; i < items.length; i++) {
			was.push(items[i].style.transform);
			items[i].style.transition = 'none';
			items[i].style.transform = '';
		}
		for (i = 0; i < items.length; i++) {
			var icon = items[i].querySelector('i'), r = icon.getBoundingClientRect(), l = items[i].getBoundingClientRect();
			rest.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, ox: r.left - l.left + r.width / 2, oy: r.top - l.top + r.height / 2,
				size: parseFloat(getComputedStyle(icon).fontSize) });
		}
		for (i = 0; i < items.length; i++) items[i].style.transform = was[i];
		void document.body.offsetWidth;
		for (i = 0; i < items.length; i++) {
			var li = items[i], t = to && to[li.querySelector('a').getAttribute('data-social')], c = rest[i];
			li.style.transition = animate ? '' : 'none';
			if (!t) { li.style.transform = ''; continue; }
			li.style.transformOrigin = c.ox + 'px ' + c.oy + 'px';
			li.style.transform = 'translate(' + (t.x - c.x) + 'px,' + (t.y - c.y) + 'px) scale(' + (t.size / c.size) + ')';
		}
		if (!animate) {
			void document.body.offsetWidth;
			for (i = 0; i < items.length; i++) items[i].style.transition = '';
		}
	}

	window.socialMorph = {
		toSection: function (anchor, animate) {
			var want = enabled() && anchor === 'contact';
			document.body.classList.toggle('social-morph', enabled());
			if (want === active && !want) return;
			active = want;
			place(animate !== false);
		}
	};

	window.addEventListener('resize', function () {
		document.body.classList.toggle('social-morph', enabled());
		if (active && !enabled()) active = false;
		place(false);
	});
})();
