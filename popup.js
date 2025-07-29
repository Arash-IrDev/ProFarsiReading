document.getElementById("toggle-font").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "toggle-font" });
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