// ==============================
// Basic interactions for the site
// ==============================
document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Gallery filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-grid .item');

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
        requestAnimationFrame(() => {
          it.style.opacity = '1';
          it.style.transform = 'scale(1)';
        });
      } else {
        it.style.opacity = '0';
        it.style.transform = 'scale(0.95)';
        setTimeout(() => (it.style.display = 'none'), 300);
      }
    });
  }

  // Lightbox for gallery images
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');

  document.querySelectorAll('.gallery-grid .card img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', (e) => {
      openLightbox(e.currentTarget);
    });
  });

  function openLightbox(imgEl) {
    lightboxImg.src = imgEl.src;
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden', 'false');
  }

  window.closeLightbox = function() {
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
  };

  document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);

  // Simple form handler (demo)
  window.handleForm = function(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const msg = form.message.value.trim() || "أود معرفة المزيد عن المطابخ.";

    // Corrected WhatsApp link
    const message = encodeURIComponent(`مرحبًا، اسمي ${name}، هاتفي: ${phone}. ${msg}`);
    window.open(`https://wa.me/201092497811?text=${message}`, '_blank');

    form.reset();
    alert('تم فتح واتساب لإرسال رسالتك — يمكنك تعديل النص وإرساله.');
    return false;
  };

  // Scroll reveal simple
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
  window.addEventListener('scroll', onScroll);
  onScroll();
});
