import { release } from '@vitejs/release-scripts';

release({
  repo: 'furiosa-lib',
  packages: ['form', 'swag', 'tree', 'eslint-plugin-atomic'],
  toTag: (pkg, version) => `${pkg}@${version}`,
  logChangelog: () => void {},
  generateChangelog: () => void {},
});
