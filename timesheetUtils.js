/**
 * Created by framgia on 27/11/2017.
 */
'user strict';

var timesheetUtils = (function() {

    function getColumnDateMap() {
        return new Map([
            ["201711", "BB4:BB35"],
            ["201712", "BG4:BG35"]
        ]);
    }

    return {
        getColumnDateMap: getColumnDateMap
    };
})();
