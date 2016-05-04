const cp = require('child_process');
const getConfig = require('./get-config');
const fse = require('fs-extra');
const request = require('request');
const tar = require('tar');
const zlib = require('zlib');
const getUrl = require('./get-module-download-url');
const getTag = require('./get-tag-info');
const moduleParentPath = require('./module-parent-path');

module.exports = function downloadModule() {
  const useGitClone = getConfig('use_git_clone');

  if (!useGitClone) {
    return getUrl()
      .then(downloadTarball);
  }

  return gitCloneRepo();
};

function gitCloneRepo() {
  const token = getConfig('gh_token');
  const module = getConfig('module');

  if (!token) {
    return Promise.reject(new Error("The `gh_token` config isn't set. You're Gonna Have A Bad Time."));
  }

  if (!module) {
    return Promise.reject(new Error("The `module` config isn't set. You're Gonna Have A Bad Time."));
  }

  return getTag()
    .then(({moduleVersion}) => {
      const url = `https://${token}@github.com/${module}`;
      const cwd = moduleParentPath();


      fse.removeSync(cwd);
      fse.ensureDirSync(cwd);

      return new Promise((resolve, reject) => {
        cp.exec(`git clone ${url} --branch ${moduleVersion} --depth=1`, {cwd}, (error, stderr, stdout) => {
          if (error) {
            console.log(`Could not clone. Error code: ${error}`);
            console.log(stderr);
            return reject(error);
          }

          resolve();
        });
      });
    })
}

function downloadTarball(url) {
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
