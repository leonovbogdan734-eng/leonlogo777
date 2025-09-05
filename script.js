// --- Змінні ---
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout');
const userEmailSpan = document.getElementById('user-email');

let currentUser = localStorage.getItem('currentUser') || null;
let balance = parseFloat(localStorage.getItem('balance')) || 0;

// --- UI оновлення ---
function updateUI() {
  userEmailSpan.innerText = currentUser || "Гість";
  document.getElementById('balance').innerText = balance;
  document.getElementById('add-logo-section').style.display = currentUser ? 'block' : 'none';
  logoutBtn.style.display = currentUser ? 'inline-block' : 'none';
  loadLogos();
}
updateUI();

// --- Toast ---
function showToast(message, type='success'){
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(()=> container.removeChild(toast),3000);
}

// --- Користувачі ---
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// --- Реєстрація ---
signupBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  if(!email || !password) return showToast('Заповніть усі поля', 'error');

  let users = getUsers();
  if(users.find(u => u.email === email)) return showToast('Користувач вже існує', 'error');

  users.push({email, password});
  saveUsers(users);
  showToast('Реєстрація успішна', 'success');
});

// --- Логін ---
loginBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  let users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if(!user) return showToast('Неправильний email або пароль', 'error');

  currentUser = user.email;
  localStorage.setItem('currentUser', currentUser);
  updateUI();
  showToast('Вхід успішний', 'success');
});

// --- Логут ---
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUI();
  showToast('Вийшли з системи', 'warning');
});

// --- Логотипи ---
function getLogos(){
  return JSON.parse(localStorage.getItem('logos')) || [];
}

function saveLogos(logos){
  localStorage.setItem('logos', JSON.stringify(logos));
}

function loadLogos(){
  const logosContainer = document.getElementById('logos');
  logosContainer.innerHTML = '';
  const logos = getLogos();
  logos.forEach((logo, index)=>{
    const card = document.createElement('div');
    card.className = 'logo-card';
    card.innerHTML = `
      <img src="${logo.image}" alt="${logo.name}" style="width:100%;border-radius:10px;margin-bottom:10px;">
      <span class="logo-name">${logo.name}</span>
      <span class="logo-price">$${logo.price}</span>
      <button class="buy-button" data-index="${index}">Купити</button>
    `;
    logosContainer.appendChild(card);
  });

  document.querySelectorAll('.buy-button').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const idx = e.target.dataset.index;
      const logos = getLogos();
      const logo = logos[idx];
      if(!currentUser) return showToast('Увійдіть для покупки', 'error');
      balance += parseFloat(logo.price);
      localStorage.setItem('balance', balance);
      addPurchase(logo);
      updateUI();
      showToast(`Купили ${logo.name} за $${logo.price}`, 'success');
    });
  });
}

// --- Додавання логотипів ---
document.getElementById('add-logo-btn').addEventListener('click', ()=>{
  const name = document.getElementById('logo-name').value.trim();
  const price = parseFloat(document.getElementById('logo-price').value);
  const image = document.getElementById('logo-image').value.trim();
  if(!name || !price || !image) return showToast('Заповніть всі поля', 'error');

  const logos = getLogos();
  logos.push({name, price, image, seller: currentUser});
  saveLogos(logos);
  loadLogos();
  showToast('Логотип додано!', 'success');
});

// --- Історія покупок ---
function getPurchases(){
  return JSON.parse(localStorage.getItem('purchases')) || [];
}

function savePurchases(purchases){
  localStorage.setItem('purchases', JSON.stringify(purchases));
}

function addPurchase(logo){
  const purchases = getPurchases();
  purchases.push({logo: logo.name, price: logo.price, buyer: currentUser, date: new Date().toISOString()});
  savePurchases(purchases);
  renderHistory();
}

function renderHistory(){
  const history = document.getElementById('purchase-history');
  const purchases = getPurchases().filter(p=>p.buyer===currentUser);
  history.innerHTML = '<h2>Історія покупок:</h2>';
  purchases.forEach(p=>{
    const div = document.createElement('div');
    div.innerText = `${p.logo} - $${p.price} - ${new Date(p.date).toLocaleString()}`;
    history.appendChild(div);
  });
}

renderHistory();
