// auth.js - Sistema de autenticación

// Simulación de base de datos de usuarios
const users = [
  { email: "usuario@ejemplo.com", password: "123456", name: "Usuario Ejemplo" },
  { email: "admin@ejemplo.com", password: "admin123", name: "Administrador" },
  { email: "cliente@ejemplo.com", password: "cliente456", name: "Cliente" }
];

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return sessionStorage.getItem('authenticatedUser') !== null;
}

// Función para obtener el usuario autenticado
function getAuthenticatedUser() {
  const userJSON = sessionStorage.getItem('authenticatedUser');
  return userJSON ? JSON.parse(userJSON) : null;
}

// Función para iniciar sesión
function login(email, password) {
  // Buscar usuario en la "base de datos"
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Guardar usuario en sessionStorage
    sessionStorage.setItem('authenticatedUser', JSON.stringify(user));
    return { success: true, user };
  } else {
    return { success: false, message: "Correo o contraseña incorrectos" };
  }
}

// Función para cerrar sesión
function logout() {
  sessionStorage.removeItem('authenticatedUser');
  updateAuthUI();
}

// Función para actualizar la interfaz según el estado de autenticación
function updateAuthUI() {
  const authButtons = document.getElementById('auth-buttons');
  const userMenu = document.getElementById('user-menu');
  const userName = document.getElementById('user-name');
  const loginContainer = document.getElementById('login-container');
  const welcomeContainer = document.getElementById('welcome-container');
  
  if (isAuthenticated()) {
    const user = getAuthenticatedUser();
    
    // Mostrar menú de usuario
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName) userName.textContent = user.name;
    
    // Si estamos en la página de login, mostrar mensaje de bienvenida
    if (window.location.pathname.includes('login.html')) {
      if (loginContainer) loginContainer.style.display = 'none';
      if (welcomeContainer) welcomeContainer.style.display = 'block';
    }
  } else {
    // Mostrar botones de autenticación
    if (authButtons) authButtons.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
    
    // Si estamos en la página de login, mostrar formulario
    if (window.location.pathname.includes('login.html')) {
      if (loginContainer) loginContainer.style.display = 'block';
      if (welcomeContainer) welcomeContainer.style.display = 'none';
    }
  }
}

// Inicializar el sistema de autenticación
document.addEventListener('DOMContentLoaded', function() {
  // Actualizar UI al cargar la página
  updateAuthUI();
  
  // Configurar formulario de login si existe
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('pass').value;
      const errorMessage = document.getElementById('error-message');
      
      const result = login(email, password);
      
      if (result.success) {
        // Actualizar UI
        updateAuthUI();
        
        // Opcional: redirigir a otra página después de un tiempo
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 2000);
      } else {
        // Mostrar mensaje de error
        if (errorMessage) {
          errorMessage.textContent = result.message;
          errorMessage.style.display = 'block';
        }
      }
    });
  }
  
  // Configurar botón de logout si existe
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});


function isAuthenticated() {
  return localStorage.getItem('authenticatedUser') !== null;
}

function getAuthenticatedUser() {
  const userJSON = localStorage.getItem('authenticatedUser');
  return userJSON ? JSON.parse(userJSON) : null;
}

function logout() {
  localStorage.removeItem('authenticatedUser');
  updateAuthUI();
  window.location.reload();
}

function updateAuthUI() {
  const loginLink = document.getElementById('login-link');
  const userInfo = document.getElementById('user-info');
  const userNameSpan = document.getElementById('user-name');

  if (isAuthenticated()) {
    const user = getAuthenticatedUser();
    if (loginLink) loginLink.style.display = 'none';
    if (userInfo) {
      userInfo.style.display = 'flex';
      userNameSpan.textContent = `Hola, ${user.name}`;
    }
  } else {
    if (loginLink) loginLink.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  updateAuthUI();
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
});
