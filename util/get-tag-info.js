module.exports = function getTagInfo() {
  return new Promise((resolve, reject) => {
    const tag = getTag();
    if (!tag) {
      reject('no tag');
      return;
    }

    const tagVersionRegex = /^refs\/tags\/ena-(v\d+\.\d+\.\d+(?:-\w+\.\d+)?)-(v\d+\.\d+\.\d+(?:-\w+\.\d+)?)/;
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
  return process.env.GITHUB_REF;
}
