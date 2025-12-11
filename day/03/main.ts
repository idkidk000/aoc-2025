import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

function calculate(banks: number[][], count: number, logger: Logger): number {
  let total = 0;
  for (const bank of banks) {
    const batteries = new Array<number>(count);
    let prevIndex = -1;
    for (let b = 0; b < count; ++b) {
      let bestIndex = -1;
      let bestValue = -1;
      for (let i = prevIndex + 1; i <= bank.length - count + b; ++i) {
        if (bank[i] <= bestValue) continue;
        bestIndex = i;
        bestValue = bank[i];
      }
      batteries[b] = bestValue;
      logger.debugMed(bank, { batteries, b, prevIndex, bestIndex, bestValue });
      if (bestIndex < 0 || bestValue < 0) throw new Error('no bestIndex found');
      prevIndex = bestIndex;
    }
    const bankValue = parseInt(batteries.join(''));
    logger.debugLow({ bankValue });
    total += bankValue;
  }
  return total;
}

function part1(banks: number[][], logger: Logger) {
  const total = calculate(banks, 2, logger);
  // 17087
  logger.success('total', total);
}

function part2(banks: number[][], logger: Logger) {
  const total = calculate(banks, 12, logger);
  // 169019504359949
  logger.success('total', total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const banks = data.split('\n').map((line) => line.split('').map((token) => parseInt(token)));
  logger.debugLow(banks.map((bank) => `\n${bank.toString()}`).join(''));
  if (part !== 2) part1(banks, logger.makeChild('part1'));
  if (part !== 1) part2(banks, logger.makeChild('part2'));
}

main();
