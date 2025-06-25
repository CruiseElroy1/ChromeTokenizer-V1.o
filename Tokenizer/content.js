function tokenize(text) {
  return text.match(/\w+|[^\s\w]/g) || [];
}

// Define a simple tokenization function (can be replaced with Tiktoken if available)
function tokenizeText(text) {
  // Basic tokenization: split by words, subwords, or characters as per original logic
  return text.trim().split(/\s+|\b(?=\w)/).filter(token => token.length > 0);  // Simple split for now
}

document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    const tokens = tokenize(selectedText);
    const tokenString = tokens.join(', ');
    chrome.runtime.sendMessage({action: 'displayTokens', tokens: tokenString, count: tokens.length});
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'tokenize') {
    try {
      const text = request.text;
      const tokens = tokenizeText(text);
      sendResponse({success: true, tokens: tokens.length});  // Send token count back
    } catch (error) {
      sendResponse({success: false, error: error.message});
    }
    return true;
  }
}); 