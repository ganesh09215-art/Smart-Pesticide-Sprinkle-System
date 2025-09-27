// script.js
async function fetchStatus() {
  try {
    const response = await fetch("http://localhost:5000/api/status");
    if (!response.ok) throw new Error("Backend not responding");
    const data = await response.json();
    console.log("Data", data);

    // Status & Sprayer
    document.getElementById("status").textContent = data.status;
    document.getElementById("spray-status-text").textContent =
      data.status === "चालू" ? "छिड़काव चालू" : "छिड़काव बंद";

    // Tank & Battery
    document.getElementById("tank-level").style.width = data.tank + "%";
    document.getElementById("tank-text").textContent = data.tank + "%";
    document.getElementById("battery-level").style.width = data.battery + "%";
    document.getElementById("battery-text").textContent = data.battery + "%";

    // Slider
    const slider = document.getElementById("intensity-slider");
    if (document.activeElement !== slider) {
      slider.value = data.intensity;
    }

    // Summary
    document.getElementById("summary-time").textContent = data.summary.time;
    document.getElementById("summary-medicine").textContent = data.summary.medicine;
    document.getElementById("summary-area").textContent = data.summary.area;
  } catch (err) {
    console.error("❌ Could not connect to backend:", err.message);
    alert("⚠️ Could not connect to the backend server!");
  }
}


async function sendCommand(action, value) {
  try {
    await fetch("https://spssserver.vercel.app/api/command", {
      
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, value }),
    });
    fetchStatus();
  } catch (err) {
    console.error("❌ Command failed:", err.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-btn").addEventListener("click", () => sendCommand("start"));
  document.getElementById("stop-btn").addEventListener("click", () => sendCommand("stop"));
  document.getElementById("intensity-slider").addEventListener("input", (e) =>
    sendCommand("setIntensity", e.target.value)
  );
  document.getElementById("emergency-stop").addEventListener("click", () => sendCommand("stop"));

  setInterval(fetchStatus, 15000);
  fetchStatus();
});

