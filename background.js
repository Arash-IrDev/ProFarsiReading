chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    // First, make sure content.js is loaded on the current tab
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    // Now send the message
    chrome.tabs.sendMessage(tab.id, { action: command });
  }
});

// Messages coming from the popup
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    chrome.tabs.sendMessage(tab.id, { action: request.action });
  }
});