const targetSelector = '.product-ratings .product-ratings__header';
let injectedElement;

function ce(tagName, attributes = {}, children = [], parent, insertIndex = null) {
  // Create the element
  const element = document.createElement(tagName);

  // Set attributes
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  // Append children (recursively if needed)
  for (const child of children) {
    if (typeof child === "string") {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof HTMLElement) {
      element.appendChild(child);
    } else {
      console.error("Invalid child element:", child);
    }
  }

  if (insertIndex !== null) {
    const parentElement = parent; 
    if (parentElement.children.length > insertIndex) {
      parentElement.insertBefore(element, parentElement.children[insertIndex]);
    } else {
      parentElement.appendChild(element);
    }
  }

  return element;
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        if (!injectedElement) {

          // Create the main container div
          injectedElement = document.createElement('div');
          injectedElement.className = 'spam-preview-and-summary';

          // Create the .spam-preview box
          const spamPreviewBox = document.createElement('div');
          spamPreviewBox.className = 'spam-preview';
          injectedElement.appendChild(spamPreviewBox);
            
            const table = document.createElement('div');
            table.classList.add('spam', 'table');
            table.textContent = 'Element 1';
            spamPreviewBox.appendChild(table);
            table.style.display = 'block';

            const chart = document.createElement('div');
            chart.classList.add('spam', 'chart');
            chart.textContent = 'Element 2';
            spamPreviewBox.appendChild(chart);
            chart.style.display = 'none';  

            const icon1 = document.createElement('i');
            icon1.classList.add('fas', 'fa-table');
            icon1.addEventListener('click', () => {
              table.style.display = 'block';
              chart.style.display = 'none';
            });
            spamPreviewBox.appendChild(icon1);

            const icon2 = document.createElement('i');
            icon2.classList.add('fas', 'fa-chart');
            icon2.addEventListener('click', () => {
              table.style.display = 'none';
              chart.style.display = 'block';
            });
            spamPreviewBox.appendChild(icon2);

          // Create the .summary box
          const summaryBox = document.createElement('div');
          summaryBox.className = 'summary';
          injectedElement.appendChild(summaryBox);

          // Insert the main container after the target element
          targetElement.parentNode.insertBefore(injectedElement, targetElement.nextSibling);

        }
        observer.disconnect(); // Stop observing after insertion
      }
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

// Send the shopid and itemid to the background script
chrome.runtime.sendMessage({ 
  action: "getPageUrl", 
  url: window.location.href 
});

console.log(window.location.href);