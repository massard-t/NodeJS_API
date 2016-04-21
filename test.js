var moment = require('moment');

var date2 = "2015-07-16T16:33:39.113Z"

var then = moment(date2, "YYYY-MM-DD'T'HH:mm:ss:SSSZ");
var now = moment();

var diff = moment.duration(then.diff(now));
if (diff < 0) {
    diff = Math.abs(diff);
}
var d = moment.utc(diff).format("HH:mm:ss");
console.log("Difference: " + d);