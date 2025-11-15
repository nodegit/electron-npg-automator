const fs = require('fs/promises');
const cp = require('child_process');
const getTagInfo = require('../util/get-tag-info');
const modulePath = require('../util/module-path');
const path = require('path');
const downloadModule = require('../util/download-module');

(async () => {
  await downloadModule();

  const tagInfo = await getTagInfo();
  const electronVersion = tagInfo.electronVersion.replace('v', '');

  let npmrc = 'runtime = electron\n';
  npmrc += 'disturl = https://electronjs.org/headers\n';
  npmrc += `target = ${electronVersion.replace('v', '')}`;
  if (process.env.TARGET_ARCH) {
    npmrc += `\narch = ${process.env.TARGET_ARCH}`;
  }

  await fs.writeFile(path.join(modulePath(), '.npmrc'), npmrc);

  return new Promise(function(resolve, reject) {
    const spawnedNPM = cp.spawn(
      'npm install',
      {
        cwd: modulePath(),
        shell: true
      }
    );

    spawnedNPM.stdout.on('data', data => console.log(data && data.toString()));
    spawnedNPM.stderr.on('data', data => console.log(data && data.toString()));
    spawnedNPM.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    })
  });
})();
