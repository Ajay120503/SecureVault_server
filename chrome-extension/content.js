// Detect form submissions automatically
document.addEventListener("submit", async (e) => {
  const form = e.target;

  // Find password field
  const passwordInput = form.querySelector(
    'input[type="password"]'
  );

  if (!passwordInput) return;

  // Try finding username/email
  const usernameInput =
    form.querySelector('input[type="email"]') ||
    form.querySelector('input[name*=user]') ||
    form.querySelector('input[type="text"]');

  const password = passwordInput.value;
  const username = usernameInput?.value || "";

  if (!password) return;

  const payload = {
    site: window.location.hostname,
    username,
    password
  };

  // Send to background worker
  chrome.runtime.sendMessage({
    action: "SAVE_PASSWORD",
    data: payload
  });
});
