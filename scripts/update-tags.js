const { execSync } = require('child_process');

const [, , oldNodeGitVersion, newNodeGitVersion] = process.argv;

if (!/v\d+\.\d+\.\d+(?:-\w+\.\d+)?/.test(oldNodeGitVersion)) {
  throw new Error('Must pass old NodeGit version tag in correct format. See Regex in script.');
}

if (!/v\d+\.\d+\.\d+(?:-\w+\.\d+)?/.test(newNodeGitVersion)) {
  throw new Error('Must pass new NodeGit version tag in correct format. See Regex in script.');
}

const allTags = execSync('git tag -l')
  .toString()
  .split('\n')
  .filter(a => a);
const existingTags = new Set(allTags);

const newTagList = allTags
  .filter(maybeTag =>
    new RegExp(`ena-${oldNodeGitVersion}-v\\d+\\.\\d+\\.\\d+`)
      .test(maybeTag)
  )
  .map(tagString => {
    const maybeVersionInfo = /ena-v\d+\.\d+\.\d+(?:-\w+\.\d+)?-(v\d+\.\d+\.\d+)/.exec(tagString);
    if (!maybeVersionInfo) {
      throw new Error(`${tagString} did not match regex for version extraction, please inspect and fix.`);
    }

    const [_, electronVersion] = maybeVersionInfo;
    return `ena-${newNodeGitVersion}-${electronVersion}`;
  })
  .sort((a, b) => {
    const electronVersionRegex = /ena-v\d+\.\d+\.\d+(?:-\w+\.\d+)?-v(\d+)\.(\d+)\.(\d+)/;
    const [, aMajor, aMinor, aPatch] = electronVersionRegex.exec(a);
    const [, bMajor, bMinor, bPatch] = electronVersionRegex.exec(b);

    const majorDifference = aMajor - bMajor;
    if (majorDifference !== 0) return majorDifference;

    const minorDifference = aMinor - bMinor;
    if (minorDifference !== 0) return minorDifference;

    return aPatch - bPatch;
  })
  .reverse()
  .filter(newTag => !existingTags.has(newTag)) // Don't push tags that have already been built
  .forEach(newTag => {
    try {
      execSync(`git tag ${newTag}`);
    } catch (e) {
      throw new Error(`Unable to create ${newTag} locally.`);
    }

    try {
      execSync(`git push origin ${newTag}`);
    } catch (e) {
      throw new Error(`Unable to push ${newTag} to origin.`);
    }
  });
