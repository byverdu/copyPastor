import { copyPastor } from "Lib/helper";
import { CopyPastorItem } from "Types";

const deleteHandler = () => copyPastor.remove("copyPastorHistory");

const saveHistoryHandler = (
  copyPastorHistory: CopyPastorItem[],
  callback: () => void
) =>
  copyPastor.set({ copyPastorHistory }, () => {
    console.log(`copyPastorHistory length is ${copyPastorHistory.length}`);
    setTimeout(callback, 2000);
  });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request && request.msg && request.msg === "clear-history") {
    deleteHandler();
    return true;
  }
  if (request && request.msg && request.msg === "save-history") {
    chrome.browserAction.setBadgeText({ text: "+ 1" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#00A86B" });

    saveHistoryHandler(request.payload, () =>
      chrome.browserAction.setBadgeText({ text: "" })
    );
    return true;
  }
});
