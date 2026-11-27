import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { auth } from "./firebase.js";

const signedOutMenu = document.querySelector("#signed-out-menu");
const signedInMenu = document.querySelector("#signed-in-menu");
const authEmail = document.querySelector("#auth-email");
const logoutButton = document.querySelector("#logout-btn");
const logoutError = document.querySelector("#logout-error");

onAuthStateChanged(auth, (user) => {
  signedOutMenu.hidden = Boolean(user);
  signedInMenu.hidden = !user;
  authEmail.textContent = user ? user.email || "Signed in" : "";
  logoutError.textContent = "";

  if (user) {
    localStorage.setItem("login_user", "true");
  } else {
    localStorage.removeItem("login_user");
  }
});

logoutButton.addEventListener("click", async () => {
  logoutError.textContent = "";
  logoutButton.disabled = true;
  try {
    await signOut(auth);
  } catch (error) {
    logoutError.textContent = `Couldn't log out: ${error.message}`;
  } finally {
    logoutButton.disabled = false;
  }
});
