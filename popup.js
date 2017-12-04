/**
 * Created by framgia on 27/11/2017.
 */

var apiOptions = {
    apiUrl: "https://sheets.googleapis.com/v4/spreadsheets",
    sheetId: "1TY_EK3ezfAuZwklVTGLmCakt6EhwO8IkioWHhUaHu7I"
};

var emailNameMap = new Map([["tannv85@gmail.com", "Nguyen Van Tan"],
    ["thutrangtran0511@gmail.com", "Tran Thu Trang"],
    ["nguyenminhngoc171@gmail.com", "Nguyen Minh Ngoc"],
    ["thuphuongdoan309@gmail.com", "Doan Thu Phuong"],
    ["huyenmy1107@gmail.com", "Nguyen Huyen My"],
    ["a.wintry.smile@gmail.com", "Nguyen Mai Linh"],
    ["kimanhftu2012@gmail.com", "Do Kim Anh"],
    ["trada110@gmail.com", "Nguyen Van Ngoc"],
    ["hant.dav@gmail.com", "Nguyen Thanh Ha"],
    ["muhammad.tamzid@gmail.com", "Muhammad Tamzid (Tamzid)"],
    ["ngthuha0657@gmail.com", "Nguyen Thi Thu Ha"],
    ["maikimchi91@gmail.com", "Mai Kim Chi"],
    ["doanphuongthao1311@gmail.com", "Doan Thi Phuong Thao"],
    ["quynhnth.it@gmail.com", "Nguyen Thi Huong Quynh"],
    ["khanh.dongoc93@gmail.com", "Do Ngoc Khanh"],
    ["dohalong1993@gmail.com", "Do Ha Long"],
    ["mksaikat123@gmail.com", "Karim Md Muzahidul"],
    ["yenth2310@gmail.com", "Ta Thi Hoang Yen"],
    ["phamduyentb68@gmail.com", "Pham Thi Duyen"],
    ["anhltn217@gmail.com", "Le Thi Ngoc Anh"],
    ["vu43th2@gmail.com", "Nguyen Van Vu"]]
);

var api = api(apiOptions);

var currentEmail;
var isSignedIn;

var TIMESHEET_SHORT_BASE_URL = "https://docs.google.com/spreadsheets/d/";

setSignedInWSM();

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

    generateMonthOptionTag();

    $("#signin").click(function () {
        auth.getToken(function(err, token) {
            if (err) {
                displayErrMessage("Can't get token from your ID");
            }

            apiOptions.accessToken = token;
            auth.getEmail(function (err, email) {
                if (err) {
                    displayErrMessage("Can't get token from your ID");
                }
                setCurrentEmail(email);
            });
            disableSignInBtn();
        })
    });

    $("#export").click(function () {
        hideMessagePanel();
        let selectedMonth = $('#month-select :selected').text();
        parser.getMonthlyTimeSheet(parseInt(selectedMonth), function (err, timeoutData) {
            if (err) {
                displayErrMessage("Can not get data from Framgia WSM! Please make sure you logged in");
            } else {
                let range = emailNameMap.get(getCurrentEmail()) + "!" + timesheetUtils.getColumnDateMap().get(selectedMonth.substring(4, 6));
                let data = {
                    "range": range,
                    "majorDimension":"ROWS",
                    "values": timeoutData,
                };
                api.update(range, data)
                    .done(function(data) {
                        $(".loader").fadeOut();
                        $("#export").prop("disabled", false);
                        $(".export-text").text("Export Timeshit");
                        displaySuccessMessage("Please check the timesheet:", apiOptions.sheetId);
                    })
                    .fail(function (err) {
                        $(".loader").fadeOut();
                        $("#export").prop("disabled", false);
                        $(".export-text").text("Export Timeshit");
                        displayErrMessage("Can not write data to spreadsheet!");
                    });
                }


        });

    });
});
function disableSignInBtn() {
    $("#signin").fadeOut(300,enableExportBtn());
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

function setSignedInWSM() {
    auth.getCookie("wsm.framgia.vn", "_wsm_02_session", function(cookie) {
        isSignedIn = !cookie ? false : true
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

function displayErrMessage(msg) {
    $(".message-panel").addClass("alert-danger").append("<strong>Error!</strong> <span>"+msg+".</span>")
        .fadeIn('slow');
}

function displaySuccessMessage(msg, sheetId) {
    $(".message-panel").addClass("alert-success")
        .append("<strong>Success!</strong> <span>"+msg+"</span><strong> <a href='"+getSheetPage(sheetId)+"' target='_blank'>HERE</a></strong>")
            .fadeIn();
}

function getSheetPage(sheetId) {
    return TIMESHEET_SHORT_BASE_URL+sheetId;
}

let hideMessagePanel = function () {
    $(".message-panel").children().remove();
    $(".message-panel").slideUp('fast');
};
