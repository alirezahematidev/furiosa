import { release } from '@vitejs/release-scripts';

release({
  repo: 'furiosa-lib',
  packages: ['form'],
  toTag: (pkg, version) => `${pkg}@${version}`,
  logChangelog: () => void {},
  generateChangelog: () => void {},
});
