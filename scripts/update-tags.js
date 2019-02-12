const { execSync } = require('child_process');

const [, , oldNodeGitVersion, newNodeGitVersion] = process.argv;

if (!/v\d+\.\d+\.\d+(?:-\w+\.\d+)?/.test(oldNodeGitVersion)) {
  throw new Error('Must pass old NodeGit version tag in correct format. See Regex in script.');
}

if (!/v\d+\.\d+\.\d+(?:-\w+\.\d+)?/.test(newNodeGitVersion)) {
  throw new Error('Must pass new NodeGit version tag in correct format. See Regex in script.');
}

execSync('git tag -l')
  .toString()
  .split('\n')
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
  .forEach(newTag => {
    try {
      execSync(`git tag ${newTag}`);
      console.log(newTag);
    } catch (e) {
      throw new Error(`Unable to create ${newTag} locally.`);
    }

    try {
      execSync(`git push origin ${newTag}`);
    } catch (e) {
      throw new Error(`Unable to push ${newTag} to origin.`);
    }
  });
