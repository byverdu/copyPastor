import {
  copyPastor,
  getRandomNumber,
  msgSenderHandler,
  getTimestamp,
} from "Lib/helper";
import { CopyPastorItem, CopyPastorMessageEnum } from "Types";

document.addEventListener("copy", () => {
  const selectedText =
    document.getSelection().type === "Range"
      ? document.getSelection().toString()
      : undefined;
  const { href } = location;

  if (selectedText) {
    const newItem: CopyPastorItem = {
      href,
      copyText: selectedText,
      date: getTimestamp(),
      id: getRandomNumber(),
      favorite: false,
    };
    try {
      copyPastor.get("copyPastorHistory", ({ copyPastorHistory }) => {
        const newStorage: CopyPastorItem[] = copyPastorHistory
          ? [...copyPastorHistory, newItem]
          : [newItem];

        msgSenderHandler({
          msg: CopyPastorMessageEnum["save-history"],
          payload: newStorage,
        });
      });
    } catch (e) {
      copyPastor.set({ copyPastorHistory: [newItem] }, () => {
        msgSenderHandler({
          msg: CopyPastorMessageEnum["save-history"],
          payload: newItem,
        });
      })
    }
  }
});
