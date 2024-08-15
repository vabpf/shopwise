chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleVisibility') {
    chrome.storage.local.get(['elementVisible'], (result) => {
      const isVisible = result.elementVisible || false;
      chrome.storage.local.set({ elementVisible: !isVisible });
      sendResponse({ visibility: !isVisible });
    });
    return true; // Indicate asynchronous response
  }
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) {

    var url = tab.url;
    
    function extractNumbersFromLink(link) {
      const parts = link.split('-i.')[1].split('?');
      const [shopid, itemid] = parts[0].split('.');
      return [shopid, itemid];
    }

    try {
        const [shopid, itemid] = extractNumbersFromLink(url);
        console.log('Shop ID:', shopid, 'Item ID:', itemid);

        // Send shopid & itemid to API
        sendDataToAPI(shopid, itemid); 

    } catch (error) {
        console.log('Error:', error);
    }
  }
});

async function sendDataToAPI(shopid, itemid) {
  try {
    const response = await fetch("http://localhost:8000/fetch_reviews", { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ shopid: shopid, itemid: itemid }) 
    });

    const data = await response.json();
    if (response.ok) {
      console.log("Data fetched successfully");
      // Process the fetched data from the API response
    } else {
      console.error("Error fetching data:", data);
    }
  } catch (error) {
    console.error(error);
  }
}
