const smartLayoutBtn = document.getElementById("toggle-smart-layout");
let smartLayoutActive = false;

document.getElementById("toggle-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "toggle-font" });
});

smartLayoutBtn.addEventListener("click", () => {
  smartLayoutActive = !smartLayoutActive;
  smartLayoutBtn.classList.toggle("active", smartLayoutActive);
  chrome.runtime.sendMessage({ action: "toggle-smart-layout" });
});

document.getElementById("toggle-rtl").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "toggle-rtl" });
});

document.getElementById("increase-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "increase-font-size" });
});

document.getElementById("decrease-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "decrease-font-size" });
});

document.getElementById("reset-font").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset-font-size" });
});
