document.addEventListener('DOMContentLoaded', function() {
    console.log("Extension popup is displayed and loaded...");
    document.querySelector('#fixWido').addEventListener('click', fixWido);
});

function fixWido() {
    console.log("fix wido clicked");
    chrome.tabs.executeScript({
        file: 'injector.js'
    });
}