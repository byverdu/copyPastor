import {
  createOrderedList,
  msgSenderHandler,
  mappedStoredValues,
} from "Lib/helper";
import {
  CopyPastorMessage,
  CopyPastorItem,
  TabsTypes,
  CopyPastorMessageType
} from "Types/index";

function getStorageValues() {
  return new Promise((resolve, reject: (reason: CopyPastorMessage) => void) => {
    msgSenderHandler(
      { msg: 'get-storage' },
      (response) => {
        if (response && response.copyPastorHistory) {
          resolve(response.copyPastorHistory);
        } else {
          reject({
            type: 'copyPastorHistory Empty',
            msg: 'error',
            payload: 'No items found for copyPastorHistory',
          });
        }
      }
    );
  });
}

function deleteItemsHandler(msg: CopyPastorMessageType) {
  msgSenderHandler(
    { msg },
    response => {
      if (response) {
        window.location.reload()
      }
    }
  );
}

const deleteActions: CopyPastorMessageType[] = [
  'clear-history',
  'delete-favs',
  'delete-no-favs',
]

const tabsContentTypes: Array<TabsTypes> = ['favs', 'history'];

document.addEventListener("DOMContentLoaded", () => {
  const historyContent = document.querySelector(".history-content");
  const favsContent = document.querySelector(".favs-content");
  const deleteBtn = document.querySelector(".delete-selected");

  deleteActions.forEach(selector => {
    document.querySelector(`.${selector}`)
      .addEventListener('click', () => deleteItemsHandler(selector), { once: true })
  });

  const clickTabsHandler = (event: Event) => {
    getStorageValues()
      .then((storage: CopyPastorItem[]) => {
        const targetElm = event.target as HTMLElement;
        const currentTabType = targetElm.dataset.tabType;
        const previousTabType = tabsContentTypes.find(item => item !== currentTabType)
        const tabsItem = currentTabType === 'favs' ?
          storage.filter((elem) => elem.favorite) :
          storage;
        const tabsContent: { [key in TabsTypes]: Element } = {
          favs: favsContent,
          history: historyContent
        }
        const actualTabContent = tabsContent[currentTabType]
        const otherTabContent = tabsContent[previousTabType]

        actualTabContent.innerHTML = "";
        actualTabContent.classList.toggle("hidden");
        otherTabContent.classList.toggle("hidden");

        if (tabsItem.length > 0) {
          deleteSelectedHandler(tabsItem);
          createOrderedList(tabsItem).forEach(detail => actualTabContent.appendChild(detail));
        } else {
          actualTabContent.insertAdjacentHTML(
            "afterbegin",
            `<div>No ${currentTabType} saved</div>`
          );
        }

        document.getElementById(`tab-${currentTabType}`).classList.toggle("active");
        targetElm.classList.toggle("active");

      })
      .catch((reason: CopyPastorMessage) => {
        historyContent.textContent = reason.payload;
      });
  }

  const deleteSelectedHandler = (storage: CopyPastorItem[]) => {
    deleteBtn.addEventListener("click", () => {
      const mappedStored = mappedStoredValues(storage);
      const itemsToDelete = Array.from(
        document.querySelectorAll("input:checked")
      ).map((item) => item.id);

      itemsToDelete.forEach((item) => mappedStored.delete(item));

      msgSenderHandler(
        { msg: 'delete-selected', payload: [...mappedStored.values()] },
        (response) => {
          if (response) {
            console.log(`copyPastorHistory has been saved`);

            if (storage.length === 1) {
              historyContent.textContent = "No items found for copyPastorHistory";
            } else {
              window.location.reload();
            }
          }
        }
      );
    });
  };

  document
    .querySelectorAll('[data-tabs]')
    .forEach(elem => elem.addEventListener('click', clickTabsHandler))

  getStorageValues()
    .then((history: CopyPastorItem[]) => {
      if (history.length > 0) {
        deleteSelectedHandler(history);
        createOrderedList(history).forEach(detail => historyContent.appendChild(detail));
      } else {
        historyContent.textContent = "No items found for copyPastorHistory";
      }
    })
    .catch((reason: CopyPastorMessage) => {
      historyContent.textContent = reason.payload;
    });
});
