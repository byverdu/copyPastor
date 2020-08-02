import { CopyPastorSyncStorage, CopyPastorSyncStorageTypes } from "Types/index";

export const copyPastor = {
  set(items: CopyPastorSyncStorage, callback?: () => void) {
    return typeof callback !== "undefined"
      ? chrome.storage.sync.set(items, callback)
      : chrome.storage.sync.set(items);
  },
  get(
    items: CopyPastorSyncStorageTypes[],
    callback: (result: CopyPastorSyncStorage) => void
  ) {
    return chrome.storage.sync.get(items, callback);
  },
  clear() {
    return chrome.storage.sync.clear();
  },
  remove(key: string | string[], callback?: () => void) {
    return chrome.storage.sync.remove(key, callback);
  },
};

type ClickHandler = (e: MouseEvent) => void;

const createBtn = (
  text: string,
  id: string,
  clickHandler: ClickHandler
): HTMLButtonElement => {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.id = id;
  btn.addEventListener("click", clickHandler);

  return btn;
};

const createSpan = (text: string): HTMLSpanElement => {
  const span = document.createElement("span");
  span.addEventListener("click", (e: MouseEvent) => {
    e.preventDefault();
    // text selection
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(range);
    // copy to clipboard
    document.execCommand("copy");
  });
  span.textContent = text;

  return span;
};

const createInput = (index: string): HTMLInputElement => {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", index);

  return input;
};

export const createOrderedList = (entries: string[]): HTMLOListElement => {
  const ol = document.createElement("ol");
  ol.classList.add("history-list");

  entries.forEach((entry, index) => {
    const li = document.createElement("li");
    li.classList.add("history-list-item");

    const span = createSpan(entry);
    const input = createInput(`${index}`);

    li.appendChild(input);
    li.appendChild(span);

    ol.appendChild(li);
  });

  return ol;
};
