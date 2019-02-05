console.log("Injecting script into the page...");

var s = document.createElement('script');
s.src = chrome.extension.getURL('c2.js');
s.onload = function() {
    this.remove();
};

(document.head || document.documentElement).appendChild(s);