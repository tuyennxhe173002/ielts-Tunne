import { signInWithGoogle, watchSession } from "./services/firebase-service.js";

const statusNode = document.querySelector("#login-status");
const loginButton = document.querySelector("#google-login-button");

watchSession((profile) => {
  if (!profile) return;
  statusNode.textContent = `Đã đăng nhập: ${profile.displayName}`;
  window.location.href = profile.role === "admin" ? "./admin.html" : "./index.html";
});

loginButton.addEventListener("click", async () => {
  statusNode.textContent = "Đang đăng nhập với Google...";
  await signInWithGoogle().catch((error) => {
    statusNode.textContent = error.message || "Đăng nhập thất bại";
  });
});
