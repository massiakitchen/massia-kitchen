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

// Enhanced Theme Toggle with Logo Switching
function initThemeToggle() {
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
}

// Mobile Menu Toggle
function initMobileMenu() {
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
}

// Scroll reveal with Intersection Observer
function initRevealAnimations() {
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
}

// Header shrink on scroll with throttle
function initHeaderScroll() {
  const header = $('header.site-header');
  const headerScrollHandler = throttle(() => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', headerScrollHandler);
}

// Lazy Loading for Images
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

// WhatsApp FAB behavior
function initWhatsAppFAB() {
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
}

// Button pulse animation
function initButtonAnimations() {
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
}

// Lightbox functionality
function initLightbox() {
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  
  // Event delegation for gallery images
  document.addEventListener('click', function(e) {
    if (e.target.matches('.gallery-grid .card img')) {
      e.target.style.cursor = 'zoom-in';
      openLightbox(e.target);
    }
  });

  window.openLightbox = function(imgEl) {
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
}


// Reviews slider functionality
function initReviewsSlider() {
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
  if (reviewCards.length > 0) {
    showReview(0);
    
    // Auto-advance reviews every 5 seconds
    timers.reviewInterval = setInterval(() => {
      const nextReview = (appState.currentReview + 1) % reviewCards.length;
      showReview(nextReview);
    }, 5000);
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
}

// Branch map toggle functionality
function initBranchMaps() {
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
}

// Booking system functionality
function initBookingSystem() {
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
}

// Initialize all components
function initComponents() {
  initThemeToggle();
  initMobileMenu();
  initRevealAnimations();
  initHeaderScroll();
  initLazyLoading();
  initWhatsAppFAB();
  initButtonAnimations();
  initLightbox();
  initFAQ();
  initReviewsSlider();
  initBranchMaps();
  initBookingSystem();
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
  });

  // Initialize all components
  initComponents();

  // Track time spent on page
  window.addEventListener('beforeunload', () => {
    const timeSpent = Date.now() - appState.pageLoadTime;
    trackEvent('engagement', 'time_spent', Math.round(timeSpent/1000) + 's');
  });

  // --- Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    Object.values(timers).forEach(timer => {
      if (timer) clearInterval(timer);
    });
  });

}); // DOMContentLoaded end

//

// ==============================
// Enhanced Pricing Grid Functionality
// ==============================

let selectedMaterial = null;
let selectedOptions = [];
let totalPrice = 0;

function selectMaterial(name, price) {
  selectedMaterial = { name, price };
  selectedOptions = []; // Reset options when material changes
  updateSelectionSummary();
  
  // Add visual feedback
  const buttons = $$('.price-item .btn-primary');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  trackEvent('pricing', 'material_select', name);
}

function addOption(name, price) {
  // Check if option already exists
  const existingOption = selectedOptions.find(opt => opt.name === name);
  if (!existingOption) {
    selectedOptions.push({ name, price });
    updateSelectionSummary();
    
    // Add visual feedback
    event.target.classList.add('active');
    setTimeout(() => event.target.classList.remove('active'), 1000);
    
    trackEvent('pricing', 'option_add', name);
  }
}

function updateSelectionSummary() {
  const summaryElement = $('#selectionSummary');
  const selectedItemsElement = $('#selectedItems');
  const totalPriceElement = $('#totalPrice');
  
  if (!selectedMaterial) {
    summaryElement.style.display = 'none';
    return;
  }
  
  summaryElement.style.display = 'block';
  
  // Calculate total
  totalPrice = selectedMaterial.price;
  selectedOptions.forEach(option => {
    totalPrice += option.price;
  });
  
  // Update selected items
  selectedItemsElement.innerHTML = '';
  
  // Add main material
  const materialItem = document.createElement('div');
  materialItem.className = 'selected-item';
  materialItem.innerHTML = `
    <span class="selected-item-name">${selectedMaterial.name}</span>
    <span class="selected-item-price">${formatNumber(selectedMaterial.price)} ج/م</span>
  `;
  selectedItemsElement.appendChild(materialItem);
  
  // Add options
  selectedOptions.forEach(option => {
    const optionItem = document.createElement('div');
    optionItem.className = 'selected-item';
    optionItem.innerHTML = `
      <span class="selected-item-name">+ ${option.name}</span>
      <span class="selected-item-price">${formatNumber(option.price)} ج/م</span>
    `;
    selectedItemsElement.appendChild(optionItem);
  });
  
  // Update total price
  totalPriceElement.textContent = `الإجمالي: ${formatNumber(totalPrice)} جنية/م`;
}

