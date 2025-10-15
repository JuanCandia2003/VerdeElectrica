// Main site script
// Handles mobile nav toggle and other small UI behaviors

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('open');
      // Update aria-expanded for accessibility
      const expanded = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
    });
  }

  // Close nav when clicking outside on small screens
  document.addEventListener('click', function (e) {
    if (!mainNav || !navToggle) return;
    if (mainNav.classList.contains('open')) {
      const isClickInside = mainNav.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
      }
    }
  });
});
