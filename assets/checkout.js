const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const usernameDisplay = document.getElementById("usernameDisplay");

if (loggedInUser) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    usernameDisplay.textContent = loggedInUser.username;
} else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    usernameDisplay.textContent = "";
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    location.reload();
});