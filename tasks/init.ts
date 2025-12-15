import { Logger } from '@/lib/logger.0.ts';
import { spawn } from 'node:child_process';
import { copyFile, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { argv } from 'node:process';

const exists = async (path: string) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const template = 'meta/template.ts';
const editor = ['flatpak', 'run', 'com.vscodium.codium'];
const textFiles = ['sample1.txt', 'input.txt'];

const logger = new Logger(import.meta.url);
const day = parseInt(argv.at(2) ?? '');
if (isNaN(day)) throw new Error('missing required day number arg');

const directory = join('day', day.toString().padStart(2, '0'));
const main = join(directory, 'main.ts');

await mkdir(directory, { recursive: true });
if (await exists(main)) logger.warn(main, 'already exists');
else {
  await copyFile(template, main);
  logger.success('created', main);
}

const [command, ...args] = [...editor, main, ...textFiles.map((name) => join(directory, name))];
spawn(command, args);
logger.info(command, ...args);
