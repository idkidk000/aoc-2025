import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';

function part1(_data: string, _logger: Logger) {
}

function part2(_data: string, _logger: Logger) {
}

function main() {
  const { data, logger, ...args } = parseArgs(import.meta.url);
  if (args.part1) part1(data, logger.makeChild('part1'));
  if (args.part2) part2(data, logger.makeChild('part2'));
}

main();
