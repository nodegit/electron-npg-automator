var cp = require('child_process');

module.exports = function(electronVersion, moduleParentPath, modulePath) {
  return new Promise(function(resolve, reject) {
    cp.exec(
      `node lifecycleScripts/install.js --electronVersion=${electronVersion}`,
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
