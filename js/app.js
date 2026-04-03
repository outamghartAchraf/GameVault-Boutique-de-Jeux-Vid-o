import { games } from "./data.js";

const CART_KEY = 'gamevault_cart';

/* ─── State ─── */
let cart = [];
let activeGenre = 'Tous';
let searchQuery = '';
const categories = ["Tous", ...new Set(games.map(g => g.genre))];
 

/* ─── DOM ─── */
const catalogueEl = document.getElementById('catalogue');
const emptyStateEl = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filtersEl = document.getElementById('filters');
const countEl = document.getElementById('resultCount');

const cartBtn = document.getElementById('cartBtn');
const badgeEl = document.getElementById('cartBadge');
const cartPage = document.getElementById('cartPage');
const backBtn = document.getElementById('backBtn');

const cartListEl = document.getElementById('cartList');
const cartEmptyEl = document.getElementById('cartEmpty');
const cartFooterEl = document.getElementById('cartFooter');
const cartTotalEl = document.getElementById('cartTotal');
const orderBtn = document.getElementById('orderBtn');

const toastEl = document.getElementById('toast');

/*  Storage  */
const loadCart = () => cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

/* Catalogue  */

function renderCatalogue() {
  let filtered = games;

   
  if (activeGenre !== 'Tous') {
    filtered = filtered.filter(g => g.genre === activeGenre);
  }

  if (searchQuery) {
    filtered = filtered.filter(g =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  countEl.textContent = `${filtered.length} jeu`;
  catalogueEl.innerHTML = '';

  if (!filtered.length) {
    emptyStateEl.classList.remove('hidden');
    catalogueEl.classList.add('hidden');
    return;
  }

  emptyStateEl.classList.add('hidden');
  catalogueEl.classList.remove('hidden');

  filtered.forEach(game => {
    const card = document.createElement('div');
    card.className =
      'bg-gray-900 rounded-2xl overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-indigo-900/40';

    card.innerHTML = `
      <div class="relative group overflow-hidden rounded-2xl">
        <!-- Image -->
        <img src="${game.image}" class="w-full aspect-video object-cover transform group-hover:scale-110 transition duration-500" />

        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

        <!-- Genre Badge -->
        <span class="absolute top-3 left-3 bg-indigo-600/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur">${game.genre}</span>

        <!-- Content -->
        <div class="absolute bottom-0 p-4 w-full flex flex-col gap-3">
          <h2 class="text-white font-bold text-base leading-tight line-clamp-2">${game.title}</h2>
          <div class="flex items-center justify-between">
            <span class="text-indigo-400 font-extrabold text-lg">${fmt(game.price)}</span>
            <button data-id="${game.id}" class="add-btn flex items-center gap-1 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg backdrop-blur transition transform hover:scale-105 active:scale-95">
              <i class="fa-solid fa-cart-plus"></i> Ajouter
            </button>
          </div>
        </div>
      </div>
    `;

    catalogueEl.appendChild(card);
  });

   
  catalogueEl.querySelectorAll('.add-btn').forEach(btn =>
    btn.addEventListener('click', () => addToCart(+btn.dataset.id))
  );
}

/* ─── Cart ─── */
function addToCart(id) {

  const game = games.find(g => g.id === id);
  if (!game) return;

  const item = cart.find(i => i.game.id === id);

  item ? item.qty++ : cart.push({ game, qty: 1 });

  saveCart();
  updateBadge();

  showToast("jeux ajoute au panier")

}

/* ─── Cart Page ─── */
const showCart = () => {
  renderCart();
  cartPage.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

const hideCart = () => {
  cartPage.classList.add('hidden');
  document.body.style.overflow = '';
};

 
function renderCart() {
  cartListEl.innerHTML = '';

  if (!cart.length) {
    cartEmptyEl.classList.remove('hidden');
    cartFooterEl.classList.add('hidden');
    return;
  }

  cartEmptyEl.classList.add('hidden');
  cartFooterEl.classList.remove('hidden');

 cart.forEach(item => {
  const row = document.createElement('div');
  row.className = 'bg-gray-900 rounded-xl p-3 border border-indigo-500/20';

  row.innerHTML = `
    <div class="flex gap-3">
      <img src="${item.game.image}" class="w-20 h-14 object-cover rounded-lg flex-shrink-0 ring-1 ring-indigo-500/20" />

      <div class="flex-1 min-w-0">
        <p class="text-white font-semibold text-sm leading-tight">${item.game.title}</p>

        <span class="inline-block text-indigo-400 text-xs mt-0.5 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
          ${item.game.genre}
        </span>

        <div class="flex items-center justify-between mt-2">

          <div class="flex items-center gap-1.5">
            <button data-id="${item.game.id}" data-action="dec"
              class="qty-btn w-7 h-7 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/20 transition-colors">
              −
            </button>
            <span class="text-white font-bold text-sm w-5 text-center">${item.qty}</span>
            <button data-id="${item.game.id}" data-action="inc"
              class="qty-btn w-7 h-7 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/20 transition-colors">
              +
            </button>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-indigo-400 font-bold text-sm">${fmt(item.game.price * item.qty)}</span>
            <button data-id="${item.game.id}"
              class="del-btn w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
              <i class="fas fa-trash text-xs"></i>
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

    cartListEl.appendChild(row);
  });

  // Total
  const total = cart.reduce((s, i) => s + i.game.price * i.qty, 0);
  cartTotalEl.textContent = fmt(total);

  // Attach events
  cartListEl.querySelectorAll('.qty-btn').forEach(btn =>
    btn.addEventListener('click', () => changeQty(+btn.dataset.id, btn.dataset.action))
  );

  cartListEl.querySelectorAll('.del-btn').forEach(btn =>
    btn.addEventListener('click', () => removeItem(+btn.dataset.id))
  );
}
 
/* ─── Qty ─── */
function changeQty(id, action) {
  const item = cart.find(i => i.game.id === id);
  if (!item) return;

  item.qty += action === 'inc' ? 1 : -1;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.game.id !== id);
  }

  saveCart();
  updateBadge();
  renderCart();
}

/* ─── Remove ─── */
const removeItem = id => {
  cart = cart.filter(i => i.game.id !== id);
  saveCart();
  updateBadge();
  renderCart();
};

/* ─── Order ─── */
function placeOrder() {
  if (!cart.length) return;

  cart = [];
  saveCart();
  updateBadge();
  renderCart();
  hideCart();

  showToast('Commande validée');
}

 
function updateBadge() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  badgeEl.textContent = total;
  badgeEl.classList.toggle('hidden', total === 0);
}

const fmt = n =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

 
/* ─── Toast ─── */
let toastTimer;

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('opacity-0');
  toastEl.classList.add('opacity-100');

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toastEl.classList.add('opacity-0');
    toastEl.classList.remove('opacity-100');
  }, 3000);
}

 
searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderCatalogue();
});



categories.forEach((cat, index) => {
  const btn = document.createElement("button");

  btn.textContent = cat;

  btn.className =
    "text-xs font-semibold px-4 py-2 rounded-xl transition hover:scale-105";

  if (index === 0) {
    btn.classList.add("bg-indigo-600", "text-white");
  } else {
    btn.classList.add("bg-gray-800", "text-gray-400", "hover:bg-gray-700", "hover:text-white");
  }

  btn.addEventListener("click", () => {

    // remove active from all
    filtersEl.querySelectorAll("button").forEach(b => {
      b.classList.remove("bg-indigo-600", "text-white");
      b.classList.add("bg-gray-800", "text-gray-400");
    });

    
    btn.classList.add("bg-indigo-600", "text-white");
    btn.classList.remove("bg-gray-800", "text-gray-400");

   
    activeGenre = cat;
    renderCatalogue();
  });

  filtersEl.appendChild(btn);
});

cartBtn.addEventListener('click', showCart);
backBtn.addEventListener('click', hideCart);
orderBtn.addEventListener('click', placeOrder);


loadCart();
updateBadge();
renderCatalogue();