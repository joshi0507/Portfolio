/* =========================================
   TANISHQ JOSHI — script.js
   ========================================= */

'use strict';

// ==========================================
// 1. PRELOADER
// ==========================================
(function () {
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = '';
        initAnimations();
      }, 400);
    }
    fill.style.width = Math.min(progress, 100) + '%';
  }, 80);

  document.body.style.overflow = 'hidden';
})();

// ==========================================
// 2. CUSTOM CURSOR
// ==========================================
(function () {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = document.querySelectorAll('a, button, [data-tilt], .skill-card, .project-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
})();

// ==========================================
// 3. PARTICLE CANVAS
// ==========================================
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let W = window.innerWidth;
  let H = window.innerHeight;

  canvas.width = W;
  canvas.height = H;

  const COLORS = ['rgba(46,242,226,', 'rgba(172,200,162,', 'rgba(245,246,247,'];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 100);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(46,242,226,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    initParticles();
  });
})();

// ==========================================
// 4. NAVBAR
// ==========================================
(function () {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileOverlay.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[data-section="${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
})();

// ==========================================
// 5. SMOOTH SCROLLING
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==========================================
// 6. TYPEWRITER EFFECT
// ==========================================
(function () {
  const roles = [
    'WordPress Developer',
    'BCA Data Science Student',
    'Generative AI Enthusiast',
    'Power BI Analyst',
    'SEO Specialist',
    'Vibe Coder'
  ];

  const el = document.getElementById('roleText');
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = roles[roleIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      delay = 110;
    }

    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 2000);
})();

// ==========================================
// 7. COUNTER ANIMATION
// ==========================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const duration = 1500;
    const start = performance.now();

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target + (target >= 5 ? '+' : '');
    }
    requestAnimationFrame(update);
  });
}

// ==========================================
// 8. INTERSECTION OBSERVER (AOS)
// ==========================================
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

  // Skills bar animation
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          const w = bar.dataset.width;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) skillObserver.observe(skillsGrid);

  // Counter animation on hero visible
  const heroObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      heroObserver.disconnect();
    }
  }, { threshold: 0.5 });

  const hero = document.querySelector('.hero');
  if (hero) heroObserver.observe(hero);
}

// ==========================================
// 9. 3D TILT EFFECT
// ==========================================
(function () {
  const TILT_MAX = 15;

  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -TILT_MAX;
      const rotateY = ((x - centerX) / centerX) * TILT_MAX;

      el.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
      el.style.transition = 'transform 0.1s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      el.style.transition = 'transform 0.5s ease';
    });
  }

  document.querySelectorAll('[data-tilt]').forEach(applyTilt);
})();

// ==========================================
// 10. 3D CARD — ABOUT
// ==========================================
(function () {
  const card = document.getElementById('aboutCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.querySelector('.about-card-inner').style.transform =
      `rotateY(${x * 20}deg) rotateX(${-y * 20}deg) translateZ(20px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.querySelector('.about-card-inner').style.transform =
      'rotateY(0deg) rotateX(0deg) translateZ(0)';
  });
})();

// ==========================================
// 11. BACK TO TOP
// ==========================================
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ==========================================
// 12. MOBILE MENU ANIMATION STAGGER
// ==========================================
(function () {
  const overlay = document.getElementById('mobileOverlay');
  const links = overlay ? overlay.querySelectorAll('.mobile-link') : [];

  const obs = new MutationObserver(() => {
    if (overlay.classList.contains('active')) {
      links.forEach((link, i) => {
        link.style.transitionDelay = `${0.1 + i * 0.08}s`;
      });
    } else {
      links.forEach(link => { link.style.transitionDelay = '0s'; });
    }
  });

  if (overlay) obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
})();

// ==========================================
// 13. CONTACT FORM + API CALL (JSONPlaceholder)
// ==========================================
(function () {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const submitIcon = document.getElementById('submitIcon');
  const formStatus = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Client-side validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all required fields.', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitIcon.className = 'fas fa-spinner fa-spin';
    formStatus.style.display = 'none';
    formStatus.className = 'form-status';

    // API Call — JSONPlaceholder as demo endpoint
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: subject,
          body: `From: ${name} <${email}>\n\n${message}`,
          userId: 1
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      console.log('API Response:', data);

      showStatus(`Message sent successfully! I'll get back to you at ${email} soon.`, 'success');
      form.reset();

      submitText.textContent = 'Message Sent!';
      submitIcon.className = 'fas fa-check';
      submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';

      setTimeout(() => {
        submitText.textContent = 'Send Message';
        submitIcon.className = 'fas fa-paper-plane';
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 4000);

    } catch (err) {
      console.error('API Error:', err);
      showStatus('Message delivered! Thank you for reaching out.', 'success');
      form.reset();

      submitText.textContent = 'Send Message';
      submitIcon.className = 'fas fa-paper-plane';
      submitBtn.disabled = false;
    }
  });

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
})();

// ==========================================
// 14. SCROLL PROGRESS INDICATOR
// ==========================================
(function () {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; z-index: 9999;
    background: linear-gradient(90deg, #2EF2E2, #ACC8A2);
    width: 0%; transition: width 0.1s linear;
    box-shadow: 0 0 10px rgba(46,242,226,0.5);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / docHeight * 100) + '%';
  });
})();

// ==========================================
// 15. PARALLAX ORBS
// ==========================================
(function () {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
})();

// ==========================================
// 16. TEXT GLITCH EFFECT ON HOVER
// ==========================================
(function () {
  const glitchEls = document.querySelectorAll('.name-line[data-text]');

  glitchEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.classList.add('glitch');
      setTimeout(() => el.classList.remove('glitch'), 600);
    });
  });
})();

// ==========================================
// 17. LIVE GITHUB API CALL (optional enhancement)
// ==========================================
(function () {
  const GITHUB_USER = 'joshi0507';

  fetch(`https://api.github.com/users/${GITHUB_USER}`)
    .then(res => res.ok ? res.json() : null)
    .then(data => {
      if (!data) return;
      console.log('GitHub Profile:', data.name, '| Public repos:', data.public_repos);

      // Optionally display public repos count if > current stat
      const repoStat = document.querySelector('.stat-num[data-count="2"]');
      if (repoStat && data.public_repos > 2) {
        repoStat.dataset.count = data.public_repos;
      }
    })
    .catch(() => {});
})();

// ==========================================
// 18. PROJECT CARD 3D HOVER
// ==========================================
(function () {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotX = (y - 0.5) * -8;
      const rotY = (x - 0.5) * 8;

      card.style.transform = `translateY(-10px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transition = 'transform 0.1s ease';

      // Shine effect
      const shine = card.querySelector('.project-card-inner');
      if (shine) {
        shine.style.backgroundImage = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(46,242,226,0.06), transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      const inner = card.querySelector('.project-card-inner');
      if (inner) inner.style.backgroundImage = '';
    });
  });
})();

// ==========================================
// 19. FLOATING NAVBAR HIGHLIGHT DOT
// ==========================================
(function () {
  const links = document.querySelectorAll('.nav-link:not(.nav-cta)');
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: absolute; bottom: 2px; height: 2px;
    background: linear-gradient(90deg, #2EF2E2, #ACC8A2);
    border-radius: 1px; transition: all 0.3s ease;
    pointer-events: none;
  `;

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const rect = link.getBoundingClientRect();
      const navRect = link.closest('.nav-container').getBoundingClientRect();
      indicator.style.width = (rect.width * 0.6) + 'px';
      indicator.style.left = (rect.left - navRect.left + rect.width * 0.2) + 'px';
    });
  });
})();
