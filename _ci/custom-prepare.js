module.exports = function() {
  // We only need to make a .npmrc in the module path dir and we have that
  // data in the `build` task so we'll do it there. Thus, nothing to prepare.
  return Promise.resolve();
}
