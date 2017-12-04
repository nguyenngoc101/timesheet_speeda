// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = parse(document);
'use strict';

// timesheet cell json format: {"2017-11-20" : ["19:50", "19:50"]}

var parser = (function () {

    let WSM_FRAMGFIA_URL = "https://wsm.framgia.vn/vi/dashboard/user_timesheets";

    // Month format: YYYYMM
    function getMonthlyTimeSheet(month, callback) {
        getCurrentMonthTimeSheet(month)
                .done(function (jsonMonthData) {
                    let timesheet = parseTimeSheet(jsonMonthData["content"]["usertimesheets"]["timesheets"]);
                    let nextMonth = getNextMonth(month);
                    getCurrentMonthTimeSheet(nextMonth)
                        .done(function (jsonNextMonthData) {
                            let nextMonthTimesheet = parseTimeSheet(jsonNextMonthData["content"]["usertimesheets"]["timesheets"]);
                            callback(null, getTimeout(merge(month, timesheet, nextMonthTimesheet)));
                        })
                        .fail(function (err) {
                            callback(err);
                        })
                })
                .fail(function (err) {
                    callback(err);
                });
    }

    function parseTimeSheet(rawTimesheet) {
        let monthlyTimesheet = {};
        let dateTimeSheet;
        let timeIn;
        let timeOut;
        for (let [key, value] of Object.entries(rawTimesheet)) {
            dateTimeSheet = rawTimesheet[key];
            if (dateTimeSheet.hasOwnProperty("time_sheet_date")) {
                timeIn = extractTime(dateTimeSheet["time_sheet_date"]["time_in"]);
                timeOut = extractTime(dateTimeSheet["time_sheet_date"]["time_out"]);
            } else {
                timeIn = "";
                timeOut = "";
            }
            monthlyTimesheet[key] = {timeIn, timeOut};
        }

        return monthlyTimesheet;
    }

    function extractTime(rawtime) {
        return rawtime ? rawtime.replace(/.*T(\d\d:\d\d).*/, "$1") : "";
    }

    function getCurrentMonthTimeSheet(month){
        let timesheetUrl = getTimesheetUrl(month);
        console.log("timesheetURL: "+timesheetUrl);
        return $.ajax({
            url: timesheetUrl,
            type: 'get',
            crossDomain: true,
            dataType: 'json',
            beforeSend: function(request) {
                $(".loader").fadeIn();
                $("#export").prop("disabled", true);
                $(".export-text").text("Processing...");
                request.setRequestHeader('Content-Type','application/json');
                request.setRequestHeader("Accept","application/json");
            }
        });

    }

    function merge(month, currentMonthTimesheet, nextMonthTimesheet) {
        let year = parseInt(month/100);
        let currentMonth = month % 100;
        let minDay = year + "-" + currentMonth + "-01";
        let maxDay = year + "-" + currentMonth + "-31";

        let mergedTimesheet = Object.assign(currentMonthTimesheet, nextMonthTimesheet);
        let filteredTimesheet = {};

        for (let [key, value] of Object.entries(mergedTimesheet)) {
            if ( key >= minDay && key <= maxDay) {
                filteredTimesheet[key] = mergedTimesheet[key];
            }
        }

        let orderedMergedTimesheet = {};
        Object.keys(filteredTimesheet).sort().forEach(function(key) {
          orderedMergedTimesheet[key] = filteredTimesheet[key];
        });


        return orderedMergedTimesheet;
    }

    function getTimeout(timesheet) {
        let timeout = [];
        for (let [key, value] of Object.entries(timesheet)) {
            timeout.push([value["timeOut"]])
        }

        return timeout;
    }

    function getTimesheetUrl(month) {
        let year = parseInt(month/100);
        let currentMonth = month % 100;

        return WSM_FRAMGFIA_URL + "?year="+year+"&month="+currentMonth;
    }

    // yyyyMM
    function getNextMonth(month) {
        let year = parseInt(month/100);
        let currentMonth = month % 100;
        if (currentMonth == 12) {
            year++;
            currentMonth = 1;
        } else {
            currentMonth++;
        }
        return year * 100 + currentMonth;

    }

    return {
        getMonthlyTimeSheet: getMonthlyTimeSheet
    }
})();
