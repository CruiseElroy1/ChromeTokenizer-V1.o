chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'tokenize-selection',
    title: 'Tokenize Text',
    contexts: ['selection']
  });

  // Add context menu for auto-tokenization
  chrome.contextMenus.create({
    id: 'tokenizeSelection',
    title: 'Tokenize selected text',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'tokenize-selection' && info.selectionText) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: tokenizeTextInTab,
      args: [info.selectionText]
    });
  }

  if (info.menuItemId === 'tokenizeSelection' && info.selectionText) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      chrome.tabs.sendMessage(tab.id, {action: 'tokenize', text: info.selectionText}, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError.message);
          // Optionally, notify the user or retry
        } else if (response) {
          console.log('Response received:', response);
        }
      });
    } catch (error) {
      console.error('Error establishing connection:', error);
    }
  }
});

function tokenizeTextInTab(selectedText) {
  const tokens = selectedText.match(/\w+|[^\s\w]/g) || [];
  const tokenString = tokens.join(', ');
  chrome.runtime.sendMessage({action: 'displayTokens', tokens: tokenString, count: tokens.length});
} 