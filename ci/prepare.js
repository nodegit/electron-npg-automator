const cp = require('child_process');
const downloadModule = require('../util/download-module');
const modulePath = require('../util/module-path');

const do_prepare = () => new Promise((resolve, reject) => {
  cp.exec(
  'npm install',
  {cwd: _modulePath},
  (err, stdout, stderr) => {
    let out = err || {};
    out.stdout = stdout;
    out.stderr = stderr;
    if (err) {
      reject(out);
    } else {
      resolve(out);
    }
  }
  );
});

downloadModule()
  .then(() => {
    console.log(`${new Date().toString()} preparing module`);
    return do_prepare(modulePath());
  })
  .catch (e => {
    console.error('Error preparing to build:');
    console.error(e);
    process.exit(1);
  })
