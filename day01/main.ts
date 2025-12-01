import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Utils } from '../lib/utils.0.ts';

function part1(data: string, logger: Logger) {
  const operations = data.split('\n').map((token) => parseInt(token.slice(1)) * (token.slice(0, 1) === 'L' ? -1 : 1));
  let value = 50;
  let zeroes = 0;
  for (const operation of operations) {
    value = Utils.modP(value + operation, 100);
    if (value === 0) ++zeroes;
    logger.debugLow({ operation, value, zeroes });
  }
  // 1074
  logger.success('password', zeroes);
}

function part2(data: string, logger: Logger) {
  const operations = data.split('\n').map((token) => parseInt(token.slice(1)) * (token.slice(0, 1) === 'L' ? -1 : 1));
  let value = 50;
  let zeroes = 0;
  for (const operation of operations) {
    const iterations = Math.abs(operation);
    const operand = operation > 0 ? 1 : -1;
    for (let i = 0; i < iterations; ++i) {
      value = Utils.modP(value + operand, 100);
      if (value === 0) ++zeroes;
    }
    logger.debugLow({ operation, value, zeroes });
  }
  // 6254
  logger.success('password', zeroes);
}

function main() {
  const logger = new Logger(import.meta.url);
  const { data, fileName, logLevel, ...args } = parseArgs(import.meta.url);
  logger.debugLow({ fileName, logLevel, ...args });
  if (args.part1) part1(data, new Logger(import.meta.url, 'part1', { logLevel }));
  if (args.part2) part2(data, new Logger(import.meta.url, 'part2', { logLevel }));
}

main();
