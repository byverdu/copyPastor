import { copyPastor, msgReceiverHandler } from "Lib/helper";
import { CopyPastorItem, CopyPastorMessageEnum } from "Types";

const clearHistoryHandler = () => copyPastor.remove("copyPastorHistory");

const saveHistoryHandler = (
  copyPastorHistory: CopyPastorItem[],
  callback: () => void
) =>
  copyPastor.set({ copyPastorHistory }, () => {
    console.log(`copyPastorHistory length is ${copyPastorHistory.length}`);
    setTimeout(callback, 2000);
  });

msgReceiverHandler((request, sender, sendResponse) => {
  if (
    request &&
    request.msg &&
    request.msg === CopyPastorMessageEnum["clear-history"]
  ) {
    clearHistoryHandler();
    return true;
  }
  if (
    request &&
    request.msg &&
    request.msg === CopyPastorMessageEnum["save-history"]
  ) {
    chrome.browserAction.setBadgeText({ text: "+ 1" });
    chrome.browserAction.setBadgeBackgroundColor({ color: "#00A86B" });

    saveHistoryHandler(request.payload, () =>
      chrome.browserAction.setBadgeText({ text: "" })
    );
    return true;
  }
});
