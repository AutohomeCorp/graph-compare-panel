import _ from "lodash";

var units = ['y', 'M', 'w', 'd', 'h', 'm', 's'];
export function parseShiftToMs(startTime,timeShift) {
    var dateTime = timeShift;
    var len = timeShift.length;
    var i = 0;

    while (i < len && !isNaN(dateTime.charAt(i))) {
        i++;
        if (i > 10) {
            return undefined;
        }
    }
    var num = parseInt(dateTime.substring(0, i), 10);
    var unit = dateTime.charAt(i);

    if (!_.includes(units, unit)) {
        return undefined;
    } else {
        let curTime = startTime;
        let shiftTime = curTime.clone().add(num, unit);
        return shiftTime.valueOf()-curTime.valueOf();
    }
}
