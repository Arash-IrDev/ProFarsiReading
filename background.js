function isInjectableTab(tab) {
  if (!tab || !tab.id || !tab.url) return false;
  return !tab.url.startsWith('chrome://') &&
         !tab.url.startsWith('chrome-extension://') &&
         !tab.url.startsWith('edge://') &&
         !tab.url.startsWith('about:') &&
         !tab.url.startsWith('data:');
}

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!isInjectableTab(tab)) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });

  chrome.tabs.sendMessage(tab.id, { action: command });
});

// Messages coming from the popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!isInjectableTab(tab)) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });

  chrome.tabs.sendMessage(tab.id, { action: request.action });
});
