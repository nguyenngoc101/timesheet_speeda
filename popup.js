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

var dateNow = new Date();

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    generateOptionMonth();

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

function generateOptionMonth() {
    let year = dateNow.getFullYear();
    let month = dateNow.getMonth()+1;
    let lastYear = year - 1;
    for(let i = month; i >= 0; i--){
        if(i === 0 && year !== lastYear){
            i = 12;
            year = lastYear;
        }
        if(year === lastYear && i < month) {
            break;
        }
        $('#month-select').append(appendMonthSelect(year,i));
    }
}

function appendMonthSelect(year, month){
    let monthYear = year+
        ((''+month).length<2 ? '0' : '') + month;
    return "<option value='"+monthYear+"'>"+monthYear+"</option>";
}