import {
  getRandomNumber,
  msgSenderHandler,
  getTimestamp,
} from "Lib/helper";
import { CopyPastorMessageEnum } from "Types";

// Content script
function main() {
  // Set up content script
  document.addEventListener("copy", () => {
    const selectedText =
      document.getSelection().type === "Range"
        ? document.getSelection().toString()
        : undefined;
    const { href } = location;

    if (selectedText) {
      msgSenderHandler({
        msg: CopyPastorMessageEnum["save-history"],
        payload: {
          href,
          copyText: selectedText,
          date: getTimestamp(),
          id: getRandomNumber(),
          favorite: false,
        },
      });
    }
  });
}

function destructor() {
  // Destruction is needed only once
  document.removeEventListener(destructionEvent, destructor);
  // Tear down content script: Unbind events, clear timers, restore DOM, etc.
}

var destructionEvent = 'destructmyextension_' + chrome.runtime.id;
// Unload previous content script if needed
document.dispatchEvent(new CustomEvent(destructionEvent));
document.addEventListener(destructionEvent, destructor);
main();
