// Shared helpers 
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => [...ctx.querySelectorAll(sel)];
const fmt = n => new Intl.NumberFormat().format(n);
const money = n => `$${n.toFixed(2)}`;

const CART_KEY = "switch_cart_v1";
const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

function addToCart(item, qty=1){
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if(idx >= 0){ cart[idx].qty += qty; }
  else { cart.push({id:item.id, name:item.name, price:item.price, qty}); }
  saveCart(cart);
  toast(`Agregado: ${item.name}`);
  updateCartCount();
  animateCartItem(item.id);
}

function removeFromCart(id){
  saveCart(getCart().filter(i => i.id !== id));
  updateCartCount();
}

function updateCartCount(){
  const count = getCart().reduce((a,b)=>a+b.qty,0);
  $$(".cart-count").forEach(el=> el.textContent = count);
}

function toast(msg){
  let t = document.createElement("div");
  t.className = "badge toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.classList.add("hide"), 1400);
  setTimeout(()=> t.remove(), 1600);
}

function animateCartItem(id){
  const btn = $(`[data-add="${id}"]`);
  if(!btn) return;
  btn.classList.add("btn-animate");
  setTimeout(()=> btn.classList.remove("btn-animate"), 500);
}

// Confetti simple
function confetti() {
  for(let i=0;i<50;i++){
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random()*100+"vw";
    c.style.background = `hsl(${Math.random()*360},100%,50%)`;
    c.style.animationDelay = Math.random()*0.5+"s";
    document.body.appendChild(c);
    setTimeout(()=> c.remove(), 3000);
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  updateCartCount();

  // Mostrar nombre de usuario si está logueado
  const user = JSON.parse(localStorage.getItem("switch_user") || "null");
  if(user && user.name){
    const el = $("#user-name"); // Un span o div en tu header
    if(el) el.textContent = `Hola, ${user.name}`;
  }
});

// card reveal on scroll
const observer = new IntersectionObserver((entries)=>{
  for(const e of entries){
    if(e.isIntersecting){
      e.target.classList.add("show");
      observer.unobserve(e.target);
    }
  }
},{threshold:.2});

function observeCards(){
  $$(".card").forEach(c => observer.observe(c));
}

// Filters
function applyFilters(list, {q="", category="all", price="all", rating="all"}){
  q = q.toLowerCase();
  return list.filter(p => {
    const okQ = p.name.toLowerCase().includes(q) || p.series.toLowerCase().includes(q);
    const okC = category==="all" || p.category===category;
    const okP = price==="all" || (
      (price==="low" && p.price < 10) ||
      (price==="mid" && p.price >=10 && p.price < 20) ||
      (price==="high" && p.price >=20)
    );
    const okR = rating==="all" || Math.floor(p.rating) >= Number(rating);
    return okQ && okC && okP && okR;
  });
}

// Rendering
function cardTemplate(p){
  return `
  <article class="card" style="--delay:${(p.id%6)*50}ms">
    <div class="thumb"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
    <div class="content">
      <div class="row" style="justify-content:space-between">
        <span class="tag">${p.series}</span>
        <span class="rating">★ ${p.rating.toFixed(1)}</span>
      </div>
      <h3>${p.name}</h3>
      <div class="row" style="justify-content:space-between;align-items:center">
        <span class="price">${money(p.price)}</span>
        <div class="row">
          <a class="btn" href="product.html?id=${p.id}">Detalles</a>
          <button class="btn primary" data-add="${p.id}">Agregar</button>
        </div>
      </div>
    </div>
  </article>`;
}

function renderCards(container, list){
  container.innerHTML = list.map(cardTemplate).join("");
  observeCards();
  $$("[data-add]").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const id = Number(btn.dataset.add);
      const item = ALL_ITEMS.find(x=>x.id===id);
      addToCart(item, 1);
    });
  });
}

