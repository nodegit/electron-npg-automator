const cp = require('child_process');
const fs = require('fs');
const path = require('path');

module.exports = function(electronVersion, moduleParentPath, modulePath) {
  return new Promise(function(resolve, reject) {
    let npmrc = 'runtime = electron\n';
    npmrc += 'disturl = https://electronjs.org/headers\n';
    npmrc += `target = ${electronVersion.replace('v', '')}`;

    fs.writeFileSync(path.join(modulePath, '.npmrc'), npmrc);

    if (process.platform === 'win32') {
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
      return;
    }

    const spawnedNPM = cp.spawn(
      'npm',
      ['install'],
      { cwd: modulePath }
    );

    spawnedNPM.stdout.on('data', data => console.log(data && data.toString().trim()));
    spawnedNPM.stderr.on('data', data => console.log(data && data.toString().trim()));
    spawnedNPM.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    })
  });
};
