/* =====================================================================
   Shift Bord – Client-side JavaScript
   ===================================================================== */

/* ── 1. Mobile menu toggle ──────────────────────────────────────────── */
const menuBtn  = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    // Toggle icon
    const icon = menuBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      const icon = menuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }
  });
}

/* ── 2. Active nav link on scroll ───────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[data-path], #mobile-menu a[data-path]');

function setActiveNav() {
  let current = '';
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-path') === current);
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();

/* ── 3. FAQ accordion ───────────────────────────────────────────────── */
document.querySelectorAll('.faq-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon    = btn.querySelector('.material-symbols-outlined');
    const isOpen  = content.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-content').forEach((c) => c.classList.remove('open'));
    document.querySelectorAll('.faq-toggle .material-symbols-outlined').forEach((i) => {
      i.style.transform = '';
    });

    // Open clicked if it was closed
    if (!isOpen) {
      content.classList.add('open');
      if (icon) icon.style.transform = 'rotate(180deg)';
    }
  });
});

/* ── 4. Contact form – fetch API ─────────────────────────────────────── */
const form          = document.getElementById('consultation-form');
const successBanner = document.getElementById('form-success-banner');
const errorBanner   = document.getElementById('form-error-banner');
const submitBtn     = document.getElementById('submit-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide previous feedback
    successBanner?.classList.add('hidden');
    errorBanner?.classList.add('hidden');

    // Disable button while loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    const payload = {
      name:    form.name.value.trim(),
      company: form.company?.value.trim() || '',
      email:   form.email.value.trim(),
      phone:   form.phone.value.trim(),
      service: form.service?.value || '',
      budget:  form.budget?.value || '',
      details: form.details.value.trim(),
    };

    try {
      const res  = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        successBanner?.classList.remove('hidden');
        form.reset();
      } else {
        if (errorBanner) {
          errorBanner.querySelector('span:last-child').textContent =
            data.message || 'Something went wrong. Please try again.';
          errorBanner.classList.remove('hidden');
        }
      }
    } catch (err) {
      if (errorBanner) {
        errorBanner.querySelector('span:last-child').textContent =
          'Network error. Please check your connection and try again.';
        errorBanner.classList.remove('hidden');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<span>Request a Consultation</span>' +
          '<span class="material-symbols-outlined text-[18px]">send</span>';
      }
    }
  });
}

/* ── 5. Back-to-top button ──────────────────────────────────────────── */
const backToTop = document.getElementById('back-to-top');

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── 6. Telemetry clock (hero) ──────────────────────────────────────── */
const clockEl = document.getElementById('telemetry-clock');
if (clockEl) {
  function updateClock() {
    const now = new Date();
    clockEl.textContent =
      now.toUTCString().split(' ')[4] + ' UTC';
  }
  updateClock();
  setInterval(updateClock, 1000);
}

/* ── 7. Animate sections on enter (IntersectionObserver) ────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08 }
);

document.querySelectorAll('section').forEach((sec) => observer.observe(sec));
