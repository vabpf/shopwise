function injectResults(shopid, itemid) {
  // Access the current webpage using content script injection
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      function: () => {
        // Find the target element
        const targetElement = document.querySelector('.product-rating-overview');
        targetElement.textContent = "Hello from the content script!";
        targetElement.classList.add('my-new-element');

        // Create a new element to hold the shop and item IDs
        let resultsElement = document.createElement('div');
        resultsElement.textContent = `Shop ID: ${shopid}, Item ID: ${itemid}`;

        // Insert the results element after the target element
        targetElement.parentNode.insertBefore(resultsElement, targetElement.nextSibling);
      }
    });
  });
}
// skipcq: JS-0241
document.addEventListener('DOMContentLoaded', function() {
  // Get the item and shop ID from the current URL
  // const [shopid, itemid] = get_info();
  // console.log(shopid, itemid);

  // Inject the shop and item IDs into the webpage
  injectResults(122, 123);
});