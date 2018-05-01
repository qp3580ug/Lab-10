var moment = require('moment-timezone');

function formatDate(date) {
  m = moment.utc(date);

  return m.tz('America/Chicago').format('dddd, MMM Do YYYY, h:mm a');
}

function length(array) {
  return array.length;
}

module.exports = {
  formatDate,
  length
}
