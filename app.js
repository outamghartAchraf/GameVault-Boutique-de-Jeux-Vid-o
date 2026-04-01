import { games } from './data.js';

const CART_KEY = 'gamevault_cart';
let cart = [];
let activeGenre = 'Tous';
let searchQuery = '';

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
