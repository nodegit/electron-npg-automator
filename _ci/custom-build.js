const cp = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function(electronVersion, moduleParentPath, modulePath) {
  return new Promise(function(resolve, reject) {
    let npmrc = 'runtime = electron\n';
    npmrc += 'disturl = https://atom.io/download/atom-shell\n';
    npmrc += `target = ${electronVersion.replace('v', '')}`;

    fs.writeFileSync(path.join(modulePath, '.npmrc'), npmrc);

    cp.exec(
      'npm install',
      {cwd: modulePath, maxBuffer: Number.MAX_VALUE},
      function(err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      }
    );
  });
};
