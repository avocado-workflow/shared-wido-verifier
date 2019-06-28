console.log("Admin Widget Script is injected. Let's see what we can do here...");

(function() {
    let command = sessionStorage.getItem('chromeadminwidgetoperation');
    console.log("operation to execute:" + command);

    switch(command) {
        case 'fixWido' : 
            fixWido();
            break;
        case 'delete' :
            deleteProcessInstance();
            break;
        case 'generateMinutesReport':
            generateMinutesReport();
            break;
        case 'showPublishedItemMgmtControls':
            showPublishedItemMgmtControls();
            break;
        default: 
            console.log("No command recognized: '"+ command +"'. Exiting...");
    }
})();

function showPublishedItemMgmtControls() {
    var itemPopups = document.querySelectorAll("awi-agenda-item-popup");

    if(!itemPopups || !itemPopups.length) {
        console.log("NO attachments grid found. Is Published Item popup opened up?");
        return;
    }

    var itemPopup = itemPopups[itemPopups.length - 1];
    
    var goToFirebaseBtn =document.createElement("button");
    goToFirebaseBtn.innerHTML = "Open in Firebase Console...";
    goToFirebaseBtn.addEventListener("click", function() {
        window.open("https://console.firebase.google.com/project/ao2prod-backend" +
            "/database/ao2prod-backend/data" +
            itemPopup.firebasePath,
            '_blank');
    });
    
    itemPopup.querySelector('iron-icon[id=paperClipIcon]').parentNode.append(goToFirebaseBtn);

    var attachmentsGrid = itemPopup.querySelector("awi-grid[label=Attachments]");
    if (attachmentsGrid) {
        var rows = attachmentsGrid.querySelectorAll("awi-grid-row");

        rows.forEach(function(row) {
            var btn = document.createElement("button");
            btn.innerHTML = "x";
            btn.addEventListener ("click", function() {
                var fileId = row.item.AttachmentDoc.UploadedFileId;

                var form = document.querySelector('dynamic-task-view');
                var piKey = form.ProcessInstance._Key;
                var token = localStorage.getItem('accessToken');
                var itemKey = itemPopup.firebasePath.split("/_INTERNAL_ITEMS/")[1];
                    
                var baseUrl = document.querySelector('avocado-frame').appMeta.byKey('host');
                
                fetch(baseUrl + "v1/admin-toolbox/meeting-mgmt/" + piKey + /item/ + itemKey + "/attachments/" + fileId, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    method: "DELETE"
                })
                .then(function(res) {
                    return res.text().then(function(text) {
                        console.log("Results: ");
                        console.log(text);
                    });
                })
                .catch(function(res) { console.log(res) });
            });
            row.querySelectorAll("awi-grid-cell")[1].append(btn);
        });
    }

    var newAttachmentName = document.createElement('input');
    newAttachmentName.type = "text";
    var newAttachmentInput = document.createElement('input');
    newAttachmentInput.type="file";

    var addNewAttachmentBtn =document.createElement("button");
    addNewAttachmentBtn.innerHTML = "Add New...";
    addNewAttachmentBtn.addEventListener("click", function() {

        var form = document.querySelector('dynamic-task-view');
        var piKey = form.ProcessInstance._Key;
        var token = localStorage.getItem('accessToken');

        var itemKey = itemPopup.firebasePath.split("/_INTERNAL_ITEMS/")[1];
            
        var baseUrl = document.querySelector('avocado-frame').appMeta.byKey('host');

        var file = newAttachmentInput.files[0];
        console.log("about to upload file: " + file);

        var formData = new FormData();
        formData.append("name", newAttachmentName.value);
        formData.append("file", file);

        fetch(baseUrl + "v1/admin-toolbox/meeting-mgmt/" + piKey + /item/ + itemKey + "/attachments", { // Your POST endpoint
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData // This is your file object
          }).then(
            response => response.json() // if the response is a JSON object
          ).then(
            success => console.log(success) // Handle the success response object
          ).catch(
            error => console.log(error) // Handle the error response object
          );
    });
    
    var recommendedMotionEditor = itemPopup.querySelector("awi-editor[label='Recommended Motion']");

    recommendedMotionEditor.parentNode.insertBefore(addNewAttachmentBtn, recommendedMotionEditor);
    recommendedMotionEditor.parentNode.insertBefore(newAttachmentInput, addNewAttachmentBtn);
    recommendedMotionEditor.parentNode.insertBefore(newAttachmentName, newAttachmentInput);
}

function generateMinutesReport() {
    var task = document.querySelector('dynamic-task-view') || document.querySelector('history-task-view');

    var piKey = task.ProcessInstance._Key;
    var token = localStorage.getItem('accessToken');
    //var baseUrl = document.querySelector('avocado-frame').appMeta.byKey('host');
    var baseUrl = 'https://1-dot-ao2prod-backend.appspot.com/v1'
    console.log("ProcessInstance Key:", piKey);

    var requestBody = []
    fetch(baseUrl + "/admin-toolbox/process-instance/" + piKey + "/reports", {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            method: "POST",
            body: "code=MINUTES_REPORT_DOC"
        })
        .then(function(res) {
            return res.text().then(function(text) {
                console.log("Results: ");
                console.log(text);
                alert("Report generation completed. Please refresh your page.");
            });
        })
        .catch(function(res) { console.log(res) });
    return;
}

function fixWido() {
    console.log("Fixing WIDO... ")

    var task = document.querySelector('dynamic-task-view');
    var piKey = task.ProcessInstance._Key;
    var token = localStorage.getItem('accessToken');
    //var baseUrl = document.querySelector('avocado-frame').appMeta.byKey('host');
    var baseUrl = 'https://dev-dot-ao2prod-backend.appspot.com/v1'

    fetch(baseUrl + "/admin-toolbox/rebuild-shared-wido/" + piKey, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: "POST"
        })
        .then(function(res) {
            return res.text().then(function(text) {
                console.log("Fixing results: ");
                console.log(text);
            });
        })
        .catch(function(res) { console.log(res) });
}


function deleteProcessInstance() {
    console.log("deleting process instance... ");

    var task = document.querySelector('dynamic-task-view') || document.querySelector('history-task-view');
    var piKey = task.ProcessInstance._Key;
    var token = localStorage.getItem('accessToken');
    var baseUrl = 'https://1-dot-ao2prod-backend.appspot.com/v1'

    document.querySelector('main-container').$.modal.$['generic-modal'].close();
    
    task.fire('show-spinner');
    
    fetch(baseUrl + "/admin-toolbox/process-instance-mgmt/" + piKey, {
            headers: {
                'Authorization': 'Bearer ' + token
            },
            method: "DELETE"
        })
        .then(function(res) {
            return res.text().then(function(text) {
                console.log("Results: ");
                console.log(text);
                document.querySelector('dynamic-task-view').fire('change-route', '/meetings');
            });
        })
        .catch(function(res) { console.log(res) });

}