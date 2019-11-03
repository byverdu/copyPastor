// A generic onclick callback function.
// https://developer.chrome.com/extensions/devguide
//https://dzone.com/articles/building-a-chrome-extension-in-5-steps
function genericOnClick(info, tab) {
  // console.log("item " + info.menuItemId + " was clicked");
  console.log("info: ",  info);
  console.log("tab: " ,  tab);
  chrome.runtime.sendMessage({"message": "text_selected", "data": info.selectionText});
  tab.title  = 'xoxo'
  // chrome.storage.sync.set({key: info.selectionText}, function() {
  //   console.log('info.selectionText is set to ' + info.selectionText);
  // });

}

// info: {
//   "editable":false,
//   "frameId":0,
//   "menuItemId":28,
//   "pageUrl":"chrome://extensions/",
//   "selectionText":"what"
// }

// Create one test item for each context type.
var contexts = ["page", "selection", "link", "editable", "image", "video",
  "audio"
];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({
    "title": title,
    "contexts": [context],
    "onclick": genericOnClick
  });
  console.log("'" + context + "' item:" + id);
}