import { copyPastor } from "Lib/helper";

const deleteHandler = () => copyPastor.remove("copyPastorHistory");

const saveHistoryHandler = (copyPastorHistory) =>
  copyPastor.set({ copyPastorHistory }, function () {
    console.log(`copyPastorHistory length is ${copyPastorHistory.length}`);
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request && request.msg && request.msg === "clear-history") {
    deleteHandler();
    return true;
  }
  if (request && request.msg && request.msg === "save-history") {
    saveHistoryHandler(request.payload);
    return true;
  }
});
