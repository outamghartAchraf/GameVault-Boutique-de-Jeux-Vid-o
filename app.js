import { games } from './data.js';

const CART_KEY = 'gamevault_cart';
let cart = [];
let activeGenre = 'Tous';
let searchQuery = '';
const categories = ["Tous", ...new Set(games.map(g => g.genre))];


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

const loadCard = () => cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
const saveCard = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));

function renderCatalogue() {
    let filtered = games;
     
    if(activeGenre !== "Tous") {
      filtered = filtered.filter(g => g.genre === activeGenre);
    }

    if(searchQuery) {
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
  catalogueEl.innerHTML = '';

  if(!filtered.length) {
    emptyStateEl.classList.remove('hidden');
    catalogueEl.classList.add('hidden');
    return;
  }

  emptyStateEl.classList.add('hidden');
  catalogueEl.classList.remove('hidden');

  countEl.textContent = `${filtered.length} jeu`;

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
            <span class="text-indigo-400 font-extrabold text-lg">${(game.price)}</span>
            <button data-id="${game.id}" class="add-btn flex items-center gap-1 bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs px-3 py-2 rounded-lg backdrop-blur transition transform hover:scale-105 active:scale-95">
              <i class="fa-solid fa-cart-plus"></i> Ajouter
            </button>
          </div>
        </div>
      </div>
    `;

    catalogueEl.appendChild(card);
  });

}


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

searchInput.addEventListener('input', e => {
  searchQuery = e.target.value;
  renderCatalogue();
});


renderCatalogue();