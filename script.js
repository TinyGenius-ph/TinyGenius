/**
 * TinyGenius – script.js  (Complete + Web3Forms Email)
 */
document.addEventListener('DOMContentLoaded', function() {
  initNavbar();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initActiveNav();
  initGallery();
  initLightbox();
  initContactForm();
  initScrollTop();
  initCtaStars();
  initRipple();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ── Navbar ── */
function initNavbar() {
  var nb = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    nb.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ── Mobile Nav ── */
function initMobileNav() {
  var btn   = document.getElementById('hamburger');
  var links = document.getElementById('navLinks');
  var nb    = document.getElementById('navbar');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    var spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5.5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5.5px)';
    } else {
      spans[0].style.transform = spans[1].style.opacity = spans[2].style.transform = '';
    }
  });
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      links.classList.remove('open');
      btn.querySelectorAll('span').forEach(function(s){ s.style.cssText = ''; });
    });
  });
  document.addEventListener('click', function(e) {
    if (!nb.contains(e.target)) links.classList.remove('open');
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  var els = document.querySelectorAll('[data-reveal],[data-reveal-right]');
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      var siblings = Array.from(e.target.parentElement ? e.target.parentElement.children : [])
        .filter(function(c){ return c.hasAttribute('data-reveal') || c.hasAttribute('data-reveal-right'); });
      var delay = Math.max(0, siblings.indexOf(e.target) * 110);
      setTimeout(function(){ e.target.classList.add('revealed'); }, delay);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function(el){ obs.observe(el); });
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      var id = a.getAttribute('href');
      var el = (id && id !== '#') ? document.querySelector(id) : null;
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    });
  });
}

/* ── Active Nav ── */
function initActiveNav() {
  var secs  = document.querySelectorAll('section[id]');
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  secs.forEach(function(sec) {
    new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          links.forEach(function(a){
            a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-50% 0px -50% 0px' }).observe(sec);
  });
}

/* ── Gallery Filter ── */
function initGallery() {
  var tabs  = document.querySelectorAll('.gtab');
  var items = document.querySelectorAll('.gi');
  tabs.forEach(function(tab) {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var f = tab.getAttribute('data-f');
      items.forEach(function(item){
        item.classList.toggle('hidden', f !== 'all' && item.getAttribute('data-c') !== f);
      });
    });
  });
}

/* ── Lightbox ── */
function initLightbox() {
  var lb       = document.getElementById('lb');
  var backdrop = document.getElementById('lbBackdrop');
  var phone    = document.getElementById('lbPhone');
  var caption  = document.getElementById('lbCaption');
  var closeBtn = document.getElementById('lbClose');
  var prevBtn  = document.getElementById('lbPrev');
  var nextBtn  = document.getElementById('lbNext');
  if (!lb) return;

  var items = [], idx = 0;

  function getVisible() {
    return Array.from(document.querySelectorAll('.gi:not(.hidden) .gi-inner'));
  }

  document.querySelectorAll('.gi-inner').forEach(function(inner) {
    inner.style.cursor = 'pointer';
    inner.addEventListener('click', function() {
      items = getVisible();
      idx = items.indexOf(inner);
      if (idx < 0) idx = 0;
      openLb(items[idx]);
    });
  });

  function openLb(inner) {
    phone.innerHTML = '<div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:80px;height:22px;background:#1A293D;border-radius:0 0 16px 16px;z-index:10"></div>';
    var clone = inner.cloneNode(true);
    clone.style.cssText = 'width:100%;height:100%;border-radius:0;box-shadow:none;';
    clone.querySelectorAll('.gi-ov').forEach(function(o){ o.remove(); });
    phone.appendChild(clone);
    caption.textContent = inner.getAttribute('data-title') || '';
    lb.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function(){ phone.innerHTML = ''; }, 350);
  }

  function nav(dir) {
    items = getVisible();
    idx = (idx + dir + items.length) % items.length;
    openLb(items[idx]);
  }

  closeBtn.addEventListener('click', closeLb);
  backdrop.addEventListener('click', closeLb);
  prevBtn.addEventListener('click', function(){ nav(-1); });
  nextBtn.addEventListener('click', function(){ nav(+1); });

  document.addEventListener('keydown', function(e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft')  nav(-1);
    if (e.key === 'ArrowRight') nav(+1);
  });

  var tx = 0;
  lb.addEventListener('touchstart', function(e){ tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend',   function(e){
    var d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) nav(d > 0 ? 1 : -1);
  }, { passive: true });
}

