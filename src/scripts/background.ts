import { copyPastor } from "Lib/helper";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request === "delete") {
    copyPastor.remove("copyPastorHistory");
    return true;
  }
});
