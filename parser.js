// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);


function DOMtoString(document) {
    let dailyTimeMap = new Map();
    let days = $(document).find(".curr tr td").not(".nil, .saturday-sunday, holiday-color");
    $(days.each(function(i, obj) {

        let dailyTime = parserDailyTimeSheet(obj);
        dailyTimeMap.set(dailyTime.day, dailyTime.timeSheet);
    }));
    console.log(dailyTimeMap.size);
    // dailyTimeMap.forEach(function(value, key) {
    //   console.log(key + ' = ' + JSON.stringify(value));
    // });
    return "html";
}


function parserDailyTimeSheet(dailyTimeSheet) {
    let day = $(dailyTimeSheet).attr("class");
    let timeIn = $(dailyTimeSheet).find(".event-time-in").html();
    let timeOut = $(dailyTimeSheet).find(".event-time-out").html();
    day = day.replace("today", "").trim();
    return {"day": day, "timeSheet": {timeIn, timeOut}};
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: DOMtoString(document)
});


