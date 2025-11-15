const request = require('request');
const getConfig = require('./get-config');

module.exports = function get(which, sub) {
  var module = getConfig('module');
  if (!module) {
    return Promise.reject(new Error("The `module` config isn't set. You're Gonna Have A Bad Time."));
  }

  const urls = {
    electron: 'https://api.github.com/repos/Atom/electron/',
    module: `https://api.github.com/repos/${module}/`
  };

  var token = getConfig('gh_token');
  if (!token) {
    return Promise.reject(new Error("The `gh_token` config isn't set. You're Gonna Have A Bad Time."));
  }

  let opts = {
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'electron-npg-automator'
    },
    json: true,
    url: urls[which] + sub
  };

  return new Promise((resolve, reject) => {
    request.get(opts, (err, response, body) => {
      if (err) {
        return reject(err);
      }
      response.body = body;
      if (response.statusCode != 200) {
        return reject(response);
      }

      return resolve(response);
    }).on('error', reject);
  });
};
