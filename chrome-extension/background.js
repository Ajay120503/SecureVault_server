chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action !== "SAVE_PASSWORD") return;

  try {
    // get stored JWT token
    const { token } = await chrome.storage.local.get("token");

    if (!token) {
      console.log("No token found");
      return;
    }

    const res = await fetch(
      "http://localhost:5000/api/import/extension",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          passwords: [msg.data]
        })
      }
    );

    const data = await res.json();

    console.log("Auto saved:", data);

  } catch (err) {
    console.error("Auto import failed:", err);
  }
});
