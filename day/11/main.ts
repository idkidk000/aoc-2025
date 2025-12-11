import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

type Name = string;

function countPaths(devices: Map<Name, Name[]>, start: Name, end: Name, logger: Logger): number {
  const cache = new Map<Name, number>();
  function recurse(name: Name): number {
    const cached = cache.get(name);
    if (typeof cached !== 'undefined') return cached;
    if (name === end) return 1;
    const total = (devices.get(name) ?? []).map((output) => recurse(output)).reduce((acc, item) => acc + item, 0);
    cache.set(name, total);
    return total;
  }
  const paths = recurse(start);
  logger.debugMed('countPaths', { start, end, paths });
  return paths;
}

function part1(devices: Map<Name, Name[]>, logger: Logger) {
  const result = countPaths(devices, 'you', 'out', logger);
  // 662
  logger.success(result);
}

function part2(devices: Map<Name, Name[]>, logger: Logger) {
  const svrToDac = countPaths(devices, 'svr', 'dac', logger);
  const svrToFft = countPaths(devices, 'svr', 'fft', logger);

  const dacToFft = countPaths(devices, 'dac', 'fft', logger);
  const fftToDac = countPaths(devices, 'fft', 'dac', logger);

  const dacToOut = countPaths(devices, 'dac', 'out', logger);
  const fftToOut = countPaths(devices, 'fft', 'out', logger);

  logger.info({ svrToDac, svrToFft, dacToFft, fftToDac, dacToOut, fftToOut });

  const paths = (svrToDac * dacToFft * fftToOut) + (svrToFft * fftToDac * dacToOut);
  // 429399933071120
  logger.success(paths);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const devices = new Map<Name, Name[]>(
    data.split('\n').map((line) => {
      const tokens = line.replace(':', '').split(/\s+/);
      const name = tokens.shift();
      if (!name) throw new Error('oh no');
      return [name as Name, tokens as Name[]];
    }),
  );
  // logger.debugLow(devices);
  if (part !== 2) part1(devices, logger.makeChild('part1'));
  if (part !== 1) part2(devices, logger.makeChild('part2'));
}

main();
