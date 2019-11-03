

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log('content, request, sender, sendResponse', request, sender, sendResponse)
      if (request.message === "text_selected") {

        chrome.runtime.sendMessage({"message": "text_selected_send", "data": request.data});
      }
    }
  );