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
      
      :root {
        --profarsi-font-size: 16px;
        --profarsi-font-size-small: 14px;
        --profarsi-font-size-large: 18px;
        --profarsi-font-size-h1: 24px;
        --profarsi-font-size-h2: 20px;
        --profarsi-font-size-h3: 18px;
        --profarsi-font-size-h4: 16px;
        --profarsi-font-size-h5: 14px;
        --profarsi-font-size-h6: 12px;
      }
      
      *:not(i):not(svg):not(path) {
        font-family: 'IRANSansXV' !important;
      }
      
      /* Apply font size to all text elements */
      body, p, div, span, a, li, td, th, input, textarea, select, button, label {
        font-size: var(--profarsi-font-size) !important;
      }
      
      /* Headings */
      h1 { font-size: var(--profarsi-font-size-h1) !important; }
      h2 { font-size: var(--profarsi-font-size-h2) !important; }
      h3 { font-size: var(--profarsi-font-size-h3) !important; }
      h4 { font-size: var(--profarsi-font-size-h4) !important; }
      h5 { font-size: var(--profarsi-font-size-h5) !important; }
      h6 { font-size: var(--profarsi-font-size-h6) !important; }
      
      /* Small text elements */
      small, .small, [class*="small"] {
        font-size: var(--profarsi-font-size-small) !important;
      }
      
      /* Large text elements */
      .large, [class*="large"], [class*="big"] {
        font-size: var(--profarsi-font-size-large) !important;
      }
      
      /* Additional comprehensive selectors */
      article, section, nav, aside, header, footer, main, 
      table, tr, caption, thead, tbody, tfoot,
      form, fieldset, legend, optgroup, option,
      pre, code, kbd, samp, var, mark, time, cite, q, dfn, abbr, acronym,
      blockquote, address, dt, dd, dl, ol, ul, menu,
      figure, figcaption, details, summary, dialog,
      ruby, rt, rp, bdi, bdo, wbr, ins, del, sub, sup,
      canvas, svg, video, audio, track, source, embed, object, param,
      iframe, map, area, picture, source, img,
      meter, progress, output, datalist, keygen,
      article *, section *, nav *, aside *, header *, footer *, main * {
        font-size: var(--profarsi-font-size) !important;
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

// ✅ اعمال فونت روی عنصر خاص با بررسی عمیق
function applyFontToElement(element) {
  if (!element || !element.style) return;
  
  // اعمال فونت خانواده
  element.style.fontFamily = 'IRANSansXV !important';
  
  // اعمال سایز فونت بر اساس نوع عنصر
  const tagName = element.tagName.toLowerCase();
  const classes = element.className || '';
  const id = element.id || '';
  
  // بررسی برای عناصر خاص
  if (tagName === 'h1' || classes.includes('h1') || id.includes('h1')) {
    element.style.fontSize = 'var(--profarsi-font-size-h1) !important';
  } else if (tagName === 'h2' || classes.includes('h2') || id.includes('h2')) {
    element.style.fontSize = 'var(--profarsi-font-size-h2) !important';
  } else if (tagName === 'h3' || classes.includes('h3') || id.includes('h3')) {
    element.style.fontSize = 'var(--profarsi-font-size-h3) !important';
  } else if (tagName === 'h4' || classes.includes('h4') || id.includes('h4')) {
    element.style.fontSize = 'var(--profarsi-font-size-h4) !important';
  } else if (tagName === 'h5' || classes.includes('h5') || id.includes('h5')) {
    element.style.fontSize = 'var(--profarsi-font-size-h5) !important';
  } else if (tagName === 'h6' || classes.includes('h6') || id.includes('h6')) {
    element.style.fontSize = 'var(--profarsi-font-size-h6) !important';
  } else if (tagName === 'small' || classes.includes('small') || id.includes('small')) {
    element.style.fontSize = 'var(--profarsi-font-size-small) !important';
  } else if (classes.includes('large') || classes.includes('big') || id.includes('large') || id.includes('big')) {
    element.style.fontSize = 'var(--profarsi-font-size-large) !important';
  } else {
    element.style.fontSize = 'var(--profarsi-font-size) !important';
  }
  
  // اعمال روی shadow DOM اگر وجود داشته باشد
  if (element.shadowRoot) {
    const shadowElements = element.shadowRoot.querySelectorAll('*');
    shadowElements.forEach(shadowElement => {
      applyFontToElement(shadowElement);
    });
  }
}

// ✅ اعمال فونت روی همه عناصر موجود
function applyFontToAllElements() {
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    applyFontToElement(element);
  });
  
  // اعمال روی iframe ها
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      if (iframe.contentDocument) {
        const iframeElements = iframe.contentDocument.querySelectorAll('*');
        iframeElements.forEach(element => {
          applyFontToElement(element);
        });
      }
    } catch (e) {
      // اگر iframe از domain دیگری باشد، دسترسی نداریم
    }
  });
}

