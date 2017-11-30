/**
 * Created by framgia on 27/11/2017.
 */

var apiOptions = {
    apiUrl: "https://sheets.googleapis.com/v4/spreadsheets",
    sheetId: "1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I"
};

var api = api(apiOptions);

$(document).ready(function () {
    $("#signin").click(function () {
        auth.getToken(function(err, token) {
            if (err) {
                console.log("Can't get token from your ID");
            }

            apiOptions.accessToken = token;
            disableSignInBtn();
            enableExportBtn();
            chrome.cookies.getAll({}, function(cookies) {
                cookies.forEach(function (cookie) {
                    if (cookie.name == "_wsm_02_session") {
                        console.log("_wsm_02_session: "+cookie.value);
                        $.get('https://wsm.framgia.vn/vi/dashboard/user_timesheets?year=2017&month=11', function (data) {
                            console.log(data);
                        });
                    };
                });
            });
            

        })
    });

    $("#export").click(function () {
        let range = "Nguyen Van Ngoc!D4:D9";
        let data = {"range":"Nguyen Van Ngoc!D4:D9","majorDimension":"ROWS","values":[["19:50"],["19:50"],["19:50"],["19:50"],["19:50"],["19:50"]]};
        api.update(range, data)
            .done(function(data) {
                console.log(data);
            })
            .fail(function (err) {
                console.log("Err: "+JSON.stringify(err));
            });
    })
});

function disableSignInBtn() {
    $("#signin").hide();
}

function enableExportBtn() {
    $("#export").show();
}
