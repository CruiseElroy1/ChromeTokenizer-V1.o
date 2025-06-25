document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('tokenizeButton');
  const inputTextArea = document.getElementById('textInput');
  const resultsDiv = document.getElementById('results');
  
  // Add focus event to clear placeholder or handle input
  inputTextArea.addEventListener('focus', () => {
    if (inputTextArea.value === inputTextArea.placeholder) {
      inputTextArea.value = '';  // Clear placeholder text on focus
      inputTextArea.style.color = '#000';  // Reset text color if needed
    }
  });
  
  function tokenize(text) {
    return text.match(/\w+|[^\s\w]/g) || [];
  }
  
  button.addEventListener('click', () => {
    console.log('Button clicked, input text: ' + inputTextArea.value);  // Debugging log
    const text = inputTextArea.value.trim();
    if (text) {
      const tokens = tokenize(text);
      const coloredTokens = tokens.map(token => `<span style='background-color: #e1f5fe; color: #01579b; padding: 2px 4px; border-radius: 3px;'>${token}</span>`).join(', ');
      resultsDiv.innerHTML = `<p>Tokens: ${coloredTokens}</p><p>Number of tokens: ${tokens.length}</p>`;
    } else {
      resultsDiv.innerHTML = `<p style='color: red;'>Please enter some text to tokenize.</p>`;
    }
  });
  
  // Listen for messages from content.js for auto-input results
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'displayTokens') {  // Adjust based on background.js messaging
      if (message.success) {
        displayResults(message.tokens);  // Call with the token count
      } else {
        displayError(message.error);
      }
    }
  });

  function displayResults(tokens) {
    const tokenCountDisplay = document.getElementById('tokenCountDisplay');
    if (tokenCountDisplay) {
      tokenCountDisplay.textContent = `Number of tokens: ${tokens}`;  // Format and update token count here
    }
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.textContent = '';  // Clear #results to keep it separate
    }
  }

  function displayError(errorMsg) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = `Error: ${errorMsg}`;
  }
}); 