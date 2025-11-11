// script.js - global helpers for token / navbar behavior

// Return token string or null
function getToken() {
  const data = localStorage.getItem("token");
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    // if parsed is object with token property
    if (typeof parsed === "object" && parsed.token) return parsed.token;
    // if parsed is a plain string
    return parsed;
  } catch {
    // not JSON, maybe raw token string
    return data;
  }
}

// Return username if stored in token object, else empty string
function getUsername() {
  const data = localStorage.getItem("token");
  if (!data) return "";
  try {
    const parsed = JSON.parse(data);
    return parsed?.username || "";
  } catch {
    return "";
  }
}

// Setup navbar login/logout elements if present on the page
function initNavbar() {
  const token = getToken();
  const username = getUsername();

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const usernameDisplay = document.getElementById("usernameDisplay");
  const usernameSpan = document.getElementById("username");

  if (token) {
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.textContent = "Log out";
      logoutBtn.onclick = () => {
        localStorage.removeItem("token");
        // also optionally clear cachedProducts? keep it to preserve created products
        window.location.href = "login.html";
      };
    }
    if (usernameDisplay) usernameDisplay.textContent = username;
    if (usernameSpan) usernameSpan.textContent = username;
  } else {
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.textContent = "Log in";
      logoutBtn.onclick = () => window.location.href = "login.html";
    }
    if (usernameDisplay) usernameDisplay.textContent = "";
    if (usernameSpan) usernameSpan.textContent = "";
  }
}

// Expose helpers globally (pages can call getToken/getUsername directly)
window.getToken = getToken;
window.getUsername = getUsername;
window.initNavbar = initNavbar;

// If script.js loaded late, you can call initNavbar() from each page after loading this file.
