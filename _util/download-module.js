const getConfig = require('./get-config');
const fse = require('fs-extra');
const request = require('request');
const tar = require('tar');
const zlib = require('zlib');
const getUrl = require('./get-module-download-url');
const moduleParentPath = require('./module-parent-path');

module.exports = function downloadModule() {
  return getUrl()
    .then(download);
};

function download(url) {
  console.log(`${new Date().toString()} downloading module from ${url}`)
  var token = getConfig('gh_token');
  if (!token) {
    return Promise.reject(new Error("The `gh_token` config isn't set. You're Gonna Have A Bad Time."));
  }

  const opts = {
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'electron-npg-automator'
    },
    url
  };

  return new Promise((resolve, reject) => {
    var parentPath = moduleParentPath();

    fse.removeSync(parentPath);
    fse.ensureDirSync(parentPath);

    request.get(opts)
      .pipe(zlib.Gunzip())
      .pipe(tar.Extract({path: parentPath}))
      .on('error', reject)
      .on('close', resolve);
  });
}
