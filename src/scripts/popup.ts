chrome.runtime.onInstalled.addListener(function() {
  chrome.browserAction.setTitle({title: 'Aloha'})
});

document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.querySelector('.clear')

  document.querySelector('.target').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("static/background.html") });
  })
  clearBtn.addEventListener('click', () => {
    chrome.storage.sync.clear();
    clearBtn.classList.add('hidden');
    document.querySelector('.test').textContent = ''
  })
  chrome.storage.sync.get(['copyPastorHistory'], function(result) {
    if (result && result.copyPastorHistory) {
      clearBtn.classList.remove('hidden')
      console.log('Value currently is ' + result.copyPastorHistory);
      document.querySelector('.test').textContent = result.copyPastorHistory
    } else {
      clearBtn.classList.add('hidden')
    }
  });
});