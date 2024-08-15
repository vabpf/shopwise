import Chart from 'chart.js/auto';

console.log(Chart);
console.log('load module ok')
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

function createTableFromJSON(jsonData) {
  // Create table element
  const table = document.createElement('table');
  table.classList.add('spam', 'table', 'data-table');
  const colgroup = document.createElement('colgroup');

  // Add table header
  const header = document.createElement('thead');
  const headerRow = document.createElement('tr'); 
  for (const key in jsonData[0]) {
    const col = document.createElement('col');
    const headerCell = document.createElement('th');
    headerCell.textContent = key;
    // headerCell.addEventListener('click', () => sortTable(key));
    headerRow.appendChild(headerCell);
    colgroup.appendChild(col);
  }
  header.appendChild(headerRow);
  table.appendChild(header);
  table.appendChild(colgroup);

  // Add table rows
  const body = document.createElement('tbody');
  jsonData.forEach(item => {
    const row = document.createElement('tr');
    for (const key in item) {
      const cell = document.createElement('td');
      cell.textContent = item[key];
      row.appendChild(cell);
    }
    body.appendChild(row);
  });
  table.appendChild(body);
 
  return table;
}

function pieChartJS(jsonData, parent) {
  // Chart.js is now available globally as 'Chart'
  const canvas = document.createElement('canvas');
  parent.appendChild(canvas)

  const labels = Object.keys(jsonData);
  const data = Object.values(jsonData);

  let myChart = new Chart(canvas, {
    type: 'pie',
    data: {
      datasets: [{
        data: data,
        backgroundColor: ['#FB3640', '#EFCA08']
      }],
      labels: labels
    },
    options: {
      // responsive: true,
      plugins: {
        legend: {
          position: 'right' // Set legend position to right
        }
      }
    }
  });

};

// Example usage:
const jsonData = [  
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
  { "name": "John Doe", "age": 30 },
  { "name": "Jane Smith", "age": 25 },
  { "name": "Peter Jones", "age": 40 },
];

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const targetElement = document.querySelector(targetSelector);
      if (targetElement) {
        if (!injectedElement) {
          
          injectedElement = ce('div', { class: 'spam-preview-and-summary' }, [
            ce('div', { class: 'spam-preview' }),
            ce('div', { class: 'summary' })
          ]);
          
          // spam preview
          const table = ce('div', { class: 'spam table' }, [
            ce('span', { class: 'spam table title' }, ['Spam Preview Table']),
          ], injectedElement.children[0], -1);
          table.style.display = 'block';
          const chart = ce('div', { class: 'spam chart' }, ['Spam Proportion Chart'], injectedElement.children[0], -1);
          chart.style.display = 'none';
          
          const icon1 = ce('i', { class: 'fas fa-table'}, [], injectedElement.children[0], -1);
          icon1.addEventListener('click', () => {
            table.style.display = 'block';
            chart.style.display = 'none';
          });
          
          const icon2 = ce('i', { class: 'fas fa-chart'}, [], injectedElement.children[0], -1);
          icon2.addEventListener('click', () => {
            table.style.display = 'none';
            chart.style.display = 'block';
          });
          
          const table_ = createTableFromJSON(jsonData);
          table.appendChild(table_);
          
          pieChartJS({"spam":30, "non-spam":10}, chart);
          
          // summary
          const summary = ce('div', { class: 'summary-box' }, [
            ce('span', { class: 'summary-box title' }, ['Summary']),
          ], injectedElement.children[1], -1);
          
          ce('div', { class: 'summary-box display' }, [], summary, -1);

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