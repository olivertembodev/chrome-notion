function handleUpdated(tabId, changeInfo, tabInfo) {
  if (changeInfo.url) {
    chrome.tabs.sendMessage(tabId, {
      message: 'hello!',
      url: changeInfo.url,
    })
  }
}

chrome.tabs.onUpdated.addListener(handleUpdated)
