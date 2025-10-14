document.addEventListener('DOMContentLoaded', () => {
  // Carrusel
  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (track && prevBtn && nextBtn) {
    const items = document.querySelectorAll('.carousel-item');
    const total = items.length;
    let index = 0;
    let autoPlayInterval;

    const updateCarousel = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
    };

    const startAutoPlay = () => {
      autoPlayInterval = setInterval(() => {
        index = (index + 1) % total;
        updateCarousel();
      }, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    nextBtn.addEventListener('click', () => {
      index = (index + 1) % total;
      updateCarousel();
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + total) % total;
      updateCarousel();
      resetAutoPlay();
    });

    startAutoPlay(); // Iniciar auto-play
  }
});