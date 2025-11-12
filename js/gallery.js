// ==============================
// Gallery Functionality
// ==============================

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

// Gallery filters with skeleton loading
function initGallery() {
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

  // Initial load
  loadGalleryImages();
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initGallery();
});