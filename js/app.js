const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const pages = document.getElementById('pagination');
const catalog = document.querySelector('.catalog');
const detail = document.getElementById('detalle');
const home = document.getElementById('inicio');
const cartNumber = document.querySelector('.cart span');

let currentPage = 1;
const productsPerPage = 4;

function getProducts() {
  const text = searchInput.value.toLowerCase();

  return products.filter(function (product) {
    const categoryOk = categorySelect.value === 'all' ||
      product.category === categorySelect.value;
    const nameOk = product.name.toLowerCase().includes(text);

    return categoryOk && nameOk;
  });
}

function createCard(product) {
  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <span class="tag">${product.category}</span>
        <h2>${product.name}</h2>
        <p class="price">$${product.price}</p>
        <p class="rating">★★★★★ <small>(${product.reviews})</small></p>
      </div>
    </article>
  `;
}

function showPages(totalPages) {
  pages.innerHTML = '';

  for (let number = 1; number <= totalPages; number++) {
    const button = document.createElement('button');
    button.textContent = number;

    if (number === currentPage) {
      button.className = 'current';
    }

    button.onclick = function () {
      currentPage = number;
      showProducts();
    };

    pages.appendChild(button);
  }
}

function showProducts() {
  const list = getProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / productsPerPage));

  if (currentPage > totalPages) {
    currentPage = 1;
  }

  const first = (currentPage - 1) * productsPerPage;
  const visibleProducts = list.slice(first, first + productsPerPage);

  grid.innerHTML = visibleProducts.map(createCard).join('');
  resultCount.textContent = list.length + ' productos';
  emptyState.hidden = list.length > 0;
  showPages(totalPages);
}

function showDetail(id) {
  const product = products.find(function (item) {
    return item.id === id;
  });

  catalog.hidden = true;
  detail.hidden = false;
  detail.innerHTML = `
    <nav class="detail-breadcrumb" aria-label="Ruta de navegación">
      <button type="button" data-action="home">Inicio</button> /
      <button type="button" data-action="products">Productos</button> /
      ${product.category} / ${product.name}
    </nav>
    <button class="back">← Volver a productos</button>
    <div class="detail-card">
      <div class="detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div>
        <span class="tag">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="price">$${product.price}</p>
        <p class="rating">★★★★★ <small>(${product.reviews} opiniones)</small></p>
        <p class="description">${product.description}</p>
        <p class="quantity-title">Cantidad</p>
        <div class="quantity-control">
          <button type="button" class="quantity-button" data-action="minus">−</button>
          <span id="quantity">1</span>
          <button type="button" class="quantity-button" data-action="plus">+</button>
        </div>
        <button class="buy">Agregar al carrito</button>
      </div>
    </div>
  `;
}

function showHome() {
  home.hidden = false;
  catalog.hidden = true;
  detail.hidden = true;
  document.querySelector('nav [data-page="home"]').classList.add('active');
  document.querySelector('nav [data-page="products"]').classList.remove('active');
}

function showCatalog() {
  home.hidden = true;
  catalog.hidden = false;
  detail.hidden = true;
  document.querySelector('nav [data-page="home"]').classList.remove('active');
  document.querySelector('nav [data-page="products"]').classList.add('active');
}

document.getElementById('filterButton').onclick = function () {
  currentPage = 1;
  showProducts();
};

searchInput.oninput = function () {
  currentPage = 1;
  showProducts();
};

document.getElementById('clearFilters').onclick = function () {
  searchInput.value = '';
  categorySelect.value = 'all';
  currentPage = 1;
  showProducts();
};

grid.onclick = function (event) {
  const card = event.target.closest('.product-card');

  if (card) {
    showDetail(Number(card.dataset.id));
  }
};

detail.onclick = function (event) {
  if (event.target.dataset.action === 'home') {
    showHome();
  }

  if (event.target.dataset.action === 'products') {
    showCatalog();
  }

  if (event.target.className === 'back') {
    showCatalog();
  }

  if (event.target.dataset.action === 'minus') {
    const quantity = document.getElementById('quantity');
    if (Number(quantity.textContent) > 1) {
      quantity.textContent = Number(quantity.textContent) - 1;
    }
  }

  if (event.target.dataset.action === 'plus') {
    const quantity = document.getElementById('quantity');
    quantity.textContent = Number(quantity.textContent) + 1;
  }

  if (event.target.className === 'buy') {
    const quantity = Number(document.getElementById('quantity').textContent);
    cartNumber.textContent = Number(cartNumber.textContent) + quantity;
  }
};

document.querySelectorAll('[data-page="home"]').forEach(function (link) {
  link.onclick = showHome;
});

document.querySelectorAll('[data-page="products"]').forEach(function (link) {
  link.onclick = showCatalog;
});

document.getElementById('viewProducts').onclick = showCatalog;

document.querySelectorAll('[data-category]').forEach(function (button) {
  button.onclick = function () {
    categorySelect.value = button.dataset.category;
    currentPage = 1;
    showCatalog();
    showProducts();
  };
});

showProducts();