// Login
function handleLogin(){
  const f = $("#login-form");
  if(!f) return;
  f.addEventListener("submit", (e)=>{
    e.preventDefault();
    const name = $("#name").value.trim();
    const email = $("#email").value.trim();
    const pass = $("#pass").value.trim();
    if(email && pass && name){
      localStorage.setItem("switch_user", JSON.stringify({name, email}));
      location.href = "index.html";
    }
  });
}

// Cart page
function renderCart(){
  const wrap = $("#cart-items");
  if(!wrap) return;
  const cart = getCart();
  const payBtn = $("#pay-btn");
  const payMethod = $("#pay-method");
  const cardFields = $("#card-fields");

  if(cart.length===0){
    wrap.innerHTML = `<p class="p">Tu carrito está vacío.</p>`;
    $(".total").textContent = money(0);
    payBtn?.classList.add("hidden");
    if(payMethod) payMethod.classList.add("hidden");
    if(cardFields) cardFields.classList.add("hidden");
    return;
  }

  let total = 0;
  wrap.innerHTML = cart.map(i=>{
    const sub = i.price * i.qty;
    total += sub;
    return `<div class="cart-line animate-cart">
      <div class="row">
        <div class="kbd">x${i.qty}</div>
        <strong>${i.name}</strong>
      </div>
      <div class="row">
        <span>${money(sub)}</span>
        <button class="btn" data-remove="${i.id}">Quitar</button>
      </div>
    </div>`;
  }).join("");

  $(".total").textContent = money(total);

  $$("[data-remove]").forEach(b=> b.onclick = ()=>{
    removeFromCart(Number(b.dataset.remove));
    renderCart();
  });

  $("#clear")?.addEventListener("click", ()=>{
    saveCart([]);
    renderCart();
  });

  // 🔹 Mostrar opciones de pago
  if(payMethod){
    payMethod.classList.remove("hidden");
    payMethod.onchange = ()=>{
      if(payMethod.value === "card"){
        cardFields.classList.add("active");   // ✅ usar .active
      } else {
        cardFields.classList.remove("active");
      }
    };
  }

  // Botón de Pagar con confetti
  if(payBtn){
    payBtn.classList.remove("hidden");
    payBtn.onclick = ()=>{
      if(payMethod && payMethod.value === "card"){
        const num = $("#card-number").value.trim();
        const exp = $("#card-exp").value.trim();
        const cvv = $("#card-cvv").value.trim();
        if(!num || !exp || !cvv){
          alert("Por favor completa los datos de la tarjeta.");
          return;
        }
      }

      wrap.querySelectorAll(".cart-line").forEach(line=>{
        line.classList.add("fade-out");
      });
      setTimeout(()=>{
        wrap.innerHTML = `<p class="p success animate-pay">✅ Pago realizado con éxito. ¡Gracias por tu compra!</p>`;
        $(".total").textContent = money(0);
        saveCart([]);
        payBtn.classList.add("hidden");
        if(payMethod) payMethod.classList.add("hidden");
        if(cardFields) cardFields.classList.remove("active"); // ✅ ocultar al finalizar
        confetti();
      }, 600);
    };
  }
}

// Setup listing
function setupListingPage(sourceList){
  const q = $("#q");
  const category = $("#category");
  const price = $("#price");
  const rating = $("#rating");
  const out = $("#cards");
  
  // Llenar el selector de categorías con las categorías disponibles
  const categories = [...new Set(sourceList.map(item => item.category))];
  category.innerHTML = '<option value="all">Categoría</option>' + 
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  
  function update(){
    const filtered = applyFilters(sourceList, {q:q.value, category:category.value, price:price.value, rating:rating.value});
    renderCards(out, filtered);
    $("#count").textContent = `${filtered.length} resultados`;
  }
  [q,category,price,rating].forEach(el => el.addEventListener("input", update));
  update();
}

// Kickers
handleLogin();
renderCart();