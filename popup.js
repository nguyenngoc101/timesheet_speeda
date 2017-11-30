/**
 * Created by framgia on 27/11/2017.
 */

var apiOptions = {
    apiUrl: "https://sheets.googleapis.com/v4/spreadsheets",
    sheetId: "1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I"
};

var emailNameMap = new Map([
    ["trada110@gmail.com", "Nguyen Van Ngoc"],
    ["dohalong1993@gmail.com", "Do Ha Long"]]
);

var api = api(apiOptions);

var currentEmail;

$(document).ready(function () {
    $("#signin").click(function () {
        auth.getToken(function(err, token) {
            if (err) {
                console.log("Can't get token from your ID");
            }

            apiOptions.accessToken = token;
            auth.getEmail(function (err, email) {
                if (err) {
                    console.log("Can't get token from your ID");
                }
                setCurrentEmail(email);
            });
            disableSignInBtn();
            enableExportBtn();
        })
    });

    $("#export").click(function () {
        let range = emailNameMap.get(getCurrentEmail()) + "!" + timesheetUtils.getColumnDateMap().get("201711");//"Nguyen Van Ngoc!D4:D9";
        let data = {
            "range": range,
            "majorDimension":"ROWS",
            "values":[["20:50"],["20:50"],["20:50"],[""],["20:50"],["20:50"]]
        };
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

function setCurrentEmail(email) {
    currentEmail = email;
}

function getCurrentEmail() {
    return this.currentEmail;
}
