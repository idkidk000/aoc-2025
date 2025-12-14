import { Logger } from '@/lib/logger.0.ts';
import { spawnSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

type DayResult = { day: number } & Record<number, number>;

const names = [
  'Secret Entrance',
  'Gift Shop',
  'Lobby',
  'Printing Department',
  'Cafeteria',
  'Trash Compactor',
  'Laboratories',
  'Playground',
  'Movie Theater',
  'Factory',
  'Reactor',
  'Christmas Tree Farm',
];

const logger = new Logger(import.meta.url);

const files = (await readdir('day', { encoding: 'utf-8', recursive: true, withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name === 'main.ts')
  .map(({ parentPath, name }) => join(parentPath, name)).toSorted();

const results = new Map<string, DayResult>();
for (const file of files) {
  const day = parseInt(file.match(/\/(?<day>\d+)\//)?.groups?.day ?? '');
  const result: Partial<DayResult> = { day };
  for (let part = 1; part <= 2; ++part) {
    const [command, ...args] = ['deno', 'run', '-R', file, '-p', String(part)];
    for (let run = 0; run < 3; ++run) {
      const started = performance.now();
      spawnSync(command, args, {
        stdio: 'inherit',
      });
      const duration = performance.now() - started;
      // deno-lint-ignore no-non-null-assertion
      if (part in result) result[part] = Math.min(result[part]!, duration);
      else result[part] = duration;
    }
  }
  logger.info(file, result);
  results.set(file, result as DayResult);
}
logger.info(results);

const markdown = `### Benchmarks\n\n| Day | Part 1 | Part 2 |\n| --- | --- | --- |\n${
  results.entries().map(([file, result]) =>
    `| [${result.day.toString().padStart(2, '0')} - ${names.at(result.day - 1) ?? '???'}](${file}) | ${
      Array.from({ length: 2 }, (_, i) => {
        // const totalMillis = result[i + 1];
        // const totalSec = totalMillis / 1000;
        // const minutes = Math.floor(totalSec / 60);
        // const seconds = Math.floor(totalSec % 60);
        // const millis = totalSec.toFixed(3).split('.')[1];
        // return `${minutes.toString()}:${seconds.toString().padStart(2, '0')}.${millis}`;
        return `${(result[i + 1] / 1000).toFixed(3)}s`;
      }).join(' | ')
    } |`
  ).toArray().join('\n')
}`;
logger.plain(markdown);
const contents = await readFile('readme.md', { encoding: 'utf-8' });
await writeFile('readme.md', `${contents.replace(/^### Benchmarks.*$/sm, '')}${markdown}`);
spawnSync('deno', ['fmt', 'readme.md']);