// ✅ سیستم مدیریت سایز فونت بهبود یافته
function changeFontSize(delta) {
  // ابتدا مطمئن شویم که استایل فونت تزریق شده
  injectFontStyle();
  
  // دریافت مقادیر فعلی
  const root = document.documentElement;
  const currentSize = parseInt(getComputedStyle(root).getPropertyValue('--profarsi-font-size')) || 16;
  const newSize = Math.max(8, Math.min(32, currentSize + delta)); // محدود کردن بین 8 تا 32 پیکسل
  
  // محاسبه نسبت تغییر
  const ratio = newSize / currentSize;
  
  // به‌روزرسانی همه متغیرهای CSS
  root.style.setProperty('--profarsi-font-size', newSize + 'px');
  root.style.setProperty('--profarsi-font-size-small', Math.round(14 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-large', Math.round(18 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h1', Math.round(24 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h2', Math.round(20 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h3', Math.round(18 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h4', Math.round(16 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h5', Math.round(14 * ratio) + 'px');
  root.style.setProperty('--profarsi-font-size-h6', Math.round(12 * ratio) + 'px');
  
  // اعمال تغییرات روی همه عناصر موجود
  setTimeout(() => {
    applyFontToAllElements();
  }, 10);
}

function resetFontSize() {
  const root = document.documentElement;
  // حذف تمام تنظیمات custom font size
  root.style.removeProperty('--profarsi-font-size');
  root.style.removeProperty('--profarsi-font-size-small');
  root.style.removeProperty('--profarsi-font-size-large');
  root.style.removeProperty('--profarsi-font-size-h1');
  root.style.removeProperty('--profarsi-font-size-h2');
  root.style.removeProperty('--profarsi-font-size-h3');
  root.style.removeProperty('--profarsi-font-size-h4');
  root.style.removeProperty('--profarsi-font-size-h5');
  root.style.removeProperty('--profarsi-font-size-h6');
}

// ✅ Observer برای عناصر جدید
let fontObserver = null;

function setupFontObserver() {
  if (fontObserver) {
    fontObserver.disconnect();
  }
  
  fontObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // اعمال فونت روی عناصر جدید
            applyFontToElement(node);
            // بررسی فرزندان
            const children = node.querySelectorAll('*');
            children.forEach(child => applyFontToElement(child));
          }
        });
      }
    });
  });
  
  fontObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// ✅ پیام‌ها از background
chrome.runtime.onMessage.addListener((msg) => {
  switch (msg.action) {
    case "toggle-font":
      toggleFont();
      if (document.getElementById("farsiFontStyle")) {
        setupFontObserver();
        // اعمال فونت روی همه عناصر موجود
        setTimeout(() => {
          applyFontToAllElements();
        }, 100);
      } else {
        if (fontObserver) {
          fontObserver.disconnect();
          fontObserver = null;
        }
      }
      break;
    case "increase-font-size":
      changeFontSize(2);
      break;
    case "decrease-font-size":
      changeFontSize(-2);
      break;
    case "reset-font-size":
      resetFontSize();
      // اعمال مجدد فونت روی همه عناصر
      setTimeout(() => {
        applyFontToAllElements();
      }, 100);
      break;
  }
});

// ✅ راه‌اندازی اولیه
document.addEventListener('DOMContentLoaded', () => {
  // اگر فونت فعال است، observer را راه‌اندازی کن
  if (document.getElementById("farsiFontStyle")) {
    setupFontObserver();
    // اعمال فونت روی همه عناصر موجود
    setTimeout(() => {
      applyFontToAllElements();
    }, 100);
  }
});

// ✅ بررسی دوره‌ای برای اطمینان از اعمال فونت
let fontCheckInterval = null;

function startFontCheck() {
  if (fontCheckInterval) {
    clearInterval(fontCheckInterval);
  }
  
  fontCheckInterval = setInterval(() => {
    if (document.getElementById("farsiFontStyle")) {
      // بررسی و اصلاح عناصری که ممکن است فونت خود را تغییر داده باشند
      const allElements = document.querySelectorAll('*');
      allElements.forEach(element => {
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.fontFamily !== 'IRANSansXV') {
          applyFontToElement(element);
        }
      });
    }
  }, 5000); // هر 5 ثانیه بررسی کن
}

function stopFontCheck() {
  if (fontCheckInterval) {
    clearInterval(fontCheckInterval);
    fontCheckInterval = null;
  }
}

// شروع بررسی دوره‌ای
startFontCheck();