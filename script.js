function showGallery(type) {
  document.querySelectorAll('.gallery').forEach(g => g.classList.remove('active'));
  document.querySelectorAll('.gallery-buttons button').forEach(b => b.classList.remove('active'));

  document.getElementById(type).classList.add('active');
  event.target.classList.add('active');
}
