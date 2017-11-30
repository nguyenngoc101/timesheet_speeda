// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = parse(document);
'use strict'


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
        return {[day]: {timeIn, timeOut}};
    }

    return {
        parse: parse
    }
})();




