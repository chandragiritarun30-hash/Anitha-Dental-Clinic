/* ================= NAVBAR ================= */

// Sticky shadow
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile menu toggle
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');

  hamburgerBtn.classList.toggle('active');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);

  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu when clicking links
document.querySelectorAll('#mobileMenu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close on resize
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    mobileMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    document.body.style.overflow = '';
  }
});


/* ================= COUNT-UP (WHO SECTION) ================= */

const statsSection = document.getElementById('whoStats');
let statsDone = false;

function runCountUp() {
  if (!statsSection || statsDone) return;

  const rect = statsSection.getBoundingClientRect();

  // Trigger when section enters screen
  if (rect.top > window.innerHeight - 100) return;

  statsDone = true;

  statsSection.querySelectorAll('.stat-item').forEach((item, i) => {
    const target = parseInt(item.dataset.target, 10);
    const display = item.querySelector('.count-val');

    let startTime = null;

    setTimeout(() => {
      function tick(now) {
        if (!startTime) startTime = now;

        const progress = Math.min((now - startTime) / 1800, 1);
        display.textContent = Math.floor(progress * target).toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          display.textContent = target.toLocaleString();
        }
      }

      requestAnimationFrame(tick);
    }, i * 150);
  });

  window.removeEventListener('scroll', runCountUp);
}

window.addEventListener('scroll', runCountUp);
window.addEventListener('load', runCountUp);

  /* ── Testimonials slider ── */
  var track = document.getElementById('testiTrack');
  var btnPrev = document.getElementById('testiPrev');
  var btnNext = document.getElementById('testiNext');

  if (track && btnPrev && btnNext) {
    var cards = track.querySelectorAll('.testi-card');
    var totalCards = cards.length;
    var currentIdx = 0;
    var visibleCount = getVisibleCount();

    function getVisibleCount() {
      if (window.innerWidth <= 600) return 1;
      if (window.innerWidth <= 900) return 2;
      return 3;
    }

    function getCardWidth() {
      if (cards.length === 0) return 0;
      var card = cards[0];
      var style = window.getComputedStyle(track);
      var gap = parseFloat(style.gap) || 20;
      return card.offsetWidth + gap;
    }

    function slideTo(idx) {
      var maxIdx = totalCards - visibleCount;
      currentIdx = Math.max(0, Math.min(idx, maxIdx));
      var offset = currentIdx * getCardWidth();
      track.style.transform = 'translateX(-' + offset + 'px)';
    }

    btnNext.addEventListener('click', function () {
      slideTo(currentIdx + 1);
    });

    btnPrev.addEventListener('click', function () {
      slideTo(currentIdx - 1);
    });

    // Recalculate on resize
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        visibleCount = getVisibleCount();
        slideTo(currentIdx);
      }, 150);
    });

    // Touch / swipe support
    var touchStartX = 0;
    var touchEndX = 0;

    track.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) {
          slideTo(currentIdx + 1);
        } else {
          slideTo(currentIdx - 1);
        }
      }
    }, { passive: true });
  }

  /* ── Scroll reveal animation ── */
  var revealEls = document.querySelectorAll(
    '.service-card, .insight-card, .testi-card, .save-img-top, .save-img-bottom, .consult-img-main, .consult-img-small, .green-img-item'
  );

  function revealOnScroll() {
    var windowH = window.innerHeight;
    revealEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < windowH - 60) {
        el.classList.add('revealed');
      }
    });
  }

  // Add base styles programmatically for reveal
  var style = document.createElement('style');
  style.textContent =
    '.service-card, .insight-card, .testi-card, ' +
    '.save-img-top, .save-img-bottom, .consult-img-main, ' +
    '.consult-img-small, .green-img-item {' +
    '  opacity: 0;' +
    '  transform: translateY(24px);' +
    '  transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1);' +
    '}' +
    '.service-card.revealed, .insight-card.revealed, .testi-card.revealed, ' +
    '.save-img-top.revealed, .save-img-bottom.revealed, .consult-img-main.revealed, ' +
    '.consult-img-small.revealed, .green-img-item.revealed {' +
    '  opacity: 1;' +
    '  transform: translateY(0);' +
    '}';
  document.head.appendChild(style);

  // Stagger children
  document.querySelectorAll('.services-grid .service-card').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.08) + 's';
  });
  document.querySelectorAll('.insights-grid .insight-card').forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.1) + 's';
  });

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll(); // trigger on load for elements in view

  (function () {

    var track = document.getElementById('testimonialsTrack');
    var dots = document.getElementById('testimonialsDots');
    var gap = 24;
    var current = 0;
    var auto, busy = false;

    if (!track) return;

    var origCards = Array.prototype.slice.call(track.children);
    var total = origCards.length;

    function visible() {
      return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3;
    }

    function step() {
      return origCards[0].offsetWidth + gap;
    }

    function setup() {
      // remove old clones
      track.querySelectorAll('.clone').forEach(function (c) { c.remove(); });

      // set card widths
      var w = (track.parentElement.offsetWidth - gap * (visible() - 1)) / visible();
      track.querySelectorAll('.testimonial-card').forEach(function (c) { c.style.width = w + 'px'; });

      // clone last v → prepend, first v → append
      var v = visible();
      for (var i = total - 1; i >= total - v; i--) {
        var c = origCards[i].cloneNode(true);
        c.classList.add('clone');
        track.insertBefore(c, track.firstChild);
      }
      for (var j = 0; j < v; j++) {
        var c2 = origCards[j].cloneNode(true);
        c2.classList.add('clone');
        track.appendChild(c2);
      }

      // build dots
      dots.innerHTML = '';
      for (var k = 0; k < total; k++) {
        var d = document.createElement('button');
        d.className = 'testimonials-dot' + (k === 0 ? ' active' : '');
        (function (idx) { d.onclick = function () { go(idx); reset(); }; })(k);
        dots.appendChild(d);
      }

      jump(0);
    }

    function jump(idx) {
      track.style.transition = 'none';
      track.style.transform = 'translateX(-' + ((idx + visible()) * step()) + 'px)';
      current = idx;
    }

    function go(idx) {
      if (busy) return;
      busy = true;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
      track.style.transform = 'translateX(-' + ((idx + visible()) * step()) + 'px)';
      current = idx;

      // update dots
      var realIdx = ((idx % total) + total) % total;
      dots.querySelectorAll('.testimonials-dot').forEach(function (d, i) {
        d.classList.toggle('active', i === realIdx);
      });

      setTimeout(function () {
        if (current < 0) jump(total - 1);
        else if (current >= total) jump(0);
        busy = false;
      }, 510);
    }

    function reset() { clearInterval(auto); auto = setInterval(function () { go(current + 1); }, 3500); }

    document.getElementById('testimonialsPrev').onclick = function () { go(current - 1); reset(); };
    document.getElementById('testimonialsNext').onclick = function () { go(current + 1); reset(); };

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    });

    setup();
    reset();

  }());

  /* ── Footer email submit ── */
  var footerBtn = document.querySelector('.footer-email button');
  var footerInput = document.querySelector('.footer-email input');

  if (footerBtn && footerInput) {
    footerBtn.addEventListener('click', function () {
      var val = footerInput.value.trim();
      if (val && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        footerBtn.textContent = '✓';
        footerInput.value = '';
        setTimeout(function () { footerBtn.textContent = '→'; }, 2000);
      } else {
        footerInput.style.borderColor = 'rgba(255,80,80,0.6)';
        setTimeout(function () { footerInput.style.borderColor = ''; }, 1500);
      }
    });

    footerInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') footerBtn.click();
    });
  }

  /* ── Smooth scrolling for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


