import { copyPastor, msgReceiverHandler, mappedStoredValues } from "Lib/helper";
import { CopyPastorItem, CopyPastorMessageEnum } from "Types";

const clearHistoryHandler = () => copyPastor.remove("copyPastorHistory");

const saveHistoryHandler = (
  payload: CopyPastorItem,
  callback: () => void
) => {
  copyPastor.get("copyPastorHistory", ({ copyPastorHistory }) => {
    const newStorage: CopyPastorItem[] = copyPastorHistory
      ? [...copyPastorHistory, payload]
      : [payload];

    copyPastor.set({ copyPastorHistory: newStorage }, () => setTimeout(callback, 2000));
  });
}

const setFavoriteHandler = async (
  id: string
): Promise<{ msg: string } | undefined> =>
  new Promise((resolve) =>
    copyPastor.get("copyPastorHistory", ({ copyPastorHistory }) => {
      const mappedStored = mappedStoredValues(copyPastorHistory);
      const itemToEdit = mappedStored.get(id);

      if (itemToEdit) {
        const favValue = !itemToEdit.favorite;
        mappedStored.get(id).favorite = favValue;

        const resp = favValue ? { msg: "set-fav" } : { msg: "unset-fav" };

        copyPastor.set({ copyPastorHistory: [...mappedStored.values()] }, () =>
          resolve(resp)
        );
      } else {
        copyPastor.set({ copyPastorHistory }, () => resolve(undefined));
      }
    })
  );

msgReceiverHandler((request, sender, sendResponse) => {
  if (
    request &&
    request.msg &&
    request.msg === CopyPastorMessageEnum["clear-history"]
  ) {
    clearHistoryHandler();
    sendResponse({ cleared: true });
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
  if (
    request &&
    request.msg &&
    request.msg === CopyPastorMessageEnum["set-favorite"]
  ) {
    setFavoriteHandler(request.payload).then((resp) => sendResponse(resp));
    return true;
  }
});


function installScript() {
  chrome.tabs.query({}, tabs => {
    const contentjsFile = chrome.runtime.getManifest().content_scripts[0].js[0]
    tabs.forEach(tab => {
      chrome.tabs.executeScript(tab.id, { file: `./${contentjsFile}` }, (result) => {
        console.log(result)

        if (chrome.runtime.lastError) {
          return
        }
      })
    })
  })
}

// workaround to be able to use extension for old opened tabs
// after the extension is installed. For those tabs an error will be thrown in the console
// due to the chrome.runtime.id has changed after updating the extension
chrome.runtime.onInstalled.addListener(installScript)
