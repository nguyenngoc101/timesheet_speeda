/**
 * Created by framgia on 27/11/2017.
 */
'user strict';

var timesheetUtils = (function() {

    function getColumnDateMap() {
        return new Map([
            ["01", "D4:D34"],
            ["02", "I4:I34"],
            ["03", "N4:N34"],
            ["04", "S4:S34"],
            ["05", "X4:X34"],
            ["06", "AC4:AC34"],
            ["07", "AH4:AH34"],
            ["08", "AM4:AM34"],
            ["09", "AR4:AR34"],
            ["10", "AW4:AW34"],
            ["11", "BB4:BB34"],
            ["12", "BG4:BG34"]
        ]);
    }

    return {
        getColumnDateMap: getColumnDateMap
    };
})();
