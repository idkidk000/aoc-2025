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
      if (left === right) {
        logger.debugLow('found', left, value);
        sum += value;
      }
    }
  }
  // 30599400849
  logger.success('sum', sum);
}

function part2(ranges: Range[], logger: Logger) {
  let sum = 0;
  const lengths = new Map<number, number[]>();
  for (const [i, range] of ranges.entries()) {
    logger.debugLow(i, '/', ranges.length - 1, range);
    for (let value = range.from; value <= range.to; ++value) {
      const string = String(value);
      if (!lengths.has(string.length)) {
        lengths.set(string.length, []);
        for (let j = 1; j <= string.length / 2; ++j)
          if (Number.isInteger(string.length / j)) lengths.get(string.length)?.push(j);
        logger.debugLow('lengths', string.length, lengths.get(string.length));
      }
      for (const length of lengths.get(string.length) ?? []) {
        const substring = string.slice(0, length);
        if (substring.repeat(string.length / length) === string) {
          logger.debugLow('found', substring, value);
          sum += value;
          break;
        }
      }
    }
  }
  // 46270373595
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
