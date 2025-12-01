import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Utils } from '@/lib/utils.0.ts';

function part1(operations: number[], logger: Logger) {
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

function part2(operations: number[], logger: Logger) {
  let value = 50;
  let zeroes = 0;
  for (const [i, operation] of operations.entries()) {
    const prev = value;
    const intermediate = value + operation;
    const newZeroes = (
      intermediate === 0 ? 1 : Math.floor(Math.abs(intermediate) / 100)
    ) + (
      prev > 0 && intermediate < 0 ? 1 : 0
    );
    zeroes += newZeroes;
    value = Utils.modP(intermediate, 100);
    logger.debugLow(i, { operation, prev, intermediate, value, newZeroes, zeroes });
  }
  // 6254
  logger.success('password', zeroes);
}

function main() {
  const { data, logger, ...args } = parseArgs(import.meta.url);
  const operations = data.split('\n').map((token) => parseInt(token.slice(1)) * (token.slice(0, 1) === 'L' ? -1 : 1));
  if (args.part1) part1(operations, logger.makeChild('part1'));
  if (args.part2) part2(operations, logger.makeChild('part2'));
}

main();
