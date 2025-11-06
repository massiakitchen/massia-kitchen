// Enhanced Accessibility Functions
const a11y = {
  // Focus management for modals
  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  },

  // Announce changes to screen readers
  announce: function(message, priority = 'polite') {
    const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;
  }
};

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(announcer);
  return announcer;
}


// Enhanced performance functions
const perf = {
  lastScroll: 0,
  scrollTimeout: null,
  resizeTimeout: null,
  scrollHandlers: []
};

// Debounce function for performance
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Optimized scroll handler
function addOptimizedScrollListener(handler) {
  const optimizedHandler = throttle(handler, 16);
  perf.scrollHandlers.push(optimizedHandler);
  window.addEventListener('scroll', optimizedHandler);
}


// ==============================
// Enhanced Website Functionality with Performance Improvements
// ==============================

// Helper: safe querySelector with error handling
const $ = (sel, ctx = document) => {
  try {
    return ctx.querySelector(sel);
  } catch (error) {
    console.warn('Query selector error:', error);
    return null;
  }
};

const $$ = (sel, ctx = document) => {
  try {
    return Array.from(ctx.querySelectorAll(sel));
  } catch (error) {
    console.warn('Query selector all error:', error);
    return [];
  }
};

// Performance optimizations
const perf = {
  lastScroll: 0,
  scrollTimeout: null,
  resizeTimeout: null
};

// App state management
const appState = {
  soundEnabled: true,
  theme: localStorage.getItem('theme') || 'dark',
  currentReview: 0,
  reviewInterval: null,
  pageLoadTime: Date.now(),
  calculatorData: {
    area: 12,
    material: 'standard',
    drawers: 12,
    addons: [],
    appliances: [],
    length: 4,
    width: 3,
    wallCabinets: 4,
    baseCabinets: 6
  }
};

// Timer management
const timers = {
  reviewInterval: null,
  logoPulse: null,
  headingGlow: null,
  countdown: null
};

// Price configurations - تم التحديث حسب متطلباتك
const PRICE_CONFIG = {
  base: {
    economy: 3000,  // MDF
    standard: 4000, // ألومنيوم
    premium: 5800   // HPL
  },
  drawer: {
    economy: 150,
    standard: 200,
    premium: 250
  },
  addon: {
    counter: 500,  // كونتر جوود وود لكل متر
    led: 200,      // إضاءة LED لكل متر
    handles: 100,  // مقابض بلت إن
    drawers: 300   // أدراج سحاب
  },
  appliance: {
    oven: 3000,
    cooktop: 1500,
    hood: 1200,
    fridge: 8000
  },
  installation: 2000,
  cabinet: {
    wall: 800,
    base: 1200
  }
};

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Ripple effect for buttons
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

// Format number to Arabic format
function formatNumber(number) {
  return new Intl.NumberFormat('ar-EG').format(number);
}

// Cost Calculator Functions - تم التحديث
function updateCalculator() {
  const area = appState.calculatorData.area;
  const material = appState.calculatorData.material;
  const drawers = appState.calculatorData.drawers;
  const addons = appState.calculatorData.addons;
  const appliances = appState.calculatorData.appliances;
  
  // Calculate base cost
  const baseCost = PRICE_CONFIG.base[material] * area;
  
  // Calculate drawers cost
  const drawersCost = PRICE_CONFIG.drawer[material] * drawers;
  
  // Calculate addons cost (تضاف لكل متر)
  const addonsCost = addons.reduce((total, addon) => {
    return total + (PRICE_CONFIG.addon[addon] * area);
  }, 0);
  
  // Calculate appliances cost
  const appliancesCost = appliances.reduce((total, appliance) => {
    return total + (PRICE_CONFIG.appliance[appliance] || 0);
  }, 0);
  
  // Total manufacturing cost
  const manufacturingCost = baseCost + drawersCost;
  
  // Material cost (40% of manufacturing)
  const materialCost = Math.round(manufacturingCost * 0.4);
  
  // Total cost
  const totalCost = manufacturingCost + addonsCost + appliancesCost + PRICE_CONFIG.installation;
  
  // Update UI
  updateCalculatorUI(totalCost, manufacturingCost, materialCost, PRICE_CONFIG.installation, addonsCost);
}

