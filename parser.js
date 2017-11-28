// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = parse(document);
'use strict';

// timesheet cell json format: {"2017-11-20" : ["19:50", "19:50"]}

var parser = (function () {
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
    function getMonthlyTimeSheet(month) {
        let currentMonthTimesheet = getCurrentMonthTimeSheet(month);
        let nextMonthTimesheet = getCurrentMonthTimeSheet(month);
        return merge(currentMonthTimesheet, nextMonthTimesheet);
    }

    function getCurrentMonthTimeSheet(month, callback){
        let timesheetUrl = getTimesheetUrl(month);
        $.get(timesheetUrl).done(function(data) {
            callback(null, data);
        }).fail(function (err) {
            callback(err);
            return;
        });

    }

    function merge(currentMonthTimesheet, nextMonthTimesheet) {
        // TODO
    }

    function getTimesheetUrl(month) {
        let year = month/100;
        let currentMonth = month % 100;
        return "https://wsm.framgia.vn/vi/dashboard/user_timesheets?year="+year+"&month="+currentMonth;
    }

    return {
        parse: parse,
        getCurrentMonthTimeSheet: getCurrentMonthTimeSheet
    }
})();




