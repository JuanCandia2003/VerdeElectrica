document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const averageRatingEl = document.getElementById('average-rating');
    const summaryStarsEl = document.getElementById('summary-stars-display');
    const totalReviewsEl = document.getElementById('total-reviews');
    const ratingBars = {
        5: document.getElementById('bar-5'),
        4: document.getElementById('bar-4'),
        3: document.getElementById('bar-3'),
        2: document.getElementById('bar-2'),
        1: document.getElementById('bar-1'),
    };
    const ratingForm = document.getElementById('rating-form');

    // --- Datos ---
    let comments = JSON.parse(localStorage.getItem('comments')) || [];

    // Si no hay datos, usamos datos de ejemplo para la demo inicial
    if (comments.length === 0) {
        comments = [
            { rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 5 },
            { rating: 4 }, { rating: 4 }, { rating: 4 },
            { rating: 3 }, { rating: 3 },
            { rating: 2 },
            { rating: 1 },
        ];
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // --- Lógica de Renderizado ---
    function renderRatingStats() {
        const totalReviews = comments.length;
        if (totalReviews === 0) {
            averageRatingEl.textContent = '0.0';
            summaryStarsEl.innerHTML = '☆'.repeat(5);
            totalReviewsEl.textContent = 'Basado en 0 reseñas';
            Object.values(ratingBars).forEach(bar => { bar.style.width = '0%'; });
            return;
        }

        const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
        const avgRating = (totalRating / totalReviews).toFixed(1);

        const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        comments.forEach(comment => { ratingCounts[comment.rating]++; });

        averageRatingEl.textContent = avgRating;
        const roundedAvg = Math.round(avgRating);
        summaryStarsEl.innerHTML = '★'.repeat(roundedAvg) + '☆'.repeat(5 - roundedAvg);
        totalReviewsEl.textContent = `Basado en ${totalReviews} reseñas`;

        for (let i = 5; i >= 1; i--) {
            const percentage = (ratingCounts[i] / totalReviews) * 100;
            const bar = ratingBars[i];
            bar.style.width = `${percentage}%`;
            bar.className = `progress color-${i}`;
        }
    }

    // --- Manejo del Formulario ---
    ratingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ratingValue = e.target.rating.value;

        if (!ratingValue) {
            alert('Por favor, selecciona una calificación.');
            return;
        }

        const newRating = {
            rating: parseInt(ratingValue)
        };

        comments.push(newRating);
        localStorage.setItem('comments', JSON.stringify(comments));

        renderRatingStats(); // Actualizar las estadísticas al instante
        ratingForm.reset(); // Limpiar la selección de estrellas
    });

    // --- Ejecución Inicial ---
    renderRatingStats();
});
