module.exports = function getTagInfo() {
  return new Promise((resolve, reject) => {
    const tag = getTag();
    if (!tag) {
      reject('no tag');
      return;
    }

    const tagVersionRegex = /^ena-(v\d+\.\d+\.\d+(?:-\w+\.\d+)?)-(v\d+\.\d+\.\d+(?:-\w+\.\d+)?)/;
    const regexResults = tagVersionRegex.exec(tag);
    if (!regexResults) {
      reject('tag does not match expected format');
      return;
    }

    const [, moduleVersion, electronVersion] = regexResults;
    resolve({ moduleVersion, electronVersion });
  });
}

function getTag() {
  switch (process.platform) {
    case 'win32':
      return process.env.APPVEYOR_REPO_TAG_NAME;
    case 'linux':
    case 'darwin':
      return process.env.TRAVIS_TAG;
  }
}
