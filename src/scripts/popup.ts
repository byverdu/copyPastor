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
  const favsContent = document.querySelector(".favs-content");

  clearBtn.addEventListener("click", (e) => {
    msgSenderHandler(
      { msg: CopyPastorMessageEnum["clear-history"] },
      (response) => {
        const targetElm = e.target as HTMLElement;

        window.location.reload();
        targetElm.classList.add("hidden");
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

          if (storage.length === 1) {
            historyContent.textContent = "No items found for copyPastorHistory";
          } else {
            window.location.reload();
          }
        }
      );
    });
  };

  const handleClickFabsTab = (e) => {
    getStorageValues()
      .then((storage: CopyPastorItem[]) => {
        if (storage.length > 0) {
          const favs = storage.filter((elem) => elem.favorite);
          const targetElm = e.target as HTMLElement;

          clearBtn.classList.remove("hidden");

          favsContent.innerHTML = "";
          historyContent.classList.toggle("hidden");
          favsContent.classList.toggle("hidden");

          if (favs.length > 0) {
            deleteSelectedHandler(favs);
            createOrderedList(favs).forEach(detail => favsContent.appendChild(detail));
          } else {
            favsContent.insertAdjacentHTML(
              "afterbegin",
              "<div>No Favorites saved</div/"
            );
          }

          document.getElementById("tab-history").classList.toggle("active");
          targetElm.classList.toggle("active");
        } else {
          clearBtn.classList.add("hidden");
        }
      })
      .catch((reason: CopyPastorMessage) => {
        historyContent.textContent = reason.payload;
      });
  };

  const handleClickHistoryTab = (e) => {
    getStorageValues()
      .then((history: CopyPastorItem[]) => {
        if (history.length > 0) {
          const targetElm = e.target as HTMLElement;
          clearBtn.classList.remove("hidden");
          deleteSelectedHandler(history);
          createOrderedList(history).forEach(detail => historyContent.appendChild(detail));

          historyContent.innerHTML = "";
          historyContent.classList.toggle("hidden");
          favsContent.classList.toggle("hidden");
          createOrderedList(history).forEach(detail => historyContent.appendChild(detail));
          document.getElementById("tab-favs").classList.toggle("active");
          targetElm.classList.toggle("active");
        } else {
          clearBtn.classList.add("hidden");
        }
      })
      .catch((reason: CopyPastorMessage) => {
        historyContent.textContent = reason.payload;
      });
  };

  document
    .getElementById("tab-favs")
    .addEventListener("click", handleClickFabsTab);

  document
    .getElementById("tab-history")
    .addEventListener("click", handleClickHistoryTab);

  getStorageValues()
    .then((history: CopyPastorItem[]) => {
      if (history.length > 0) {
        clearBtn.classList.remove("hidden");
        deleteSelectedHandler(history);
        createOrderedList(history).forEach(detail => historyContent.appendChild(detail));
      } else {
        clearBtn.classList.add("hidden");
      }
    })
    .catch((reason: CopyPastorMessage) => {
      historyContent.textContent = reason.payload;
    });
});
