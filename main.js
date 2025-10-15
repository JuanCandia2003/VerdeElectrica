// Main site script
// Handles mobile nav toggle and other small UI behaviors

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    const header = document.querySelector('.site-header');
    function updateNavTop() {
      const headerHeight = header ? header.offsetHeight : 56;
      mainNav.style.top = headerHeight + 'px';
      // when closed ensure max-height matches calc
    }

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      updateNavTop();
      mainNav.classList.toggle('open');
      const expanded = mainNav.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded);
      // prevent body scroll when open
      if (expanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    // update on resize
    window.addEventListener('resize', updateNavTop);
  }

  // Close nav when clicking outside on small screens
  document.addEventListener('click', function (e) {
    if (!mainNav || !navToggle) return;
    if (mainNav.classList.contains('open')) {
      const isClickInside = mainNav.contains(e.target) || navToggle.contains(e.target);
      if (!isClickInside) {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      }
    }
  });
});
