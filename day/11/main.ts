import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

type Devices = Map<string, string[]>;

function countPaths(devices: Devices, start: string, end: string, logger: Logger): number {
  const cache = new Map<string, number>();

  function recurse(name: string): number {
    if (name === end) return 1;
    const cached = cache.get(name);
    if (typeof cached !== 'undefined') return cached;
    const outputs = devices.get(name) ?? [];
    const count = outputs.map((output) => recurse(output)).reduce((acc, item) => acc + item, 0);
    cache.set(name, count);
    return count;
  }

  const total = recurse(start);
  logger.debugLow('countPaths', { start, end, total });
  return total;
}

function part1(devices: Devices, logger: Logger) {
  const result = countPaths(devices, 'you', 'out', logger);
  // 662
  logger.success(result);
}

function part2(devices: Devices, logger: Logger) {
  const result = (
    countPaths(devices, 'svr', 'dac', logger) *
    countPaths(devices, 'dac', 'fft', logger) *
    countPaths(devices, 'fft', 'out', logger)
  ) + (
    countPaths(devices, 'svr', 'fft', logger) *
    countPaths(devices, 'fft', 'dac', logger) *
    countPaths(devices, 'dac', 'out', logger)
  );
  // 429399933071120
  logger.success(result);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const devices: Devices = new Map(
    data.split('\n').map((line) => {
      const tokens = line.replace(':', '').split(/\s+/);
      const name = tokens.shift();
      if (!name) throw new Error('oh no');
      return [name, tokens];
    }),
  );
  logger.debugHigh(devices);
  if (part !== 2) part1(devices, logger.makeChild('part1'));
  if (part !== 1) part2(devices, logger.makeChild('part2'));
}

main();
