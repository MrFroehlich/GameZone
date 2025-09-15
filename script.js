// Dark/Light Mode Toggle
const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  modeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Login System
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username-input");
const userDisplay = document.getElementById("user-display");
const loginContainer = document.getElementById("login-container");

function checkLogin() {
  const savedUser = localStorage.getItem("username");
  if (savedUser) {
    userDisplay.textContent = `👤 ${savedUser}`;
    userDisplay.classList.remove("hidden");
    loginContainer.classList.add("hidden");
  }
}

loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  if (username) {
    localStorage.setItem("username", username);
    checkLogin();
  }
});

checkLogin();

// Dynamisch Spielmodi aus JSON laden
async function loadModes() {
  try {
    const res = await fetch("modes.json");
    const data = await res.json();
    const container = document.getElementById("modes");

    data.modes.forEach(mode => {
      const card = document.createElement("div");
      card.classList.add("mode-card");

      card.innerHTML = `
        <div class="icon">${mode.icon}</div>
        <h3>${mode.title}</h3>
        <p>${mode.description}</p>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error("Fehler beim Laden der Spielmodi:", err);
  }
}

loadModes();
