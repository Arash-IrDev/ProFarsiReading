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

// Inject only the @font-face definition without globally overriding fonts.
function injectFontFaceOnly() {
  let existing = document.getElementById("farsiFontFaceOnly");
  if (!existing) {
    let style = document.createElement("style");
    style.id = "farsiFontFaceOnly";
    style.innerHTML = `
      @font-face {
        font-family: 'IRANSansXV';
        src: url('${chrome.runtime.getURL("fonts/IRANSansXV.woff2")}') format('woff2'),
             url('${chrome.runtime.getURL("fonts/IRANSansXV.woff")}') format('woff'),
             url('${chrome.runtime.getURL("fonts/IRANSansXVF.ttf")}') format('truetype');
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

  // ─── Smart Layout: Auto RTL/LTR Detection & Injection ───────────────────────

  // Unicode ranges for RTL characters (Arabic, Persian, Hebrew)
  const RTL_RANGES = [
    [0x0600, 0x06FF], // Arabic & Persian
    [0x0750, 0x077F], // Arabic Supplement
    [0x08A0, 0x08FF], // Arabic Extended-A
    [0xFB50, 0xFDFF], // Arabic Presentation Forms-A
    [0xFE70, 0xFEFF], // Arabic Presentation Forms-B
    [0x0590, 0x05FF]  // Hebrew
  ];

  // Unicode ranges for LTR characters (Latin, Cyrillic)
  const LTR_RANGES = [
    [0x0000, 0x007F], // Basic Latin
    [0x0080, 0x00FF], // Latin-1 Supplement
    [0x0100, 0x017F], // Latin Extended-A
    [0x0180, 0x024F], // Latin Extended-B
    [0x0400, 0x04FF], // Cyrillic
    [0x0500, 0x052F]  // Cyrillic Supplement
  ];

  function isInRange(code, ranges) {
    for (let i = 0; i < ranges.length; i++) {
      if (code >= ranges[i][0] && code <= ranges[i][1]) return true;
    }
    return false;
  }

  // Neutral characters (digits, punctuation, whitespace) are ignored in direction detection
  function isNeutral(ch) {
    return /[0-9\u06F0-\u06F9\u0660-\u0669\s.,!?;:()[\]{}<>""''`@#$%^&*\-_+=~\/\\|]/.test(ch);
  }

  /**
   * Detects text direction based on character analysis.
   * Returns 'rtl' if RTL ratio >= 30% or RTL count > LTR count * 1.5
   */
  function detectDirection(text) {
    if (!text || !text.trim()) return 'ltr';
    const plain = text.replace(/<[^>]*>/g, '');
    let rtl = 0, ltr = 0;
    for (let i = 0; i < plain.length; i++) {
      const ch = plain.charAt(i);
      if (isNeutral(ch)) continue;
      const code = plain.charCodeAt(i);
      if (isInRange(code, RTL_RANGES)) rtl++;
      else if (isInRange(code, LTR_RANGES)) ltr++;
    }
    const total = rtl + ltr;
    if (total === 0) return 'ltr';
    if (rtl / total >= 0.3 || rtl > ltr * 1.5) return 'rtl';
    return 'ltr';
  }

  /**
   * Returns only the text that belongs directly to this element (its own text nodes),
   * excluding text inside child elements. This prevents container divs from being
   * judged by their descendants' content.
   */
  function getDirectText(el) {
    let text = '';
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent;
      }
    });
    return text;
  }

  /**
   * Apply auto-direction to elements that directly contain their own text.
   * Skips structural containers (elements whose own text nodes are empty).
   * Respects manually set dir attributes; marks injected attrs with data-profarsi-auto-dir="1".
   * Additionally, when dir is 'rtl', forces IRANSansXV font and remembers previous inline font.
   */
  function applySmartLayout(root) {
    const selectors = 'p, h1, h2, h3, h4, h5, h6, li, td, th, dt, dd, label, span, a, b, strong, div, blockquote, figcaption, summary, caption, button';
    const elements = (root || document).querySelectorAll(selectors);
    elements.forEach(el => {
      // Skip elements where the user manually set dir (not us)
      if (el.hasAttribute('dir') && el.getAttribute('data-profarsi-auto-dir') !== '1') return;
      // Only judge based on direct text nodes, not descendants
      const text = getDirectText(el);
      if (text.trim().length === 0) return;
      const dir = detectDirection(text);

      el.setAttribute('dir', dir);
      el.setAttribute('data-profarsi-auto-dir', '1');
      // For RTL we force right alignment; for LTR we keep site's default alignment.
      if (dir === 'rtl') {
        el.style.textAlign = 'right';
      } else {
        el.style.textAlign = '';
      }

      // When element is RTL, force IRANSansXV and keep previous inline font-family
      if (dir === 'rtl') {
        if (!el.hasAttribute('data-profarsi-prev-font')) {
          el.setAttribute('data-profarsi-prev-font', el.style.fontFamily || '');
        }
        el.style.fontFamily = "IRANSansXV, sans-serif";
      }
    });
  }

  function removeSmartLayout() {
    document.querySelectorAll('[data-profarsi-auto-dir="1"]').forEach(el => {
      el.removeAttribute('dir');
      el.removeAttribute('data-profarsi-auto-dir');
      el.style.textAlign = '';

      if (el.hasAttribute('data-profarsi-prev-font')) {
        const prev = el.getAttribute('data-profarsi-prev-font') || '';
        el.style.fontFamily = prev;
        el.removeAttribute('data-profarsi-prev-font');
      }
    });
  }

  let smartLayoutActive = false;
  let smartLayoutObserver = null;

  function toggleSmartLayout() {
    if (smartLayoutActive) {
      removeSmartLayout();
      if (smartLayoutObserver) {
        smartLayoutObserver.disconnect();
        smartLayoutObserver = null;
      }
      smartLayoutActive = false;
    } else {
      // Ensure IRANSans font-face is defined so IRANSansXV is available for RTL elements
      injectFontFaceOnly();
      applySmartLayout();
      smartLayoutObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                applySmartLayout(node);
              }
            });
          }
        });
      });
      smartLayoutObserver.observe(document.body, { childList: true, subtree: true });
      smartLayoutActive = true;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────

  // Messages from background
  chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
      case "toggle-font":
        toggleFont();
        break;
      case "increase-font-size":
        changeFontSize(1);
        setupFontSizeObserver();
        break;
      case "decrease-font-size":
        changeFontSize(-1);
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
      case "toggle-smart-layout":
        toggleSmartLayout();
        break;
    }
  });
}