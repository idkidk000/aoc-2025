import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';

interface Range {
  from: number;
  to: number;
}

function part1(ranges: Range[], logger: Logger) {
  let sum = 0;
  for (const [i, range] of ranges.entries()) {
    logger.debugLow(i, '/', ranges.length - 1, range);
    for (let value = range.from; value <= range.to; ++value) {
      const string = String(value);
      if (string.length % 2 !== 0) continue;
      const left = string.slice(0, string.length / 2);
      const right = string.slice(string.length / 2);
      // logger.debugLow(i, left, right);
      if (left === right) sum += value;
    }
  }
  logger.success('sum', sum);
}

function part2(ranges: Range[], logger: Logger) {
  let sum = 0;
  const dividers = new Map<number, number[]>();
  const set = new Set<string>();

  for (const [i, range] of ranges.entries()) {
    logger.debugLow(i, '/', ranges.length - 1, range);
    for (let value = range.from; value <= range.to; ++value) {
      const string = String(value);
      if (!dividers.has(string.length)) {
        dividers.set(string.length, []);
        for (let j = 1; j <= string.length / 2; ++j)
          if (Number.isInteger(string.length / j)) dividers.get(string.length)?.push(j);
        logger.debugLow('str len', string.length, dividers.get(string.length));
      }
      for (const length of dividers.get(string.length) ?? []) {
        set.clear();
        for (let j = 0; j < string.length / length; ++j) {
          set.add(string.slice(j * length, (j + 1) * length));
          if (set.size > 1) break;
        }
        // logger.debugLow(string, length, set);
        if (set.size === 1) {
          logger.debugLow('found', length, value);
          sum += value;
          break;
        }
      }
    }
  }
  logger.success('sum', sum);
}

function main() {
  const { data, logger, ...args } = parseArgs(import.meta.url);
  const ranges = data.replaceAll('\n', '').split(',').map((token) => {
    const parts = token.split('-');
    return { from: parseInt(parts[0]), to: parseInt(parts[1]) };
  });
  logger.debugLow(ranges);
  if (args.part1) part1(ranges, logger.makeChild('part1'));
  if (args.part2) part2(ranges, logger.makeChild('part2'));
}

main();
