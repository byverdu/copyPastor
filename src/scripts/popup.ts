import {
  createOrderedList,
  copyPastor,
  msgSenderHandler,
  mappedStoredValues,
} from "Lib/helper";
import {
  CopyPastorSyncStorageTypes,
  CopyPastorMessage,
  CopyPastorMessageEnum,
  CopyPastorItem,
} from "Types/index";

chrome.runtime.onInstalled.addListener(function () {
  chrome.browserAction.setTitle({ title: "Aloha" });
});

function getStorageValues(
  storageType: CopyPastorSyncStorageTypes = "copyPastorHistory"
) {
  return new Promise((resolve, reject: (reason: CopyPastorMessage) => void) => {
    copyPastor.get([storageType], function (result) {
      if (result && result.copyPastorHistory) {
        resolve(result.copyPastorHistory);
      } else {
        reject({
          type: `${storageType} Empty`,
          msg: CopyPastorMessageEnum.error,
          payload: `No items found for ${storageType}`,
        });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const clearBtn = document.querySelector(".clear-history");
  const deleteBtn = document.querySelector(".delete-selected");
  const historyContent = document.querySelector(".history-content");

  clearBtn.addEventListener("click", () => {
    msgSenderHandler(
      { msg: CopyPastorMessageEnum["clear-history"] },
      (response) => {
        window.location.reload();
      }
    );
  });

  const deleteSelectedHandler = (storage: CopyPastorItem[]) => {
    deleteBtn.addEventListener("click", () => {
      const mappedStored = mappedStoredValues(storage);
      const itemsToDelete = Array.from(
        document.querySelectorAll("input:checked")
      ).map((item) => item.id);

      itemsToDelete.forEach((item) => mappedStored.delete(item));

      copyPastor.set(
        {
          copyPastorHistory: [...mappedStored.values()],
        },
        function () {
          console.log(`copyPastorHistory has been saved`);
          window.location.reload();
        }
      );
    });
  };

  getStorageValues()
    .then((storage: CopyPastorItem[]) => {
      if (storage.length > 0) {
        deleteSelectedHandler(storage);
        clearBtn.classList.remove("hidden");
        historyContent.appendChild(createOrderedList(storage));
      } else {
        clearBtn.classList.add("hidden");
      }
    })
    .catch((reason: CopyPastorMessage) => {
      historyContent.textContent = reason.payload;
    });
});
