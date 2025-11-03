// ==============================
// Basic interactions + enhancements
// ==============================

// Helper: safe querySelector
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// Run main DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // --- Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Preloader hide on load (also fade-in body)
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) {
      setTimeout(() => pre.classList.add('hidden'), 700);
    }
    // body loaded class for entrance animations
    document.body.classList.add('loaded');
  });

  // --- Gallery filters
  const filterBtns = $$('.filter-btn');
  const items = $$('.gallery-grid .item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const filter = e.currentTarget.getAttribute('data-filter');
      filterGallery(filter);
    });
  });
  function filterGallery(filter) {
    items.forEach(it => {
      it.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (filter === 'all' || it.classList.contains(filter)) {
        it.style.display = 'block';
        requestAnimationFrame(() => { it.style.opacity = '1'; it.style.transform = 'scale(1)'; });
      } else {
        it.style.opacity = '0';
        it.style.transform = 'scale(0.95)';
        setTimeout(() => it.style.display = 'none', 300);
      }
    });
  }

  // --- Lightbox
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  $$('.gallery-grid .card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => openLightbox(e.currentTarget));
  });
  function openLightbox(imgEl) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = imgEl.src;
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden','false');
  }
  window.closeLightbox = function(){
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
  };
  const closeBtn = document.querySelector('.close-lightbox');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // --- Simple contact form handler (opens WhatsApp)
  window.handleForm = function(e){
    e.preventDefault();
    const form = e.target;
    const name = (form.name && form.name.value || '').trim();
    const phone = (form.phone && form.phone.value || '').trim();
    const msg = (form.message && form.message.value.trim()) || 'أود معرفة المزيد عن المطابخ.';
    const message = encodeURIComponent(`مرحبًا، اسمي ${name}، هاتفي: ${phone}. ${msg}`);
    window.open(`https://wa.me/201092497811?text=${message}`, '_blank');
    form.reset();
    alert('تم فتح واتساب لإرسال رسالتك — يمكنك تعديل النص وإرساله.');
    return false;
  };

  // --- Scroll reveal (auto add reveal to sections/cards if not present)
  const autoRevealElements = $$('section, .card, .hero, footer');
  autoRevealElements.forEach(el => { if (!el.classList.contains('reveal')) el.classList.add('reveal'); });

  const reveals = $$('.reveal');
  const revealOnScroll = () => {
    const trigger = window.innerHeight * 0.85;
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) el.classList.add('active');
      else el.classList.remove('active');
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  revealOnScroll();

  // --- Header shrink on scroll
  const header = document.querySelector('header.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });

  // --- WhatsApp FAB behavior: hide on scroll down, show on scroll up
  let lastScroll = 0;
  const whatsappWrapper = document.querySelector('.whatsapp-wrapper');
  const whatsappBtn = document.querySelector('.whatsapp-fab');
  if (whatsappBtn) {
    window.addEventListener('scroll', () => {
      const current = window.pageYOffset;
      if (current > lastScroll && current > 200) {
        whatsappWrapper.style.opacity = '0'; whatsappWrapper.style.transform = 'translateY(40px)'; whatsappWrapper.style.pointerEvents = 'none';
      } else {
        whatsappWrapper.style.opacity = '1'; whatsappWrapper.style.transform = 'translateY(0)'; whatsappWrapper.style.pointerEvents = 'auto';
      }
      lastScroll = current;
    });
  }

  // --- WhatsApp bubble logic with sound on first show, reappear after 60s
  const bubble = $('#whatsappBubble');
  const badge = document.querySelector('.whatsapp-badge');
  const popSound = new Audio('sounds/pop.mp3'); popSound.volume = 0.18;
  let firstShow = true, bubbleTimer, hideTimer, reappearTimer;
  function showBubble() {
    if (!bubble) return;
    bubble.classList.add('visible');
    if (badge) badge.classList.add('visible');
    if (firstShow) {
      popSound.currentTime = 0;
      popSound.play().catch(()=>{});
      firstShow = false;
    }
    hideTimer = setTimeout(()=> {
      bubble.classList.remove('visible');
      if (badge) badge.classList.remove('visible');
      reappearTimer = setTimeout(showBubble, 60000);
    }, 10000);
  }
  bubbleTimer = setTimeout(showBubble, 8000);

  // clicking bubble or whatsapp hides bubble & cancels timers
  const hideNow = () => { if (!bubble) return; bubble.classList.remove('visible'); if (badge) badge.classList.remove('visible'); clearTimeout(bubbleTimer); clearTimeout(hideTimer); clearTimeout(reappearTimer); };
  if (whatsappBtn) whatsappBtn.addEventListener('click', hideNow);
  if (bubble) bubble.addEventListener('click', hideNow);

  // --- Sound toggle for whatsapp click
  const soundToggle = $('#sound-toggle');
  const clickSound = new Audio('sounds/click.mp3'); clickSound.volume = 10;
  let soundEnabled = true;
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
      soundToggle.title = soundEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت';
      soundToggle.classList.toggle('muted', !soundEnabled);
    });
  }
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      if (soundEnabled) { clickSound.currentTime = 0; clickSound.play().catch(()=>{}); }
      // stop periodic pulsing when user interacts
      whatsappBtn.classList.remove('pulsing', 'shimmer');
      if (badge) badge.classList.remove('visible');
    });
  }

  // --- Badge control: show when bubble appears (handled above)
  // --- Periodic pulses & shimmers (timed, using intervals)
  const primaryButtons = $$('.btn-primary, .cta-header');
  const icons = $$('.whatsapp-fab, .social-icon');
  const headings = $$('.gold-heading');

  // Buttons pulse every 6s
  setInterval(() => {
    primaryButtons.forEach(btn => { btn.classList.add('pulsing'); setTimeout(()=>btn.classList.remove('pulsing'), 1000); });
  }, 6000);

  // Icon shimmer every 8s
  setInterval(() => {
    icons.forEach(ic => { ic.classList.add('shimmer'); setTimeout(()=>ic.classList.remove('shimmer'), 1200); });
  }, 8000);

  // Headings gold flash every 10s
  setInterval(() => {
    headings.forEach(h=>{ h.classList.add('goldFlash'); setTimeout(()=>h.classList.remove('goldFlash'), 1200); });
  }, 10000);

  // initial quick effect triggers (small delays)
  setTimeout(()=> { primaryButtons.forEach(b=>b.classList.add('pulsing')); setTimeout(()=>primaryButtons.forEach(b=>b.classList.remove('pulsing')),900); }, 1600);
  setTimeout(()=> { icons.forEach(i=>i.classList.add('shimmer')); setTimeout(()=>icons.forEach(i=>i.classList.remove('shimmer')),1000); }, 2000);

  // --- periodic pulsing for whatsapp (extra) - every 60s create a pulse
  setInterval(()=> { if (whatsappBtn) { whatsappBtn.classList.add('pulsing'); setTimeout(()=>whatsappBtn.classList.remove('pulsing'),1000); } }, 60000);

  // --- Scroll reveal for dynamic adds (already above) - observe for new nodes (optional)
  // --- Theme toggle (dark/light) with localStorage
  const themeToggleBtn = $('#theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); if (themeToggleBtn) themeToggleBtn.textContent = '☀️'; }
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // --- Reveal on load for items already in viewport
  revealOnScroll();

}); // DOMContentLoaded end
