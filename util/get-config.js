const reg = /([a-z][A-Z])/;
let user;
try {
  user = require('../config');
}
catch(e) {
  user = {};
}
const defaults = {
  poll_interval: 1000*60*60,
  remote: 'origin'
};

module.exports = function getConfig(setting) {
  return process.env[`electron_npg_automator_${setting}`] ||
    user[setting] ||
    defaults[setting];
};
