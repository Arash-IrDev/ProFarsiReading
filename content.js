function injectFontStyle() {
  let existing = document.getElementById("farsiFontStyle");
  if (!existing) {
    let style = document.createElement("style");
    style.id = "farsiFontStyle";
    style.innerHTML = `
      @font-face {
        font-family: 'IRANSansXV';
        src: url('${chrome.runtime.getURL("fonts/IRANSansXV.woff2")}') format('woff2'),
             url('${chrome.runtime.getURL("fonts/IRANSansXV.woff")}') format('woff'),
             url('${chrome.runtime.getURL("fonts/IRANSansXVF.ttf")}') format('truetype');
      }
      
      *:not(i):not(svg):not(path) {
        font-family: 'IRANSansXV' !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function removeFontStyle() {
  let existing = document.getElementById("farsiFontStyle");
  if (existing) {
    existing.remove();
  }
}

function toggleFont() {
  let existing = document.getElementById("farsiFontStyle");
  if (existing) {
    removeFontStyle();
  } else {
    injectFontStyle();
  }
}

// Check if already initialized to prevent redeclaration errors
if (typeof window.proFarsiInitialized === 'undefined') {
  window.proFarsiInitialized = true;
  
  // Observer for new elements
  let fontSizeObserver = null;
  
  function setupFontSizeObserver() {
    if (fontSizeObserver) {
      fontSizeObserver.disconnect();
    }
    
    fontSizeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Apply font size to new elements
              applyFontSizeToElement(node);
              // Check children
              const children = node.querySelectorAll('*');
              children.forEach(child => applyFontSizeToElement(child));
            }
          });
        }
      });
    });
    
    fontSizeObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function applyFontSizeToElement(element) {
    if (!element || !element.style) return;
    
    const computedStyle = window.getComputedStyle(element);
    const currentSize = parseFloat(computedStyle.fontSize);
    
    if (!isNaN(currentSize) && currentSize > 0) {
      // If font size is already set, keep it
      const existingSize = element.style.fontSize;
      if (existingSize) {
        return; // Already set
      }
    }
  }

  // Simple font size management system
  function changeFontSize(delta) {
    // Change font size on all text elements
    const textElements = document.querySelectorAll('p, div, span, a, li, td, th, input, textarea, select, button, label, h1, h2, h3, h4, h5, h6, article, section, nav, aside, header, footer, main');
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const currentSize = parseFloat(computedStyle.fontSize);
      
      if (!isNaN(currentSize) && currentSize > 0) {
        const newSize = Math.max(8, Math.min(32, currentSize + delta));
        element.style.fontSize = newSize + 'px';
        
        // Adjust line-height proportionally to font size
        const newLineHeight = Math.max(1.2, (newSize + 4) / newSize); // Minimum 1.2 and maximum proportional to size
        element.style.lineHeight = newLineHeight;
        
        // Adjust letter-spacing for better readability of larger fonts
        if (newSize > 16) {
          const letterSpacing = Math.min(0.5, (newSize - 16) * 0.02); // Maximum 0.5px
          element.style.letterSpacing = letterSpacing + 'px';
        } else {
          element.style.letterSpacing = '';
        }
      }
    });
  }

  function resetFontSize() {
    // Remove all font-size, line-height and letter-spacing settings
    const textElements = document.querySelectorAll('p, div, span, a, li, td, th, input, textarea, select, button, label, h1, h2, h3, h4, h5, h6, article, section, nav, aside, header, footer, main');
    
    textElements.forEach(element => {
      element.style.fontSize = '';
      element.style.lineHeight = '';
      element.style.letterSpacing = '';
    });
  }

  // RTL toggle functionality
  function toggleRTL() {
    const html = document.documentElement;
    const currentDir = html.getAttribute('dir');
    
    if (currentDir === 'rtl') {
      html.removeAttribute('dir');
    } else {
      html.setAttribute('dir', 'rtl');
    }
  }

  // Messages from background
  chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
      case "toggle-font":
        toggleFont();
        break;
      case "increase-font-size":
        changeFontSize(1); // 1 pixel change
        setupFontSizeObserver();
        break;
      case "decrease-font-size":
        changeFontSize(-1); // 1 pixel change
        setupFontSizeObserver();
        break;
      case "reset-font-size":
        resetFontSize();
        if (fontSizeObserver) {
          fontSizeObserver.disconnect();
          fontSizeObserver = null;
        }
        break;
      case "toggle-rtl":
        toggleRTL();
        break;
    }
  });
}