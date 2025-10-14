document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: 'Fat Bike aro26', description: 'Hasta 35km/h', autonomy: 35, price: 6999, image: 'https://i.ibb.co/Y4yY7fQ4/Whats-App-Image-2025-10-07-at-10-15-41-AM.jpg' },
    { id: 2, name: 'Bicicleta eléctrica SPEED MOTOR', description: 'Hasta 70 km/h ', autonomy: 45, price: 9500, image: 'https://i.ibb.co/gZKXdHMc/Whats-App-Image-2025-10-08-at-2-53-02-PM.jpg' },
    { id: 3, name: 'Fat Bike aro26', description: 'Hasta 35km/h', autonomy: 35, price: 6999, image: 'https://i.ibb.co/TDFdP9G5/Whats-App-Image-2025-10-08-at-2-53-08-PM.jpg' },
  ];

  const productGrid = document.getElementById('productGrid');
  const filterForm = document.getElementById('filterForm');
  const priceFilter = document.getElementById('priceFilter');
  const autonomyFilter = document.getElementById('autonomyFilter');

  function renderProducts(filteredProducts) {
    productGrid.innerHTML = ''; // Limpiar la grilla
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p>No se encontraron productos con estos filtros.</p>';
        return;
    }

    filteredProducts.forEach(product => {
      const productCard = `
        <article class="product-card">
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.description} · Autonomía ${product.autonomy} km</p>
          <div class="price">Bs ${product.price.toLocaleString('es-BO')}</div>
          <button class="btn btn-primary buy-btn" data-product-id="${product.id}">
            Comprar
          </button>
        </article>
      `;
      productGrid.innerHTML += productCard;
    });

    // Agregar event listeners a los botones de compra
    addBuyButtonListeners();
  }

  function addBuyButtonListeners() {
    const buyButtons = document.querySelectorAll('.buy-btn');
    buyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
          sendWhatsAppMessage(product);
        }
      });
    });
  }

  function sendWhatsAppMessage(product) {
    // Crear el mensaje para WhatsApp
    const whatsappMessage = `¡Hola! Estoy interesado en comprar el siguiente producto:

🛒 *SOLICITUD DE COMPRA*
────────────────────
🚲 *Modelo:* ${product.name}
📝 *Descripción:* ${product.description}
🔋 *Autonomía:* ${product.autonomy} km
💰 *Precio:* Bs ${product.price.toLocaleString('es-BO')}
────────────────────
*Por favor, necesito información sobre disponibilidad y proceso de compra.*`;

    // Codificar el mensaje para la URL de WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Usar api.whatsapp.com para envío automático
    const whatsappUrl = `https://api.whatsapp.com/send?phone=59163871286&text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappUrl, '_blank');
  }

  function applyFilters() {
    const priceValue = priceFilter.value;
    const autonomyValue = autonomyFilter.value;

    let filteredProducts = products.filter(product => {
      // Filtro de precio
      const [minPrice, maxPrice] = priceValue.split('-').map(Number);
      const priceMatch = (priceValue === 'all') || (product.price >= minPrice && product.price <= maxPrice);

      // Filtro de autonomía
      const [minAutonomy, maxAutonomy] = autonomyValue.split('-').map(Number);
      const autonomyMatch = (autonomyValue === 'all') || (product.autonomy >= minAutonomy && product.autonomy <= maxAutonomy);

      return priceMatch && autonomyMatch;
    });

    renderProducts(filteredProducts);
  }

  if (filterForm) {
    // Evitar que el formulario se envíe, ya que el filtrado es en el cliente
    filterForm.addEventListener('submit', (e) => e.preventDefault());

    // Aplicar filtros cuando cambie una selección
    priceFilter.addEventListener('change', applyFilters);
    autonomyFilter.addEventListener('change', applyFilters);
  }

  // Renderizar todos los productos al cargar la página
  if (productGrid) {
    renderProducts(products);
  }
});