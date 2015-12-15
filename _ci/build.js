const cp = require('child_process');
const getTagInfo = require('../util/get-tag-info');
const modulePath = require('../util/module-path');
const moduleParentPath = require('../util/module-parent-path');
const path = require('path');
const {installNodeHeaders, rebuildNativeModules} = require('electron-rebuild');

let buildScript;

try {
  buildScript = require('./custom-build');
}
catch(e) {
  console.log('using default build script');
  buildScript = function defaultBuildScript(electronVersion, moduleParentPath) {
    return installNodeHeaders(electronVersion)
      .then(() => rebuildNativeModules(electronVersion, moduleParentPath));
  }
}

getTagInfo()
  .then(({electronVersion}) => {
    electronVersion = electronVersion.replace('v', '');

    return buildScript(electronVersion, moduleParentPath(), modulePath());
  })
  .catch (e => {
    console.error('Error building:');
    console.error(e);
    process.exit(1);
  });
