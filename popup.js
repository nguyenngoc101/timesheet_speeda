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
    $('[data-toggle="tooltip"]').tooltip();

    generateMonthOptionTag();

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
        })
    });

    $("#export").click(function () {
        $("#export").prop("disabled", true);
        $(".export-text").text("Processing Shit...");
        let selectedMonth = "201711";

        let range = emailNameMap.get(getCurrentEmail()) + "!" + timesheetUtils.getColumnDateMap().get(selectedMonth);
        let data = {
            "range": range,
            "majorDimension":"ROWS",
            "values":[["20:50"],["20:50"],["20:50"],[""],["20:50"],["20:50"]]
        };
        api.update(range, data)
            .done(function(data) {
                console.log(data);
                $(".export-text").text("Shit processed!").delay(3000).queue(function () {
                    $(this).text("Export Timeshit").prop("disabled", false);
                });
            })
            .fail(function (err) {
                console.log("Err: "+JSON.stringify(err));
            });
    });
});

function disableSignInBtn() {
    $("#signin").fadeOut(300,enableExportBtn(300));
}

function enableExportBtn() {
    $(".export-panel").fadeIn();
}

function setCurrentEmail(email) {
    currentEmail = email;
}

function getCurrentEmail() {
    return this.currentEmail;
}


function generateMonthOptionTag() {
    generateOptionsMonth().forEach(monthYear => {
        $('#month-select').append("<option value='"+monthYear+"'>"+monthYear+"</option>");
    });
}

function generateOptionsMonth() {
    let dateNow = new Date();
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth()+1;
    let options = [];
    for (let i = 1; i<=13; i++) {
        options.push(convertMonthOptionToString(year, month));
        month = month - 1;
        if (month === 0) {
            year--;
            month = 12;
        }
    }
    return options;
}

function convertMonthOptionToString(year, month){
    return year + ((''+month).length<2 ? '0' : '') + month;
}
