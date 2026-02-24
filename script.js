/* ===== AEC Webinar — Premium Landing Page JS ===== */
(function () {
  'use strict';

  /* ---------- SESSION DATA ---------- */
  const sessions = [
    {
      date: '2026-02-28',
      startUTC: '2026-02-28T12:30:00Z', // 6 PM IST = 12:30 UTC
      endUTC: '2026-02-28T14:30:00Z',
      title: 'GitHub First Workflow and Portfolio Setup',
      dateLabel: '28 Feb 2026 — Saturday',
    },
    {
      date: '2026-03-07',
      startUTC: '2026-03-07T12:30:00Z',
      endUTC: '2026-03-07T14:30:00Z',
      title: 'Premium Portfolio Design Using AI Assisted Coding',
      dateLabel: '07 Mar 2026 — Saturday',
    },
    {
      date: '2026-03-14',
      startUTC: '2026-03-14T12:30:00Z',
      endUTC: '2026-03-14T14:30:00Z',
      title: '3 Live AI Projects and Integration Into Portfolio',
      dateLabel: '14 Mar 2026 — Saturday',
    },
    {
      date: '2026-03-21',
      startUTC: '2026-03-21T12:30:00Z',
      endUTC: '2026-03-21T14:30:00Z',
      title: 'Vercel Deployment and Trend Level AI Coding Workflow',
      dateLabel: '21 Mar 2026 — Saturday',
    },
  ];

  /* ---------- COUNTDOWN TIMER ---------- */
  function initCountdown() {
    const daysEl = document.getElementById('cd-days');
    const hrsEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');
    const labelEl = document.getElementById('cd-label');
    if (!daysEl) return;

    function getNextSession() {
      const now = new Date();
      for (const s of sessions) {
        if (new Date(s.endUTC) > now) return s;
      }
      return null;
    }

    function update() {
      const next = getNextSession();
      if (!next) {
        labelEl.textContent = 'All sessions completed — Thank you!';
        daysEl.textContent = '0';
        hrsEl.textContent = '0';
        minsEl.textContent = '0';
        secsEl.textContent = '0';
        return;
      }

      labelEl.textContent = 'Next session starts in';
      const diff = new Date(next.startUTC) - new Date();
      if (diff <= 0) {
        labelEl.textContent = 'Session is LIVE now!';
        daysEl.textContent = '0';
        hrsEl.textContent = '0';
        minsEl.textContent = '0';
        secsEl.textContent = '0';
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      daysEl.textContent = d;
      hrsEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent = String(m).padStart(2, '0');
      secsEl.textContent = String(s).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ---------- GOOGLE CALENDAR LINKS ---------- */
  function gcalUrl(s) {
    const fmt = (d) => d.replace(/[-:]/g, '').replace('.000', '');
    const start = fmt(new Date(s.startUTC).toISOString()).split('.')[0] + 'Z';
    const end = fmt(new Date(s.endUTC).toISOString()).split('.')[0] + 'Z';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Code Without Coding — ' + s.title,
      dates: start + '/' + end,
      details: 'Webinar Session: ' + s.title + '\\nSeries: Code Without Coding — Build your AI Research Portfolio in 4 Saturdays\\nSpeaker: Mr. M. Ajith Kumar, AI Research Engineer, GenAI Embed Inc\\n\\nJoining link will be shared via email.',
      location: 'Online Webinar',
    });
    return 'https://calendar.google.com/calendar/render?' + params.toString();
  }

  /* ---------- ICS GENERATION ---------- */
  function generateICS(sessionList) {
    let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//AEC Webinar//Code Without Coding//EN\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n';
    const fmtICS = (iso) => iso.replace(/[-:]/g, '').split('.')[0] + 'Z';

    sessionList.forEach((s, i) => {
      ics += 'BEGIN:VEVENT\r\n';
      ics += 'DTSTART:' + fmtICS(new Date(s.startUTC).toISOString()) + '\r\n';
      ics += 'DTEND:' + fmtICS(new Date(s.endUTC).toISOString()) + '\r\n';
      ics += 'SUMMARY:Code Without Coding — ' + s.title + '\r\n';
      ics += 'DESCRIPTION:Session ' + (i + 1) + ': ' + s.title + '\\nSpeaker: Mr. M. Ajith Kumar\\nJoining link will be shared via email.\r\n';
      ics += 'LOCATION:Online Webinar\r\n';
      ics += 'STATUS:CONFIRMED\r\n';
      ics += 'UID:aec-webinar-session' + (i + 1) + '@arunai.edu\r\n';
      ics += 'END:VEVENT\r\n';
    });

    ics += 'END:VCALENDAR';
    return ics;
  }

  function downloadICS(sessionList, filename) {
    const blob = new Blob([generateICS(sessionList)], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* ---------- INIT CALENDAR BUTTONS ---------- */
  function initCalendarButtons() {
    // Per-session Google Calendar buttons
    document.querySelectorAll('.gcal-btn').forEach((btn) => {
      const idx = parseInt(btn.dataset.session);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(gcalUrl(sessions[idx]), '_blank');
      });
    });

    // Per-session ICS buttons
    document.querySelectorAll('.ics-btn').forEach((btn) => {
      const idx = parseInt(btn.dataset.session);
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadICS([sessions[idx]], 'session-' + (idx + 1) + '.ics');
      });
    });

    // Full series ICS
    const fullICS = document.getElementById('full-series-ics');
    if (fullICS) {
      fullICS.addEventListener('click', (e) => {
        e.preventDefault();
        downloadICS(sessions, 'code-without-coding-full-series.ics');
      });
    }

    // Full series calendar in hero
    const heroCalBtn = document.getElementById('hero-cal-btn');
    if (heroCalBtn) {
      heroCalBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadICS(sessions, 'code-without-coding-full-series.ics');
      });
    }
  }

  /* ---------- MOBILE NAV TOGGLE ---------- */
  function initMobileNav() {
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded);
    });

    // Close on link click
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- SCROLLSPY ---------- */
  function initScrollspy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function onScroll() {
      const scrollY = window.scrollY + 120;
      sections.forEach((sec) => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          navLinks.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector('.nav-links a[href="#' + id + '"]');
          if (active) active.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- SCROLL ANIMATIONS ---------- */
  function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el, i) => {
      el.style.transitionDelay = (i % 3) * 0.12 + 's';
      observer.observe(el);
    });
  }

  /* ---------- ACCORDION (MODULES + FAQ) ---------- */
  function initAccordions() {
    document.querySelectorAll('.module-header, .faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.module-item, .faq-item');
        const content = item.querySelector('.module-content, .faq-answer');
        const isActive = item.classList.contains('active');

        // Close siblings
        const parent = item.parentElement;
        parent.querySelectorAll('.module-item.active, .faq-item.active').forEach((sib) => {
          sib.classList.remove('active');
          const sibContent = sib.querySelector('.module-content, .faq-answer');
          if (sibContent) sibContent.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });

    // Open first module by default
    const firstModule = document.querySelector('.module-item');
    if (firstModule) {
      firstModule.classList.add('active');
      const c = firstModule.querySelector('.module-content');
      if (c) c.style.maxHeight = c.scrollHeight + 'px';
    }
  }

  /* ---------- REGISTRATION FORM ---------- */
  function initForm() {
    const form = document.getElementById('reg-form');
    const successEl = document.getElementById('form-success');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear errors
      form.querySelectorAll('.form-group').forEach((g) => g.classList.remove('error'));

      // Name
      const name = form.querySelector('#reg-name');
      if (!name.value.trim()) {
        name.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Email
      const email = form.querySelector('#reg-email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        valid = false;
      }

      // College
      const college = form.querySelector('#reg-college');
      if (!college.value.trim()) {
        college.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Role
      const role = form.querySelector('#reg-role');
      if (!role.value) {
        role.closest('.form-group').classList.add('error');
        valid = false;
      }

      // Session
      const session = form.querySelector('#reg-session');
      if (!session.value) {
        session.closest('.form-group').classList.add('error');
        valid = false;
      }

      if (valid) {
        form.style.display = 'none';
        successEl.classList.add('show');
      }
    });
  }

  /* ---------- IMAGE FALLBACK ---------- */
  function initImageFallbacks() {
    document.querySelectorAll('img[data-fallback]').forEach((img) => {
      img.addEventListener('error', function () {
        const fallback = this.closest('.img-container');
        if (fallback) {
          this.style.display = 'none';
          const fb = fallback.querySelector('.img-fallback');
          if (fb) fb.style.display = 'flex';
        }
      });
    });
  }

  /* ---------- SMOOTH SCROLL FOR CTA ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          const offset = 80;
          const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- INIT ALL ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initCalendarButtons();
    initMobileNav();
    initScrollspy();
    initScrollAnimations();
    initAccordions();
    initForm();
    initImageFallbacks();
    initSmoothScroll();
  });
})();
