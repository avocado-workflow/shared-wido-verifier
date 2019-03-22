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
        default: 
            console.log("No command received. Exiting...");
    }
})();

function fixWido() {
    console.log("Fixing WIDO... ")

    var task = document.querySelector('dynamic-task-view');
    var piKey = task.ProcessInstance._Key;
    var token = localStorage.getItem('accessToken');
    //var baseUrl = document.querySelector('avocado-frame').appMeta.byKey('host');
    var baseUrl = 'https://1-dot-ao2prod-backend.appspot.com/v1'

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

    var task = document.querySelector('dynamic-task-view');
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