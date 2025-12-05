import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

interface Range {
  from: number;
  to: number;
}

function part1(ranges: Range[], available: number[], logger: Logger) {
  const availableFresh = available.filter((av) => ranges.find((fr) => fr.from <= av && fr.to >= av));
  logger.debugLow({ availableFresh });
  // 848
  logger.success('count', availableFresh.length);
}

function part2(ranges: Range[], _available: number[], logger: Logger) {
  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < ranges.length - 1; ++i) {
      const current = ranges[i];
      const next = ranges[i + 1];
      if (current.to >= next.from) {
        logger.debugHigh('merge', { current, next });
        current.from = Math.min(current.from, next.from);
        current.to = Math.max(current.to, next.to);
        ranges.splice(i + 1, 1);
        merged = true;
      }
    }
    if (merged) logger.debugMed('intermediate', ranges);
  }
  logger.debugLow('final', ranges);
  const total = ranges.map(({ from, to }) => to - from + 1).reduce((acc, item) => acc + item, 0);
  // 334714395325710
  logger.success('total', total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const parts = data.split('\n\n');
  const ranges = parts[0].split('\n').map((line) => {
    const tokens = line.split('-');
    return { from: parseInt(tokens[0]), to: parseInt(tokens[1]) };
  }).toSorted((a, b) => a.from - b.from);
  const available = parts[1].split('\n').map((line) => parseInt(line));
  logger.debugLow({ ranges });
  logger.debugLow({ available });
  if (part !== 2) part1(ranges, available, logger.makeChild('part1'));
  if (part !== 1) part2(ranges, available, logger.makeChild('part2'));
}

main();
