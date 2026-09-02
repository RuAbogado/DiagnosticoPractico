const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');
const pages = document.getElementById('pagination');
const catalog = document.querySelector('.catalog');
const detail = document.getElementById('detalle');
let currentPage = 1;
const productsPerPage = 4;

function getProducts() {
  const text = searchInput.value.toLowerCase();
  return products.filter(function (product) {
    const categoryOk = categorySelect.value === 'all' || product.category === categorySelect.value;
    return categoryOk && product.name.toLowerCase().includes(text);
  });
}

function showProducts() {
  const list = getProducts();
  const totalPages = Math.max(1, Math.ceil(list.length / productsPerPage));
  if (currentPage > totalPages) currentPage = 1;
  const first = (currentPage - 1) * productsPerPage;
  const visible = list.slice(first, first + productsPerPage);
  grid.innerHTML = visible.map(function (product) {
    return `<article class="product-card" data-id="${product.id}"><div class="product-image"><img src="${product.image}" alt="${product.name}"></div><div class="product-info"><span class="tag">${product.category}</span><h2>${product.name}</h2><p class="price">$${product.price}</p><p class="rating">★★★★★ <small>(${product.reviews})</small></p></div></article>`;
  }).join('');
  resultCount.textContent = list.length + ' productos';
  emptyState.hidden = list.length > 0;
  pages.innerHTML = '';
  for (let number = 1; number <= totalPages; number++) {
    const button = document.createElement('button');
    button.textContent = number;
    if (number === currentPage) button.className = 'current';
    button.onclick = function () { currentPage = number; showProducts(); };
    pages.appendChild(button);
  }
}

function showDetail(id) {
  const product = products.find(function (item) { return item.id === id; });
  catalog.hidden = true;
  detail.hidden = false;
  detail.innerHTML = `<button class="back">← Volver a productos</button><div class="detail-card"><div class="detail-image"><img src="${product.image}" alt="${product.name}"></div><div><span class="tag">${product.category}</span><h1>${product.name}</h1><p class="price">$${product.price}</p><p class="rating">★★★★★ <small>(${product.reviews} opiniones)</small></p><p class="description">${product.description}</p><button class="buy">Agregar al carrito</button></div></div>`;
}

searchInput.oninput = function () { currentPage = 1; showProducts(); };
categorySelect.onchange = function () { currentPage = 1; showProducts(); };
document.getElementById('filterButton').onclick = showProducts;
document.getElementById('clearFilters').onclick = function () { searchInput.value = ''; categorySelect.value = 'all'; currentPage = 1; showProducts(); };
grid.onclick = function (event) { const card = event.target.closest('.product-card'); if (card) showDetail(Number(card.dataset.id)); };
detail.onclick = function (event) { if (event.target.className === 'back') { detail.hidden = true; catalog.hidden = false; } };
showProducts();
