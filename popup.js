document.addEventListener('DOMContentLoaded', function() {
    console.log("Extension popup is displayed and loaded...");
    document.querySelector('#fixWido')
        .addEventListener('click', function() {executeOnPage('fixWido')});
    document.querySelector('#deleteMeeting')
        .addEventListener('click', function() {deleteMeeting()});
});

function deleteMeeting() {
    console.log("deleteMeeting wido clicked");
    var r = confirm("Are you sure you want to delete this Meeting completely and unrecoverably???");
    if (r == true) {
        console.log("DANGER! Deleting Process Instance...");
        executeOnPage('delete');
    } else {
        console.log("Huh. Meeting is not deleted.");
    }
}

function executeOnPage(operation) {
    console.log("Command to execute on page: " + operation);

    chrome.tabs.executeScript({
        code: 	"sessionStorage.setItem('chromeadminwidgetoperation','" + operation + "');"
    }, function() {
        chrome.tabs.executeScript({ file: 'injector.js' });
    });
}