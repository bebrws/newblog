import { cpSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const blog = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : resolve(blog, '../starstep');
const metadata = JSON.parse(readFileSync(resolve(source, 'package.json'), 'utf8'));
if (metadata.name !== 'starstep') throw new Error(`Expected the Starstep source at ${source}`);

// Keep the game independent of the blog's React and Next.js versions.
execFileSync(process.execPath, ['scripts/verify.mjs'], { cwd: source, stdio: 'inherit' });
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: source, stdio: 'inherit' });
for (const directory of ['public', 'docs']) {
  const destination = resolve(blog, directory, 'games/starstep');
  mkdirSync(destination, { recursive: true });
  cpSync(resolve(source, 'dist'), destination, { recursive: true });
  console.log(`Updated ${directory}/games/starstep/`);
}
console.log('Starstep is ready for https://bbarrows.com/games/starstep/');
