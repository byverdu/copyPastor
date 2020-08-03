import { copyPastor, getRandomNumber, msgSenderHandler } from "Lib/helper";
import { CopyPastorItem, CopyPastorMessageEnum } from "Types";

const dates = [1596442964138, 328402800000, 1387065600000];
const date = dates[Math.ceil(Math.random() * dates.length - 1)];
console.log("content date", date);
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
      date: dates[Math.ceil(Math.random() * dates.length - 1)],
      id: getRandomNumber(),
    };
    copyPastor.get(["copyPastorHistory"], ({ copyPastorHistory }) => {
      const newStorage: CopyPastorItem[] = copyPastorHistory
        ? [...copyPastorHistory, newItem]
        : [newItem];

      msgSenderHandler({
        msg: CopyPastorMessageEnum["save-history"],
        payload: newStorage,
      });
    });
  }
});
