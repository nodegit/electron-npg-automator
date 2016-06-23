const cp = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function(electronVersion, moduleParentPath, modulePath) {
  return new Promise(function(resolve, reject) {
    let npmrc = 'runtime = electron\n';
    npmrc += 'disturl = https://atom.io/download/atom-shell\n';
    npmrc += `target = ${electronVersion.replace('v', '')}`;

    fs.writeFileSync(path.join(modulePath, '.npmrc'), npmrc);

    const spawnedNPM = cp.spawn(
      'npm',
      ['install'],
      {cwd: modulePath}
    );

    spawnedNPM.stdout.on('data', (data) => console.log(data.toString().trim()));
    spawnedNPM.stderr.on('data', (data) => console.error(data.toString().trim()));
    spawnedNPM.on('close', (code) => {
      if (code === 0) {
        resolve();
      }
      else {
        reject(code);
      }
    });
  });
};
