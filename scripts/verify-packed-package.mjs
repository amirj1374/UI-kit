import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const fixtureRoot = join(repositoryRoot, 'tests', 'consumer');

function run(command, args, cwd) {
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32' && command === 'npm'
  });
}

if (!existsSync(join(repositoryRoot, 'dist', 'ui-kit.es.js'))) {
  throw new Error('dist is missing. Run "npm run build:lib" before "npm run test:consumer".');
}

const temporaryRoot = mkdtempSync(join(tmpdir(), 'ui-kit-consumer-'));
try {
  const packOutput = execFileSync(
    'npm',
    ['pack', '--json', '--ignore-scripts', '--pack-destination', temporaryRoot],
    { cwd: repositoryRoot, encoding: 'utf8', shell: process.platform === 'win32' }
  );
  const [{ filename }] = JSON.parse(packOutput);
  const tarball = join(temporaryRoot, filename);
  const consumerRoot = join(temporaryRoot, 'consumer');
  cpSync(fixtureRoot, consumerRoot, { recursive: true });

  const consumerPackagePath = join(consumerRoot, 'package.json');
  const consumerPackage = JSON.parse(readFileSync(consumerPackagePath, 'utf8'));
  consumerPackage.dependencies['@amirjalili1374/ui-kit'] = `file:${tarball.replaceAll('\\', '/')}`;
  writeFileSync(consumerPackagePath, `${JSON.stringify(consumerPackage, null, 2)}\n`);

  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerRoot);
  run('npm', ['run', 'typecheck'], consumerRoot);
  run('npm', ['run', 'build'], consumerRoot);
  run('node', ['--input-type=module', '--eval', "if (!import.meta.resolve('@amirjalili1374/ui-kit').endsWith('ui-kit.es.js')) process.exit(1)"], consumerRoot);
  run('node', ['--eval', "if (!require.resolve('@amirjalili1374/ui-kit').endsWith('ui-kit.cjs')) process.exit(1)"], consumerRoot);

  const installedPackage = JSON.parse(
    readFileSync(join(consumerRoot, 'node_modules', '@amirjalili1374', 'ui-kit', 'package.json'), 'utf8')
  );
  const packageRoot = join(consumerRoot, 'node_modules', '@amirjalili1374', 'ui-kit');
  for (const expected of ['dist/ui-kit.es.js', 'dist/ui-kit.cjs', 'dist/index.d.ts', 'dist/style.css', 'LICENSE']) {
    if (!existsSync(join(packageRoot, expected))) throw new Error(`Packed package is missing ${expected}`);
  }
  if (existsSync(join(packageRoot, 'src'))) throw new Error('Packed package unexpectedly includes private src files.');
  if (!installedPackage.exports?.['./dist/style.css']) throw new Error('CSS is not exposed through package exports.');
  const builtCss = readFileSync(join(packageRoot, 'dist', 'style.css'), 'utf8');
  for (const token of ['--ui-color-surface', '--ui-duration-normal', '--ui-z-dialog', '--ui-focus-ring']) {
    if (!builtCss.includes(token)) throw new Error(`Packed CSS is missing semantic token ${token}`);
  }

  console.log(`Packed consumer verification passed: ${basename(tarball)}`);
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true });
}