function updateCalculatorByDimensions() {
  const length = appState.calculatorData.length;
  const width = appState.calculatorData.width;
  const material = appState.calculatorData.material;
  const wallCabinets = appState.calculatorData.wallCabinets;
  const baseCabinets = appState.calculatorData.baseCabinets;
  const addons = appState.calculatorData.addons;
  
  // Calculate area
  const area = length * width;
  
  // Calculate base cost
  const baseCost = PRICE_CONFIG.base[material] * area;
  
  // Calculate cabinets cost
  const wallCabinetsCost = PRICE_CONFIG.cabinet.wall * wallCabinets;
  const baseCabinetsCost = PRICE_CONFIG.cabinet.base * baseCabinets;
  const cabinetsCost = wallCabinetsCost + baseCabinetsCost;
  
  // Calculate addons cost (تضاف لكل متر)
  const addonsCost = addons.reduce((total, addon) => {
    return total + (PRICE_CONFIG.addon[addon] * area);
  }, 0);
  
  // Total manufacturing cost
  const manufacturingCost = baseCost + cabinetsCost;
  
  // Material cost (40% of manufacturing)
  const materialCost = Math.round(manufacturingCost * 0.4);
  
  // Total cost
  const totalCost = manufacturingCost + addonsCost + PRICE_CONFIG.installation;
  
  // Update UI
  updateCalculatorUI(totalCost, manufacturingCost, materialCost, PRICE_CONFIG.installation, addonsCost);
}

function updateCalculatorUI(total, manufacturing, material, installation, addons = 0) {
  const estimatedCost = $('#estimated-cost');
  const manufacturingCost = $('#manufacturing-cost');
  const materialCost = $('#material-cost');
  const installationCost = $('#installation-cost');
  const addonsCost = $('#addons-cost');
  
  if (estimatedCost) estimatedCost.textContent = `${formatNumber(total)} جنيه`;
  if (manufacturingCost) manufacturingCost.textContent = `${formatNumber(manufacturing)} ج`;
  if (materialCost) materialCost.textContent = `${formatNumber(material)} ج`;
  if (installationCost) installationCost.textContent = `${formatNumber(installation)} ج`;
  if (addonsCost) addonsCost.textContent = `${formatNumber(addons)} ج`;
}

function updateRecommendation() {
  const area = parseInt(document.getElementById('kitchen-area').value);
  const material = document.getElementById('material-type').value;
  
  let recommendedMaterial = 'شيت ألومنيوم';
  let reason = 'مثالي للمساحات المتوسطة، يجمع بين المتانة والسعر المعقول';
  
  if (area > 20) {
    recommendedMaterial = 'HPL';
    reason = 'مثالي للمساحات الكبيرة، متانة عالية وتنظيف سهل - الأكثر مبيعاً';
  } else if (area < 10) {
    recommendedMaterial = 'كلادينج';
    reason = 'مثالي للمساحات الصغيرة، مقاوم للرطوبة وسهل الصيانة';
  }
  
  if (material === 'premium') {
    recommendedMaterial = 'بولي باك جوود وود';
    reason = 'أعلى مستوى جودة مع مظهر خشب طبيعي فاخر';
  }
  
  document.getElementById('recommended-material').textContent = recommendedMaterial;
  document.getElementById('recommendation-reason').textContent = reason;
}

