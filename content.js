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

// ✅ Observer برای عناصر جدید
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
            // اعمال سایز فونت روی عناصر جدید
            applyFontSizeToElement(node);
            // بررسی فرزندان
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
    // اگر قبلاً سایز فونت تنظیم شده، آن را حفظ کن
    const existingSize = element.style.fontSize;
    if (existingSize) {
      return; // قبلاً تنظیم شده
    }
  }
}

// ✅ سیستم ساده مدیریت سایز فونت
function changeFontSize(delta) {
  // تغییر سایز فونت روی همه عناصر متنی
  const textElements = document.querySelectorAll('p, div, span, a, li, td, th, input, textarea, select, button, label, h1, h2, h3, h4, h5, h6, article, section, nav, aside, header, footer, main');
  
  textElements.forEach(element => {
    const computedStyle = window.getComputedStyle(element);
    const currentSize = parseFloat(computedStyle.fontSize);
    
    if (!isNaN(currentSize) && currentSize > 0) {
      const newSize = Math.max(8, Math.min(32, currentSize + delta));
      element.style.fontSize = newSize + 'px';
    }
  });
}

function resetFontSize() {
  // حذف تمام تنظیمات font-size اضافی
  const textElements = document.querySelectorAll('p, div, span, a, li, td, th, input, textarea, select, button, label, h1, h2, h3, h4, h5, h6, article, section, nav, aside, header, footer, main');
  
  textElements.forEach(element => {
    element.style.fontSize = '';
  });
}

// ✅ پیام‌ها از background
chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.action) {
    case "toggle-font":
      toggleFont();
      break;
    case "increase-font-size":
      changeFontSize(1); // تغییر 1 پیکسلی
      setupFontSizeObserver();
      break;
    case "decrease-font-size":
      changeFontSize(-1); // تغییر 1 پیکسلی
      setupFontSizeObserver();
      break;
    case "reset-font-size":
      resetFontSize();
      if (fontSizeObserver) {
        fontSizeObserver.disconnect();
        fontSizeObserver = null;
      }
      break;
  }
});