function proceedToCalculator() {
  if (!selectedMaterial) {
    showNotification('يرجى اختيار نوع الخامة أولاً', 'error');
    return;
  }
  
  // Update calculator with selected options
  appState.calculatorData.material = selectedMaterial.name.toLowerCase().includes('ألومنيوم') ? 'standard' : 
                                    selectedMaterial.name.toLowerCase().includes('hpl') ? 'premium' : 'economy';
  
  // Scroll to calculator
  document.getElementById('calculator').scrollIntoView({ 
    behavior: 'smooth' 
  });
  
  showNotification('تم تحديث الحاسبة بخياراتك المفضلة!', 'success');
  trackEvent('pricing', 'proceed_to_calculator', selectedMaterial.name);
}

// Initialize pricing functionality
function initPricingGrid() {
  // Add click handlers for material selection
  const materialItems = $$('.price-item');
  materialItems.forEach(item => {
    item.addEventListener('click', function(e) {
      if (!e.target.classList.contains('btn')) {
        const btn = this.querySelector('.btn-primary');
        if (btn) btn.click();
      }
    });
  });
}

// Add to existing initComponents function
function initComponents() {
  initThemeToggle();
  initMobileMenu();
  initRevealAnimations();
  initHeaderScroll();
  initLazyLoading();
  initWhatsAppFAB();
  initButtonAnimations();
  initLightbox();
  initFAQ();
  initReviewsSlider();
  initBranchMaps();
  initBookingSystem();
  initPricingGrid(); // Add this line
}



// ==============================
// Enhanced FAQ Functionality
// ==============================

function initEnhancedFAQ() {
  const faqItems = $$('.faq-item');
  const categoryBtns = $$('.category-btn');
  const searchInput = $('#faqSearch');
  const searchResults = $('#searchResults');

  // FAQ Accordion
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active', !isActive);
      
      // Update ARIA attributes
      const isExpanded = item.classList.contains('active');
      this.setAttribute('aria-expanded', isExpanded);
      
      // Track FAQ interaction
      if (!isActive) {
        const questionText = this.querySelector('.question-text').textContent;
        trackEvent('faq', 'question_open', questionText);
      }
    });
  });

  // Category Filtering
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Update active button
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Filter FAQ items
      faqItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(10px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
      
      trackEvent('faq', 'category_filter', category);
    });
  });

  // Search Functionality
  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase().trim();
      
      if (searchTerm.length === 0) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
      }
      
      const matchingItems = Array.from(faqItems).filter(item => {
        const questionText = item.querySelector('.question-text').textContent.toLowerCase();
        const answerText = item.querySelector('.answer-content').textContent.toLowerCase();
        return questionText.includes(searchTerm) || answerText.includes(searchTerm);
      });
      
      if (matchingItems.length > 0) {
        searchResults.innerHTML = matchingItems.map(item => {
          const question = item.querySelector('.question-text').textContent;
          return `
            <div class="search-result-item" data-item-id="${item.id || ''}">
              ${question}
            </div>
          `;
        }).join('');
        
        searchResults.classList.add('active');
        
        // Add click handlers to search results
        $$('.search-result-item').forEach(resultItem => {
          resultItem.addEventListener('click', function() {
            const itemId = this.getAttribute('data-item-id');
            const targetItem = itemId ? $(`#${itemId}`) : matchingItems[0];
            
            if (targetItem) {
              // Show all categories
              categoryBtns.forEach(b => {
                if (b.getAttribute('data-category') === 'all') {
                  b.click();
                }
              });
              
              // Scroll to and open the item
              targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
              targetItem.classList.add('active');
              targetItem.querySelector('.faq-question').setAttribute('aria-expanded', 'true');
              
              // Highlight search term
              highlightSearchTerm(targetItem, searchTerm);
            }
            
            searchInput.value = '';
            searchResults.classList.remove('active');
          });
        });
      } else {
        searchResults.innerHTML = '<div class="no-results">لا توجد نتائج مطابقة</div>';
        searchResults.classList.add('active');
      }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });
  }
}