function initCalculator() {
  const areaSlider = $('#kitchen-area');
  const areaValue = $('#area-value');
  const materialSelect = $('#material-type');
  const drawersSlider = $('#drawers-count');
  const drawersValue = $('#drawers-value');
  const addonCheckboxes = $$('input[name="addons"]');
  const applianceCheckboxes = $$('input[name="appliances"]');
  
  // Dimension inputs
  const lengthInput = $('#kitchen-length');
  const widthInput = $('#kitchen-width');
  const wallCabinetsSlider = $('#wall-cabinets');
  const wallCabinetsValue = $('#wall-cabinets-value');
  const baseCabinetsSlider = $('#base-cabinets');
  const baseCabinetsValue = $('#base-cabinets-value');
  const addonDimensionsCheckboxes = $$('input[name="addons-dimensions"]');
  
  // Area slider
  if (areaSlider && areaValue) {
    areaSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      appState.calculatorData.area = parseInt(value);
      areaValue.textContent = `${value} م²`;
      updateCalculator();
      updateRecommendation();
    });
  }
  
  // Material select
  if (materialSelect) {
    materialSelect.addEventListener('change', (e) => {
      appState.calculatorData.material = e.target.value;
      updateCalculator();
      updateRecommendation();
    });
  }
  
  // Drawers slider
  if (drawersSlider && drawersValue) {
    drawersSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      appState.calculatorData.drawers = parseInt(value);
      drawersValue.textContent = `${value} قطعة`;
      updateCalculator();
    });
  }
  
  // Addon checkboxes (تضاف لكل متر)
  addonCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        appState.calculatorData.addons.push(value);
      } else {
        appState.calculatorData.addons = appState.calculatorData.addons.filter(addon => addon !== value);
      }
      updateCalculator();
    });
  });
  
  // Appliance checkboxes
  applianceCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        appState.calculatorData.appliances.push(value);
      } else {
        appState.calculatorData.appliances = appState.calculatorData.appliances.filter(app => app !== value);
      }
      updateCalculator();
    });
  });
  
  // Dimension inputs
  if (lengthInput) {
    lengthInput.addEventListener('input', (e) => {
      appState.calculatorData.length = parseFloat(e.target.value);
      updateCalculatorByDimensions();
    });
  }
  
  if (widthInput) {
    widthInput.addEventListener('input', (e) => {
      appState.calculatorData.width = parseFloat(e.target.value);
      updateCalculatorByDimensions();
    });
  }
  
  if (wallCabinetsSlider && wallCabinetsValue) {
    wallCabinetsSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      appState.calculatorData.wallCabinets = parseInt(value);
      wallCabinetsValue.textContent = `${value} وحدة`;
      updateCalculatorByDimensions();
    });
  }
  
  if (baseCabinetsSlider && baseCabinetsValue) {
    baseCabinetsSlider.addEventListener('input', (e) => {
      const value = e.target.value;
      appState.calculatorData.baseCabinets = parseInt(value);
      baseCabinetsValue.textContent = `${value} وحدة`;
      updateCalculatorByDimensions();
    });
  }
  
  // Addon checkboxes for dimensions
  addonDimensionsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      const value = e.target.value;
      if (e.target.checked) {
        appState.calculatorData.addons.push(value);
      } else {
        appState.calculatorData.addons = appState.calculatorData.addons.filter(addon => addon !== value);
      }
      updateCalculatorByDimensions();
    });
  });
  
  // Initial calculation
  updateCalculator();
  updateRecommendation();
}

