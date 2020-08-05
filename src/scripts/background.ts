import { copyPastor, msgReceiverHandler, mappedStoredValues } from "Lib/helper";
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

const setFavoriteHandler = async (
  id: string
): Promise<{ msg: string } | undefined> =>
  new Promise((resolve) =>
    copyPastor.get(["copyPastorHistory"], ({ copyPastorHistory }) => {
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
