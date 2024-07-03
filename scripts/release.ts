import { release } from '@vitejs/release-scripts'
import type { Options as ExecaOptions } from 'execa'
import { execa } from 'execa'

async function run(bin: string, args: string[], opts: ExecaOptions = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

release({
  repo: 'furiosa-lib',
  packages: ['form'],
  toTag: (pkg, version) => `${pkg}@${version}`,
  logChangelog: () => {},
  generateChangelog: async (pkgName) => {
    const args = ['conventional-changelog', '-p', 'angular', '-i', 'CHANGELOG.md', '-s', '--commit-path', '.']

    args.push('--lerna-package', `@furiosa/${pkgName}`)

    await run('npx', args, { cwd: `packages/${pkgName}` })
  },
})
