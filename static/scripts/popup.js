(function () {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log('popup, request, sender, sendResponse', request, sender, sendResponse)
      if (request.message === "text_selected") {
        document.querySelector('.target').textContent = request.data
      }
    }
  );
  // chrome.runtime.storage.sync.get(['key'], function(result) {
  //   console.log('Value currently is ' + result.key);
  //   document.querySelector('.target').textContent = result.key
  // });

})()
