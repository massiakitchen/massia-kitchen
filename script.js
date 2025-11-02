// script.js — متوافق مع الهامبرغر والفلترة واللايتبوكس
document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Navbar (hamburger) =====
  const menuBtn = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (menuBtn && navMenu) {
    const toggleMenu = () => {
      const open = navMenu.classList.toggle('active');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
    };

    menuBtn.addEventListener('click', toggleMenu);

    // close when clicking a nav link
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });

    // close when clicking outside menu (on small screens)
    document.addEventListener('click', (ev) => {
      if (!navMenu.contains(ev.target) && !menuBtn.contains(ev.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // ===== Gallery filters =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-grid .item');

  // Ensure initial styles
  items.forEach(it => {
    it.style.opacity = '1';
    it.style.transform = 'scale(1)';
    it.style.display = 'block';
  });

  function filterGallery(filter) {
    items.forEach(it => {
      it.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
      if (filter === 'all' || it.classList.contains(filter)) {
        it.style.display = 'block';
        requestAnimationFrame(() => {
          it.style.opacity = '1';
          it.style.transform = 'scale(1)';
        });
      } else {
        it.style.opacity = '0';
        it.style.transform = 'scale(0.97)';
        setTimeout(() => { it.style.display = 'none'; }, 300);
      }
    });
  }

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const filter = e.currentTarget.getAttribute('data-filter') || 'all';
        filterGallery(filter);
      });
    });
  }

  // ===== Lightbox =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.querySelector('.close-lightbox');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.classList.remove('no-scroll');
  }

  // attach click on gallery images
  document.querySelectorAll('.gallery-grid .card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(e.currentTarget.src, e.currentTarget.alt);
    });
  });

  // close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // click outside image closes lightbox
  if (lightbox) {
    lightbox.addEventListener('click', (ev) => {
      // if click on backdrop (not the image) => close
      if (ev.target === lightbox) closeLightbox();
    });
  }

  // escape key to close
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      // close both menu and lightbox if open
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (menuBtn) menuBtn.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
      if (lightbox && lightbox.classList.contains('visible')) {
        closeLightbox();
      }
    }
  });

  // ===== Form handler (unchanged but safe) =====
  window.handleForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name?.value?.trim() || '';
    const phone = form.phone?.value?.trim() || '';
    const message = encodeURIComponent(`مرحبًا، اسمي ${name}، هاتفي: ${phone}. أود معرفة المزيد عن المطابخ.`);
    window.open(`https://wa.me/201092497811?text=${message}`, '_blank');
    form.reset();
    // Use a non-blocking toast in future; alert is simple
    alert('تم فتح واتساب لإرسال رسالتك — يمكنك تعديل النص وإرساله.');
    return false;
  };

  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll('.section, .card');
  const onScroll = () => {
    const trigger = window.innerHeight * 0.85;
    revealEls.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < trigger) {
        el.style.opacity = 1;
        el.style.transform = 'translateY(0)';
        el.style.transition = 'all .6s ease-out';
      } else {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

}); // DOMContentLoaded end