function highlightSearchTerm(element, term) {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  const nodes = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.toLowerCase().includes(term)) {
      nodes.push(node);
    }
  }
  
  nodes.forEach(textNode => {
    const span = document.createElement('span');
    span.className = 'search-highlight';
    span.style.backgroundColor = 'rgba(212,175,55,0.3)';
    span.style.padding = '0.1rem 0.2rem';
    span.style.borderRadius = '3px';
    
    const text = textNode.textContent;
    const regex = new RegExp(term, 'gi');
    const newText = text.replace(regex, match => `<span class="search-highlight">${match}</span>`);
    
    const wrapper = document.createElement('span');
    wrapper.innerHTML = newText;
    textNode.parentNode.replaceChild(wrapper, textNode);
  });
}

// Add to existing initComponents function
function initComponents() {
  initThemeToggle();
  initMobileMenu();
  initRevealAnimations();
  initHeaderScroll();
  initLazyLoading();
  initWhatsAppFAB();
  initButtonAnimations();
  initLightbox();
  initEnhancedFAQ(); // Replace initFAQ with this
  initReviewsSlider();
  initBranchMaps();
  initBookingSystem();
  initPricingGrid();
}


// ==============================
// Reviews Slider Functionality
// ==============================

let currentReview = 0;
const totalReviews = 5; // عدد التقييمات
let autoSlideInterval;

function initReviewsSlider() {
  const reviewCards = $$('.review-card');
  const indicators = $$('.indicator');
  
  // تأكد من أن أول تقييم مرئي
  showReview(0);
  
  // بدء التشغيل التلقائي
  startAutoSlide();
  
  // إضافة event listeners للمؤشرات
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      showReview(index);
      startAutoSlide();
    });
  });
  
  // إضافة event listeners لأزرار التنقل
  const prevBtn = $('.slider-nav.prev');
  const nextBtn = $('.slider-nav.next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      prevReview();
      startAutoSlide();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      clearInterval(autoSlideInterval);
      nextReview();
      startAutoSlide();
    });
  }
}

function showReview(index) {
  const reviewCards = $$('.review-card');
  const indicators = $$('.indicator');
  
  // إخفاء جميع التقييمات
  reviewCards.forEach(card => {
    card.classList.remove('active');
    card.style.display = 'none';
  });
  
  // إزالة النشاط من جميع المؤشرات
  indicators.forEach(indicator => {
    indicator.classList.remove('active');
  });
  
  // عرض التقييم الحالي
  if (reviewCards[index]) {
    reviewCards[index].classList.add('active');
    reviewCards[index].style.display = 'block';
  }
  
  // تفعيل المؤشر الحالي
  if (indicators[index]) {
    indicators[index].classList.add('active');
  }
  
  currentReview = index;
  
  // تتبع الحدث
  trackEvent('reviews', 'slide_change', `review_${index + 1}`);
}

function nextReview() {
  currentReview = (currentReview + 1) % totalReviews;
  showReview(currentReview);
}

function prevReview() {
  currentReview = (currentReview - 1 + totalReviews) % totalReviews;
  showReview(currentReview);
}

function startAutoSlide() {
  // إيقاف أي interval سابق
  clearInterval(autoSlideInterval);
  
  // بدء interval جديد
  autoSlideInterval = setInterval(() => {
    nextReview();
  }, 5000); // تغيير كل 5 ثواني
}

// جعل الدوال متاحة globally للاستدعاء من HTML
window.nextReview = nextReview;
window.prevReview = prevReview;

// تحديث دالة initComponents لتشمل السلايدر
function initComponents() {
  initThemeToggle();
  initMobileMenu();
  initRevealAnimations();
  initHeaderScroll();
  initLazyLoading();
  initWhatsAppFAB();
  initButtonAnimations();
  initLightbox();
  initFAQ();
  initReviewsSlider(); // أضف هذا السطر
  initBranchMaps();
  initBookingSystem();
  initPricingGrid();
}