/* ── Contact Form with Web3Forms ── */
function initContactForm() {
  var form   = document.getElementById('contactForm');
  var notice = document.getElementById('formNotice');
  if (!form) return;

  var ACCESS_KEY = 'b37356fa-37bb-4bb0-8e61-09a969931dcc';

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    notice.className   = 'form-notice';
    notice.textContent = '';

    var name     = document.getElementById('fname').value.trim();
    var email    = document.getElementById('femail').value.trim();
    var interest = document.getElementById('finterest').value;
    var msg      = document.getElementById('fmsg').value.trim();

    if (!name)                                       return showNotice('error', 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))  return showNotice('error', 'Please enter a valid email address.');
    if (msg.length < 10)                             return showNotice('error', 'Message must be at least 10 characters.');

    var btn = form.querySelector('[type="submit"]');
    var orig = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    var payload = JSON.stringify({
      access_key: ACCESS_KEY,
      name:       name,
      email:      email,
      subject:    'New TinyGenius Inquiry from ' + name,
      message:    'Name: ' + name + '\nEmail: ' + email + '\nInterested in: ' + (interest || 'Not specified') + '\n\nMessage:\n' + msg
    });

    fetch('https://api.web3forms.com/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body:    payload
    })
    .then(function(res) { return res.json(); })
    .then(function(data) {
      console.log('Web3Forms:', data);
      if (data.success) {
        showNotice('success', 'Message sent! We will get back to you soon. Thank you!');
        form.reset();
      } else {
        showNotice('error', 'Error: ' + (data.message || 'Please try again or email tinygeniusph@gmail.com'));
      }
    })
    .catch(function(err) {
      console.error('Error:', err);
      showNotice('error', 'Network error. Please email us directly at tinygeniusph@gmail.com');
    })
    .finally(function() {
      btn.textContent = orig;
      btn.disabled = false;
    });
  });

  function showNotice(type, txt) {
    notice.className   = 'form-notice ' + type;
    notice.textContent = txt;
    notice.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

/* ── Scroll to Top ── */
function initScrollTop() {
  var btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', function(){
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── CTA Stars ── */
function initCtaStars() {
  var c = document.getElementById('ctaStars');
  if (!c) return;
  var emojis = ['⭐','🌟','✨','💫'];
  for (var i = 0; i < 20; i++) {
    var el = document.createElement('div');
    el.className = 'star-pt';
    el.textContent = emojis[i % emojis.length];
    el.style.cssText = 'left:' + (Math.random()*96+2) + '%;top:' + (Math.random()*90+5) + '%;font-size:' + (12+Math.random()*16) + 'px;animation-duration:' + (2+Math.random()*3) + 's;animation-delay:' + (Math.random()*4) + 's';
    c.appendChild(el);
  }
}

/* ── Button Ripple ── */
function initRipple() {
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('.btn');
    if (!btn) return;
    var r = btn.getBoundingClientRect();
    var size = Math.max(r.width, r.height);
    var el = document.createElement('span');
    el.style.position    = 'absolute';
    el.style.borderRadius= '50%';
    el.style.width       = size + 'px';
    el.style.height      = size + 'px';
    el.style.left        = (e.clientX - r.left - size/2) + 'px';
    el.style.top         = (e.clientY - r.top  - size/2) + 'px';
    el.style.background  = 'rgba(255,255,255,.25)';
    el.style.transform   = 'scale(0)';
    el.style.animation   = '_rpl .55s linear';
    el.style.pointerEvents = 'none';
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(el);
    el.addEventListener('animationend', function(){ el.remove(); });
  });
  if (!document.getElementById('_rpl_s')) {
    var s = document.createElement('style');
    s.id = '_rpl_s';
    s.textContent = '@keyframes _rpl{to{transform:scale(3.5);opacity:0}}';
    document.head.appendChild(s);
  }
}
