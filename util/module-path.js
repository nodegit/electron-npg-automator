const fs = require('fs');
const path = require('path');
const moduleParentPath = require('./module-parent-path');

module.exports = function modulePath() {
  var parentPath = moduleParentPath();
  var childDir = fs.readdirSync(parentPath)[0];
  return path.join(parentPath, childDir);
};
