const { execSync } = require('child_process');

const [, , oldNodeGitVersion] = process.argv;

if (!/v\d+\.\d+\.\d+(?:-\w+\.\d+)?/.test(oldNodeGitVersion)) {
  throw new Error('Must pass old NodeGit version tag in correct format. See Regex in script.');
}

execSync('git tag -l')
  .toString()
  .split('\n')
  .filter(maybeTag =>
    new RegExp(`ena-${oldNodeGitVersion}-v\\d+\\.\\d+\\.\\d+`)
      .test(maybeTag)
  )
  .forEach(oldTag => {
    try {
      execSync(`git tag -d ${oldTag}`);
    } catch (e) {
      throw new Error(`Unable to delete ${oldTag} locally.`);
    }

    try {
      execSync(`git push origin :refs/tags/${oldTag}`);
    } catch (e) {
      throw new Error(`Unable to delete ${oldTag} from origin.`);
    }
  });
