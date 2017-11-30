// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = parse(document);
'use strict';

// timesheet cell json format: {"2017-11-20" : ["19:50", "19:50"]}

var parser = (function () {
    let WSM_FRAMGFIA_URL = "https://wsm.framgia.vn/vi/dashboard/user_timesheets";

    function parse(document) {
        let dailyTimeMap = new Map();
        let days = $(document).find(".curr tr td").not(".nil");
        $(days.each(function(i, obj) {
            let dailyTime = parserDailyTimeSheet(obj);
            dailyTimeMap.set(dailyTime.day, dailyTime.timeSheet);
        }));

        // console.log(dailyTimeMap.size);
        // dailyTimeMap.forEach(function(value, key) {
        //   console.log(key + ' = ' + JSON.stringify(value));
        // });
        return dailyTimeMap;
    }


    function parserDailyTimeSheet(dailyTimeSheet) {
        let day = $(dailyTimeSheet).attr("class");
        let timeIn = $(dailyTimeSheet).find(".event-time-in").html();
        let timeOut = $(dailyTimeSheet).find(".event-time-out").html();
        day = day.replace("today", "").trim();
        return {
            [day] : {timeIn, timeOut}
        };
    }
    // Month format: YYYYMM
    function getMonthlyTimeSheet(month, callback) {
        let currentMonthTimesheet = getCurrentMonthTimeSheet(month, function (err, currentMonthTimesheet) {
            if (err) {
                callback(err);
                return;
            }
            console.log("currentMonthTimesheet: "+JSON.stringify(currentMonthTimesheet));
            let nextMonth = getNextMonth(month);
            getCurrentMonthTimeSheet(nextMonth, function (err, nextMonthTimesheet) {
                if (err) {
                    callback(err);
                    return;
                }
                console.log("nextMonthTimesheet: "+JSON.stringify(nextMonthTimesheet));
                let timesheet = merge(currentMonthTimesheet, nextMonthTimesheet);
                callback(null, timesheet);
            });

        });
    }

    function getCurrentMonthTimeSheet(month, callback){
        let timesheetUrl = getTimesheetUrl(month);
        $.get(timesheetUrl).done(function(document) {
            let timesheet = parse(document);
            console.log("timsheet: "+JSON.stringify(timesheet));
            callback(null, timesheet);
        }).fail(function (err) {
            callback(err);
            return;
        });

    }

    function merge(currentMonthTimesheet, nextMonthTimesheet) {
        // TODO
        return null;
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




