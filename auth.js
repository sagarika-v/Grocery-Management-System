import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { auth } from "./firebase.js";

const form = document.querySelector("#auth-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitButton = document.querySelector("#btn1");
const message = document.querySelector("#auth-message");
const resetButton = document.querySelector("#password-reset");
const mode = form.dataset.authMode;

function describeError(error) {
  switch (error.code) {
    case "auth/invalid-email":
      return "Enter a valid email address.";
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "The email or password is incorrect.";
    case "auth/email-already-in-use":
      return "An account already exists for this email. Try signing in instead.";
    case "auth/weak-password":
      return "Choose a password with at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a while and try again.";
    case "auth/network-request-failed":
      return "Could not reach Firebase. Check your internet connection and try again.";
    case "auth/operation-not-allowed":
      return "Email/password sign-in is disabled in this Firebase project. Enable it in Firebase Authentication settings.";
    case "auth/unauthorized-domain":
      return "This site is not authorized by Firebase. Add its hostname under Firebase Authentication > Settings > Authorized domains.";
    default:
      return error.message || "Something went wrong. Please try again.";
  }
}

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "auth-message-error" : "auth-message-success";
}

function setBusy(isBusy) {
  submitButton.disabled = isBusy;
  submitButton.textContent = isBusy
    ? "Please wait..."
    : mode === "signup" ? "Sign Up" : "Sign In";
  if (resetButton) {
    resetButton.disabled = isBusy;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("", false);
  setBusy(true);

  try {
    if (mode === "signup") {
      await createUserWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value
      );
      await signOut(auth);
      form.reset();
      showMessage("Account created. You can now sign in.", false);
    } else {
      await signInWithEmailAndPassword(
        auth,
        emailInput.value.trim(),
        passwordInput.value
      );

      localStorage.setItem("login_user", "true");
      window.location.assign("index.html");
    }
  } catch (error) {
    showMessage(describeError(error), true);
  } finally {
    setBusy(false);
  }
});

if (resetButton) {
  resetButton.addEventListener("click", async () => {
    showMessage("", false);
    const email = emailInput.value.trim();
    if (!email) {
      emailInput.focus();
      showMessage("Enter your email above first, then request a reset link.", true);
      return;
    }

    resetButton.disabled = true;
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage("Password reset email sent. Check your inbox.", false);
    } catch (error) {
      showMessage(describeError(error), true);
    } finally {
      resetButton.disabled = false;
    }
  });
}
