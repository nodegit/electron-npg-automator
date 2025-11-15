const path = require('path');
module.exports = function moduleParentPath() {
  return path.join(__dirname, '..', 'module_to_build', 'node_modules');
};
