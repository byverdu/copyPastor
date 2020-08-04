import {
  CopyPastorSyncStorage,
  CopyPastorSyncStorageTypes,
  CopyPastorItem,
  CopyPastorMessage,
  CopyPastorMessageEnum,
} from "Types/index";

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

export const getRandomNumber = (qtty: number = 5): string => {
  const array = new Uint32Array(qtty);
  return window.crypto.getRandomValues(array).join("-");
};

const createInput = (id: string): HTMLInputElement => {
  const input = document.createElement("input");
  input.setAttribute("type", "checkbox");
  input.setAttribute("id", id);

  return input;
};

const createLinkImg = (href: string): HTMLAnchorElement => {
  const img = new Image();
  const link = document.createElement("a");

  img.src = "../images/link.svg";
  img.classList.add("link-img");

  link.href = href;
  link.target = "_blank";
  link.classList.add("link");
  link.title = `visit ${href}`;
  link.appendChild(img);

  return link;
};

const createFavStar = (id: string, favorite: boolean): SVGElement => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  use.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "../images/star.svg/#fav-star"
  );

  svg.appendChild(use);
  svg.classList.add("fav-star", "link-img");
  use.classList.toggle("selected", favorite);

  svg.addEventListener("click", (e) => {
    msgSenderHandler(
      {
        msg: CopyPastorMessageEnum["set-favorite"],
        payload: id,
      },
      (resp) => {
        if (resp.msg === "set-fav") {
          (e.target as SVGElement).classList.add("selected");
        }

        if (resp.msg === "unset-fav") {
          (e.target as SVGElement).classList.remove("selected");
        }
      }
    );
  });

  return svg;
};

export const getTimestamp = (): number => new Date().setHours(22, 0, 0, 0);

export const mappedStoredValues = (
  storage: CopyPastorItem[]
): Map<string, CopyPastorItem> => {
  const mappedStoredValues = new Map<string, CopyPastorItem>([]);

  storage.forEach((item) => mappedStoredValues.set(item.id, item));

  return mappedStoredValues;
};

const createDateHeader = (date: string): HTMLHeadingElement => {
  const header = document.createElement("h5");
  header.textContent = date;

  return header;
};

export const createOrderedList = (
  entries: CopyPastorItem[]
): HTMLDivElement => {
  const dates = [...new Set(entries.map((item) => item.date))].sort(
    (a, b) => b - a
  );
  const entriesCopy = entries.slice();
  const div = document.createElement("div");

  while (dates.length > 0) {
    const dateToString = new Date(dates[0]).toDateString();
    const groupedByDate = entriesCopy.filter(({ date }) => date === dates[0]);
    const ol = document.createElement("ol");
    ol.classList.add("history-list");
    const header = createDateHeader(dateToString);

    groupedByDate.forEach((entry, index) => {
      const li = document.createElement("li");
      li.classList.add("history-list-item");

      const span = createSpan(entry.copyText);
      const input = createInput(entry.id);
      const img = createLinkImg(entry.href);
      const favStar = createFavStar(entry.id, entry.favorite);

      li.appendChild(input);
      li.appendChild(img);
      li.appendChild(favStar);
      li.appendChild(span);

      ol.appendChild(li);
    });

    div.appendChild(header);
    div.appendChild(ol);

    dates.splice(0, 1);
  }

  return div;
};

export const msgReceiverHandler = (
  callback: (
    request: CopyPastorMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (resp: any) => void
  ) => void
) => chrome.runtime.onMessage.addListener(callback);

export const msgSenderHandler = (
  { msg, payload, type }: CopyPastorMessage,
  callback?: (resp: any) => void
) =>
  chrome.runtime.sendMessage(
    {
      msg,
      payload,
      type,
    },
    callback
  );
