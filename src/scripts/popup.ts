import { createOrderedList, copyPastor } from "Lib/helper";
import { CopyPastorSyncStorageTypes, CopyPastorMessage } from "Types/index";

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
          msg: `No items found for ${storageType}`,
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
    chrome.runtime.sendMessage("delete", (response) => {
      console.log(response);
      historyContent.innerHTML = "";
    });
  });

  const deleteSelectedHandler = (storage: string[]) => {
    deleteBtn.addEventListener("click", () => {
      const mappedStoredValues = new Map<number, string>([]);
      const itemsToDelete = Array.from(
        document.querySelectorAll("input:checked")
      ).map((item) => Number(item.id));

      storage.forEach((item, index) => mappedStoredValues.set(index, item));
      itemsToDelete.forEach((item) => mappedStoredValues.delete(item));

      copyPastor.set(
        {
          copyPastorHistory: [...mappedStoredValues.values()],
        },
        function () {
          console.log(`copyPastorHistory has been saved`);
          window.location.reload();
        }
      );
    });
  };

  getStorageValues()
    .then((storage: string[]) => {
      if (storage.length > 0) {
        deleteSelectedHandler(storage);
        clearBtn.classList.remove("hidden");
        historyContent.appendChild(createOrderedList(storage));
      } else {
        clearBtn.classList.add("hidden");
      }
    })
    .catch((reason: CopyPastorMessage) => {
      historyContent.textContent = reason.msg;
    });
});
