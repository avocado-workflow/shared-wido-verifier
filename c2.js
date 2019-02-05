console.log("Script to fix wido is injected. Let's do our magic now...");

(function() {

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
                myArticle.innerHTML = text;
            });
            .catch(function(res) { console.log(res) });
        }());
});