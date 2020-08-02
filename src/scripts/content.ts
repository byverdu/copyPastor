import { copyPastor } from "Lib/helper";

document.addEventListener("copy", () => {
  const selectedText =
    document.getSelection().type === "Range"
      ? document.getSelection().toString()
      : undefined;

  if (selectedText) {
    copyPastor.get(["copyPastorHistory"], ({ copyPastorHistory }) => {
      const newStorage = copyPastorHistory
        ? [...copyPastorHistory, selectedText]
        : [selectedText];

      copyPastor.set({ copyPastorHistory: newStorage }, function () {
        console.log(`copyPastorHistory length is ${newStorage.length}`);
      });
    });
  }
});
