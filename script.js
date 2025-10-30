// تبديل بين معارض الألومنيوم والخشب
function showGallery(type) {
  document.querySelectorAll('.gallery').forEach(g => g.classList.remove('active'));
  document.querySelectorAll('.gallery-buttons button').forEach(b => b.classList.remove('active'));

  document.getElementById(type).classList.add('active');
  event.target.classList.add('active');
}

// إظهار الأقسام بتأثير أثناء التمرير
const sections = document.querySelectorAll('.section');
const showOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  sections.forEach(sec => {
    const secTop = sec.getBoundingClientRect().top;
    if (secTop < triggerBottom) sec.classList.add('visible');
  });
};

window.addEventListener('scroll', showOnScroll);
window.addEventListener('load', showOnScroll);
