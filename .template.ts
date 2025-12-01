import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';

function part1(_data: string, _logger: Logger) {
}

function part2(_data: string, _logger: Logger) {
}

function main() {
  const logger = new Logger(import.meta.url);
  const { data, fileName, logLevel, ...args } = parseArgs(import.meta.url);
  logger.debugLow({ fileName, logLevel, ...args });
  if (args.part1) part1(data, new Logger(import.meta.url, 'part1', { logLevel }));
  if (args.part2) part2(data, new Logger(import.meta.url, 'part2', { logLevel }));
}

main();