// Request detailed quote
function requestDetailedQuote() {
  const formData = appState.calculatorData;
  const message = `أرغب في الحصول على عرض سعر دقيق للمطبخ:\nالمساحة: ${formData.area} م²\nنوع الخامات: ${formData.material}\nعدد الأدراج: ${formData.drawers}\nالإضافات: ${formData.addons.join('، ')}\nالأجهزة: ${formData.appliances.join('، ')}`;
  
  const whatsappUrl = `https://wa.me/201092497811?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  
  trackEvent('calculator', 'quote_request', formData.material);
}

// Gallery filtering function
function filterGallery(filter) {
  const items = $$('.gallery-grid .item');
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
      setTimeout(() => it.style.display = 'none', 300);
    }
  });
}

// Analytics tracking function
function trackEvent(category, action, label) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label
    });
  }
  
  // Custom tracking
  console.log(`Event: ${category} - ${action} - ${label}`);
}

// Initialize components dynamically
function initComponent(element) {
  // Add ripple effect to buttons
  if (element.classList && (element.classList.contains('btn') || element.classList.contains('btn-primary') || element.classList.contains('btn-ghost'))) {
    element.addEventListener('click', createRipple);
  }
  
  // Initialize reveal elements
  if (element.classList && element.classList.contains('reveal')) {
    revealObserver.observe(element);
  }
}

// Run main DOM ready
document.addEventListener('DOMContentLoaded', function() {
  
  // --- Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Preloader hide on load
  window.addEventListener('load', function() {
    const pre = $('#preloader');
    if (pre) {
      setTimeout(() => pre.classList.add('hidden'), 700);
    }
    document.body.classList.add('loaded');
    
    // Track page load time
    const loadTime = Date.now() - appState.pageLoadTime;
    console.log(`Page loaded in ${loadTime}ms`);
    
    // Initialize lazy loading for images
    initLazyLoading();
  });

  // --- Enhanced Theme Toggle with Logo Switching
  const themeToggleBtn = $('#theme-toggle');
  const logoLight = $('.logo-light');
  const logoDark = $('.logo-dark');
  
  // Apply saved theme
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
      if (logoLight && logoDark) {
        logoLight.style.display = 'none';
        logoDark.style.display = 'block';
      }
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
      if (logoLight && logoDark) {
        logoLight.style.display = 'block';
        logoDark.style.display = 'none';
      }
    }
    appState.theme = theme;
    localStorage.setItem('theme', theme);
    
    // Track theme change
    trackEvent('preferences', 'theme_toggle', theme);
  }
  
  // Initialize theme
  applyTheme(appState.theme);
  
  // Toggle theme on click with gold flash effect
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function() {
      const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
      
      // Add gold flash animation
      this.classList.add('gold-flash');
      setTimeout(() => {
        this.classList.remove('gold-flash');
      }, 600);
      
      applyTheme(newTheme);
    });
  }

  // --- Mobile Menu Toggle
  const mobileMenuBtn = $('.mobile-menu-btn');
  const mobileMenu = $('#mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('active');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
    
    // Close mobile menu when clicking on links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Logo pulse animation every minute
  function startLogoPulse() {
    const logo = $('.logo');
    if (logo) {
      timers.logoPulse = setInterval(() => {
        logo.classList.add('logo-pulse');
        setTimeout(() => {
          logo.classList.remove('logo-pulse');
        }, 2000);
      }, 60000);
    }
  }
  
  // --- Heading glow animation periodically
  function startHeadingGlow() {
    const goldHeadings = $$('.gold-heading, .gold-title');
    timers.headingGlow = setInterval(() => {
      goldHeadings.forEach(heading => {
        heading.classList.add('heading-glow');
        setTimeout(() => {
          heading.classList.remove('heading-glow');
        }, 1200);
      });
    }, 15000);
  }

  // --- Offer Countdown Timer
  function startCountdown() {
    const countdownElement = $('#countdown');
    if (!countdownElement) return;
    
    let timeLeft = 24 * 60 * 60; // 24 hours in seconds
    
    timers.countdown = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timers.countdown);
        countdownElement.textContent = '00:00:00';
        return;
      }
      
      timeLeft--;
      
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;
      
      countdownElement.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  // --- Lazy Loading for Images
  function initLazyLoading() {
    const lazyImages = $$('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('skeleton');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // --- Initialize Cost Calculator
  initCalculator();

  // --- Gallery filters with skeleton loading
  const filterBtns = $$('.filter-btn');
  const skeletonGrid = $('#skeletonGrid');
  const galleryGrid = $('#galleryGrid');
  
  // Load gallery images dynamically
  function loadGalleryImages() {
    const galleryItems = $$('.gallery-grid .item');
    
    // Show skeleton first
    if (skeletonGrid) skeletonGrid.style.display = 'grid';
    if (galleryGrid) galleryGrid.style.display = 'none';
    
    // Simulate loading delay
    setTimeout(() => {
      if (skeletonGrid) skeletonGrid.style.display = 'none';
      if (galleryGrid) galleryGrid.style.display = 'grid';
    }, 1000);
  }
  
  // Event delegation for filter buttons
  document.addEventListener('click', function(e) {
    if (e.target.matches('.filter-btn')) {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filter = e.target.getAttribute('data-filter');
      
      // Show skeleton during filtering
      loadGalleryImages();
      
      // Actual filtering after a delay
      setTimeout(() => {
        filterGallery(filter);
      }, 500);
      
      trackEvent('gallery', 'filter', filter);
    }
  });

  // --- Lightbox functionality
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  
  // Event delegation for gallery images
  document.addEventListener('click', function(e) {
    if (e.target.matches('.gallery-grid .card img')) {
      e.target.style.cursor = 'zoom-in';
      openLightbox(e.target);
    }
  });

  function openLightbox(imgEl) {
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = imgEl.src;
    lightboxImg.alt = imgEl.alt || 'صورة المعرض';
    lightbox.classList.add('visible');
    lightbox.setAttribute('aria-hidden','false');
    
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    
    trackEvent('gallery', 'lightbox_open', imgEl.alt);
  }

  window.closeLightbox = function(){
    if (!lightbox || !lightboxImg) return;
    
    lightbox.classList.remove('visible');
    lightbox.setAttribute('aria-hidden','true');
    lightboxImg.src = '';
    
    // Restore scroll
    document.body.style.overflow = '';
  };

  // Close lightbox with ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('visible')) {
      closeLightbox();
    }
  });

  const closeBtn = $('.close-lightbox');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  // --- Enhanced contact form handler
  window.handleForm = function(e){
    e.preventDefault();
    const form = e.target;
    
    try {
      const formData = new FormData(form);
      const name = (formData.get('name') || '').trim();
      const phone = (formData.get('phone') || '').trim();
      const city = (formData.get('city') || '').trim();
      const service = (formData.get('service') || '').trim();
      const message = (formData.get('message') || '').trim();
      
      // Validation
      if (!name || !phone || !city || !service) {
        alert('الرجاء إدخال جميع الحقول المطلوبة');
        return false;
      }
      
      const fullMessage = `طلب جديد من الموقع:\nالاسم: ${name}\nالهاتف: ${phone}\nالمدينة: ${city}\nالخدمة: ${service}\nالوصف: ${message}`;
      const whatsappUrl = `https://wa.me/201092497811?text=${encodeURIComponent(fullMessage)}`;
      
      // Open in new window with security improvements
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
      
      form.reset();
      
      // Track form submission
      trackEvent('contact', 'form_submit', service);
      
      alert('تم إرسال طلبك بنجاح! سيتم التواصل معك خلال 24 ساعة.');
      
    } catch (error) {
      console.error('Form handling error:', error);
      alert('حدث خطأ، يرجى المحاولة مرة أخرى');
    }
    
    return false;
  };

  // --- Scroll reveal with Intersection Observer
  const autoRevealElements = $$('section, .card, .hero, footer');
  autoRevealElements.forEach(el => { 
    if (!el.classList.contains('reveal')) el.classList.add('reveal'); 
  });

  const reveals = $$('.reveal');
  
  // Use Intersection Observer for better performance
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // --- Header shrink on scroll with throttle
  const header = $('header.site-header');
  const headerScrollHandler = throttle(() => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', headerScrollHandler);

  // --- Branch map toggle functionality
  const mapToggleBtns = $$('.btn-map-toggle');
  
  // Event delegation for map toggles
  document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-map-toggle')) {
      const branch = e.target.getAttribute('data-branch');
      const map = $(`#map-${branch}`);
      const isVisible = map.style.display === 'block';
      
      // Hide all maps first
      $$('.branch-map').forEach(m => {
        m.style.display = 'none';
      });
      
      // Reset all buttons
      $$('.btn-map-toggle').forEach(b => {
        b.textContent = 'عرض الخريطة';
      });
      
      // Toggle current map
      if (!isVisible) {
        map.style.display = 'block';
        e.target.textContent = 'إخفاء الخريطة';
        
        // Smooth scroll to map
        map.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        trackEvent('branches', 'map_view', branch);
      }
    }
  });

  // --- FAQ functionality
  const faqItems = $$('.faq-item');
  
  // Event delegation for FAQ
  document.addEventListener('click', function(e) {
    if (e.target.matches('.faq-question')) {
      const item = e.target.closest('.faq-item');
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active', !isActive);
      
      if (!isActive) {
        trackEvent('faq', 'question_open', e.target.textContent.trim());
      }
    }
  });

  // --- Reviews slider functionality
  const reviewCards = $$('.review-card');
  const indicators = $$('.indicator');
  
  function showReview(index) {
    // Hide all reviews
    reviewCards.forEach(card => {
      card.classList.remove('active');
      card.style.display = 'none';
    });
    
    // Remove active class from all indicators
    indicators.forEach(indicator => {
      indicator.classList.remove('active');
    });
    
    // Show selected review
    reviewCards[index].classList.add('active');
    reviewCards[index].style.display = 'block';
    
    // Activate corresponding indicator
    if (indicators[index]) {
      indicators[index].classList.add('active');
    }
    
    appState.currentReview = index;
  }
  
  // Initialize reviews slider
  function initReviewsSlider() {
    if (reviewCards.length > 0) {
      showReview(0);
      
      // Auto-advance reviews every 5 seconds
      timers.reviewInterval = setInterval(() => {
        const nextReview = (appState.currentReview + 1) % reviewCards.length;
        showReview(nextReview);
      }, 5000);
    }
  }
  
  // Event delegation for review indicators
  document.addEventListener('click', function(e) {
    if (e.target.matches('.indicator')) {
      const index = parseInt(e.target.getAttribute('data-slide'));
      
      // Reset interval when user manually changes slide
      clearInterval(timers.reviewInterval);
      showReview(index);
      
      // Restart auto-advance
      timers.reviewInterval = setInterval(() => {
        const nextReview = (appState.currentReview + 1) % reviewCards.length;
        showReview(nextReview);
      }, 5000);
    }
  });

  // --- Calculator tabs functionality
  const calculatorTabs = $$('.calculator-tab');
  
  // Event delegation for calculator tabs
  document.addEventListener('click', function(e) {
    if (e.target.matches('.calculator-tab')) {
      const targetTab = e.target.getAttribute('data-tab');
      
      // إزالة النشاط من جميع الألسنة
      calculatorTabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.calculator-tab-content').forEach(c => c.classList.remove('active'));
      
      // إضافة النشاط للسان المحدد
      e.target.classList.add('active');
      document.getElementById(`${targetTab}-tab`).classList.add('active');
      
      trackEvent('calculator', 'tab_switch', targetTab);
    }
  });

  // --- Booking system functionality
  const bookingForm = $('.booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const name = this.querySelector('input[type="text"]').value;
      const phone = this.querySelector('input[type="tel"]').value;
      const date = this.querySelector('input[type="date"]').value;
      
      if (!name || !phone) {
        alert('الرجاء إدخال الاسم ورقم الهاتف');
        return;
      }
      
      const message = `حجز استشارة مجانية:\nالاسم: ${name}\nالهاتف: ${phone}\nالتاريخ المفضل: ${date || 'غير محدد'}`;
      const whatsappUrl = `https://wa.me/201092497811?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      this.reset();
      alert('تم إرسال طلب الحجز بنجاح! سيتم التواصل معك لتأكيد الموعد.');
      
      trackEvent('booking', 'consultation_request', 'free_consultation');
    });
  }

  // --- WhatsApp FAB behavior
  const whatsappWrapper = $('.whatsapp-wrapper');
  const whatsappBtn = $('.whatsapp-fab');
  
  if (whatsappBtn) {
    const fabScrollHandler = throttle(() => {
      const current = window.pageYOffset;
      
      if (current > perf.lastScroll && current > 200) {
        // Scrolling down - hide
        whatsappWrapper.style.opacity = '0';
        whatsappWrapper.style.transform = 'translateY(40px)';
        whatsappWrapper.style.pointerEvents = 'none';
      } else {
        // Scrolling up - show
        whatsappWrapper.style.opacity = '1';
        whatsappWrapper.style.transform = 'translateY(0)';
        whatsappWrapper.style.pointerEvents = 'auto';
      }
      
      perf.lastScroll = current;
    }, 100);

    window.addEventListener('scroll', fabScrollHandler);
    
    // Track WhatsApp clicks
    whatsappBtn.addEventListener('click', () => {
      trackEvent('engagement', 'whatsapp_click', 'floating_button');
    });
  }

  // --- Button pulse animation
  const primaryButtons = $$('.btn-primary, .cta-header');
  
  // Add ripple effect to all buttons using event delegation
  document.addEventListener('click', function(e) {
    if (e.target.matches('.btn, .btn-primary, .btn-ghost, .cta-header')) {
      createRipple(e);
    }
  });
  
  // Buttons pulse every 6s
  setInterval(() => {
    primaryButtons.forEach(btn => { 
      btn.classList.add('pulsing'); 
      setTimeout(() => btn.classList.remove('pulsing'), 1000); 
    });
  }, 6000);

  // Initial animations
  setTimeout(() => { 
    primaryButtons.forEach(b => b.classList.add('pulsing')); 
    setTimeout(() => primaryButtons.forEach(b => b.classList.remove('pulsing')), 900); 
  }, 1600);

  // --- Mutation Observer for dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          initComponent(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Track time spent on page
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - appState.pageLoadTime;
    trackEvent('engagement', 'time_spent', Math.round(timeSpent/1000) + 's');
  });

  // --- Initialize components
  loadGalleryImages();
  initReviewsSlider();
  startLogoPulse();
  startHeadingGlow();
  startCountdown();

  // --- Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    Object.values(timers).forEach(timer => {
      if (timer) clearInterval(timer);
    });
    
    if (observer) observer.disconnect();
  });

}); // DOMContentLoaded end
