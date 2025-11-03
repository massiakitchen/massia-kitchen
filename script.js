/* ==============================
   script.js - final integrated behavior
   - theme toggle (light/dark) with image swapping
   - preloader + body.loaded
   - gallery filters
   - lightbox
   - scroll reveal
   - header shrink
   - reviews slider (auto)
   - WhatsApp FAB: bubble, badge, sound toggle, periodic pulses
   - periodic pulses & shimmers for buttons/icons/headings
   - branch map show/hide
============================== */

// utility selectors
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from((ctx || document).querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // --- year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- preloader & body loaded
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    if (pre) setTimeout(() => pre.classList.add('hidden'), 700);
    document.body.classList.add('loaded');
  });

  // --- theme: initial restore & swapping images/logos
  const themeToggle = $('#themeToggle');
  const savedTheme = localStorage.getItem('theme') || null;

  // helper: swap images with data-light/data-dark attrs
  function swapImages(mode) {
    $$('img[data-light][data-dark]').forEach(img => {
      const newSrc = mode === 'light' ? img.dataset.light : img.dataset.dark;
      if (newSrc) img.src = newSrc;
    });
    // logos: we have logo-dark (for light mode/visible) and logo-light (for dark mode)
    const logoDark = $('#logoDark'), logoLight = $('#logoLight');
    if (logoDark && logoLight) {
      if (mode === 'light') {
        logoDark.classList.remove('hidden');
        logoLight.classList.add('hidden');
      } else {
        logoLight.classList.remove('hidden');
        logoDark.classList.add('hidden');
      }
    }
  }

  function applyTheme(mode) {
    if (mode === 'light') {
      document.body.classList.add('light');
      if (themeToggle) themeToggle.textContent = '🌙';
    } else {
      document.body.classList.remove('light');
      if (themeToggle) themeToggle.textContent = '☀️';
    }
    swapImages(mode);
  }

  // restore
  if (savedTheme === 'light') applyTheme('light');
  else applyTheme('dark');

  // smooth swap wrapper
  function smoothThemeTransition() {
    document.body.classList.add('transitioning');
    setTimeout(() => document.body.classList.remove('transitioning'), 600);
  }

  // gold flash on logo + button
  function goldFlashEffect() {
    const logo = $('#logoDark') || $('#logoLight');
    const btn = $('#themeToggle');
    [logo, btn].forEach(el => {
      if (!el) return;
      el.classList.add('gold-flash');
      setTimeout(()=>el.classList.remove('gold-flash'), 700);
    });
  }

  // toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      smoothThemeTransition();
      goldFlashEffect();
      const isLight = document.body.classList.toggle('light');
      const mode = isLight ? 'light' : 'dark';
      swapImages(mode);
      localStorage.setItem('theme', mode);
      // ensure logo visibility
      const logoDark = $('#logoDark'), logoLight = $('#logoLight');
      if (logoDark && logoLight) {
        if (mode === 'light') { logoDark.classList.remove('hidden'); logoLight.classList.add('hidden'); }
        else { logoDark.classList.add('hidden'); logoLight.classList.remove('hidden'); }
      }
    });
  }

  // --- Gallery filters
  const filterBtns = $$('.filter-btn');
  const items = $$('.gallery-grid .item');
  filterBtns.forEach(btn=>{
    btn.addEventListener('click', e=>{
      filterBtns.forEach(b=>b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const filter = e.currentTarget.dataset.filter;
      items.forEach(it=>{
        it.style.transition = 'opacity .3s ease, transform .3s ease';
        if (filter === 'all' || it.classList.contains(filter)) {
          it.style.display = '';
          requestAnimationFrame(()=>{ it.style.opacity='1'; it.style.transform='scale(1)'; });
        } else {
          it.style.opacity='0'; it.style.transform='scale(.95)';
          setTimeout(()=> it.style.display='none', 300);
        }
      });
    });
  });

  // --- Lightbox
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  $$('.gallery-grid .card img').forEach(img=>{
    img.style.cursor='zoom-in';
    img.addEventListener('click', e => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = e.currentTarget.src;
      lightbox.classList.add('visible');
      lightbox.setAttribute('aria-hidden','false');
    });
  });
  window.closeLightbox = function(){
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
  };
  const closeBtn = document.querySelector('.close-lightbox');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // --- Scroll reveal (auto add class to main elements if missing)
  const autoReveal = $$('section, .card, footer, .hero');
  autoReveal.forEach(el=>{ if (!el.classList.contains('reveal')) el.classList.add('reveal'); });

  const reveals = $$('.reveal');
  function revealOnScroll(){
    const trigger = window.innerHeight * 0.85;
    reveals.forEach(el=>{
      const rect = el.getBoundingClientRect();
      if (rect.top < trigger) el.classList.add('active'); else el.classList.remove('active');
    });
  }
  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  revealOnScroll();

  // --- header shrink
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });

  // --- Reviews slider (auto)
  const reviews = $$('.reviews-slider .review');
  let revIndex = 0;
  function showReview(i){
    reviews.forEach((r,idx)=> r.classList.toggle('active', idx===i));
  }
  if (reviews.length){
    showReview(revIndex);
    setInterval(()=>{
      revIndex = (revIndex + 1) % reviews.length;
      showReview(revIndex);
    }, 4500);
  }

  // --- Branch map toggle: show/hide map container when "عرض على الخريطة" clicked
  $$('.show-map').forEach(link=>{
    link.addEventListener('click', e=>{
      e.preventDefault();
      const sel = link.dataset.map;
      if (!sel) return;
      const mapEl = document.querySelector(sel);
      if (!mapEl) return;
      // toggle all maps off, then show selected
      $$('.branch-map').forEach(m=>m.style.display='none');
      mapEl.style.display = 'block';
      mapEl.scrollIntoView({behavior:'smooth',block:'center'});
    });
  });

  // --- Contact form handler (opens whatsapp with message)
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

  // --- WhatsApp FAB behavior (hide on scroll down, show on scroll up)
  const whatsappWrapper = document.querySelector('.whatsapp-wrapper');
  const whatsappBtn = document.querySelector('.whatsapp-fab');
  let lastScroll=0;
  if (whatsappWrapper){
    window.addEventListener('scroll', () => {
      const cur = window.pageYOffset;
      if (cur > lastScroll && cur > 200) {
        whatsappWrapper.style.opacity='0'; whatsappWrapper.style.transform='translateY(40px)'; whatsappWrapper.style.pointerEvents='none';
      } else {
        whatsappWrapper.style.opacity='1'; whatsappWrapper.style.transform='translateY(0)'; whatsappWrapper.style.pointerEvents='auto';
      }
      lastScroll = cur;
    });
  }

  // --- WhatsApp bubble with sound (shows once then repeats)
  const bubble = $('#whatsappBubble');
  const badge = document.querySelector('.whatsapp-badge');
  let firstShow = true, hideTimer, reappearTimer;
  const popSound = new Audio('sounds/pop.mp3'); popSound.volume = 0.18;
  function showBubble(){
    if (!bubble) return;
    bubble.classList.add('visible'); badge && badge.classList.add('visible');
    if (firstShow){ popSound.currentTime=0; popSound.play().catch(()=>{}); firstShow=false; }
    hideTimer = setTimeout(()=>{ bubble.classList.remove('visible'); badge && badge.classList.remove('visible'); reappearTimer = setTimeout(showBubble, 60000); }, 10000);
  }
  setTimeout(showBubble, 8000);

  // clicking bubble or whatsapp btn hides bubble permanently (until next long timeout)
  function hideNow(){ if (bubble) bubble.classList.remove('visible'); badge && badge.classList.remove('visible'); clearTimeout(hideTimer); clearTimeout(reappearTimer); }
  whatsappBtn && whatsappBtn.addEventListener('click', hideNow);
  bubble && bubble.addEventListener('click', hideNow);

  // --- sound toggle for whatsapp clicks
  const soundToggle = $('#sound-toggle');
  const clickSound = new Audio('sounds/click.mp3'); clickSound.volume = 0.45;
  let soundEnabled = true;
  if (soundToggle){
    soundToggle.addEventListener('click', ()=>{ soundEnabled = !soundEnabled; soundToggle.textContent = soundEnabled ? '🔊' : '🔇'; soundToggle.classList.toggle('muted', !soundEnabled); });
  }
  if (whatsappBtn){
    whatsappBtn.addEventListener('click', ()=>{ if (soundEnabled){ clickSound.currentTime=0; clickSound.play().catch(()=>{}); } whatsappBtn.classList.remove('pulsing','shimmer'); badge && badge.classList.remove('visible'); });
  }

  // --- Periodic pulses/shimmers (timed, not continuous)
  const primaryButtons = $$('.btn-primary, .cta-header');
  const icons = $$('.whatsapp-fab, .social-icon');
  const headings = $$('.gold-heading');

  // helper to pulse items with temporary class
  function tempClassList(nodes, cls, duration=1000){ nodes.forEach(n=>n.classList.add(cls)); setTimeout(()=>nodes.forEach(n=>n.classList.remove(cls)), duration); }

  // set intervals
  setInterval(()=> tempClassList(primaryButtons,'pulsing',1000), 6000); // buttons every 6s
  setInterval(()=> tempClassList(icons,'shimmer',1200), 8000); // icons every 8s
  setInterval(()=> tempClassList(headings,'goldFlash',1200), 10000); // headings every 10s
  // initial quick trigger
  setTimeout(()=> tempClassList(primaryButtons,'pulsing',900), 1600);
  setTimeout(()=> tempClassList(icons,'shimmer',1000), 2000);

  // extra whatsapp pulse every 60s
  setInterval(()=>{ whatsappBtn && whatsappBtn.classList.add('pulsing'); setTimeout(()=>whatsappBtn && whatsappBtn.classList.remove('pulsing'),1000); }, 60000);

  // --- periodic gold flash on logo & theme button every minute
  function periodicGoldPulse(){
    const logo = $('#logoDark') || $('#logoLight');
    const btn = $('#themeToggle');
    const flash = (el)=>{ if (!el) return; el.classList.add('gold-flash'); setTimeout(()=>el.classList.remove('gold-flash'),700); };
    setTimeout(()=>{ flash(logo); flash(btn); }, 1500);
    setInterval(()=>{ flash(logo); flash(btn); }, 60000);
  }
  periodicGoldPulse();

}); // DOMContentLoaded end
