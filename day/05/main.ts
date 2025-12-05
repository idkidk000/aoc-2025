import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

function part1(data: string, logger: Logger) {
  logger.debugLow({ data });
  const parts = data.split('\n\n');
  const freshRanges = parts[0].split('\n').map((line) => {
    const tokens = line.split('-');
    return { from: parseInt(tokens[0]), to: parseInt(tokens[1]) };
  });
  const available = parts[1].split('\n').map((line) => parseInt(line));
  logger.debugLow({ freshRanges });
  logger.debugLow({ available });
  const availableFresh = available.filter((av) => freshRanges.find((fr) => fr.from <= av && fr.to >= av));
  logger.debugLow({ availableFresh });
  // 848
  const count = availableFresh.length;
  logger.success('count', count);
}

function part2(data: string, logger: Logger) {
  const ranges = data.split('\n\n')[0].split('\n').map((line) => {
    const tokens = line.split('-');
    return { from: parseInt(tokens[0]), to: parseInt(tokens[1]) };
  }).toSorted((a, b) => a.from - b.from);
  logger.debugLow({ ranges });

  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < ranges.length - 1; ++i) {
      const current = ranges[i];
      const next = ranges[i + 1];
      if (current.to >= next.from) {
        logger.debugLow('merge', { current, next });
        current.from = Math.min(current.from, next.from);
        current.to = Math.max(current.to, next.to);
        logger.debugLow('  local', { current });
        ranges.splice(i + 1, 1);
        logger.debugLow('  array', ranges[i]);
        merged = true;
      }
    }
    logger.debugLow(ranges);
  }
  logger.debugLow('final', ranges);
  const total = ranges.map(({ from, to }) => to - from + 1).reduce((acc, item) => acc + item, 0);
  // 334714395325710
  logger.success('total', total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  if (part !== 2) part1(data, logger.makeChild('part1'));
  if (part !== 1) part2(data, logger.makeChild('part2'));
}

main();
