import { parseArgs } from '@/lib/args.0.ts';
import { Logger } from '@/lib/logger.0.ts';

function part1(banks: number[][], logger: Logger) {
  let total = 0;
  for (const bank of banks) {
    let index0 = -1;
    let value0 = -Infinity;
    for (let i = 0; i < bank.length - 1; ++i) {
      const value = bank[i];
      if (value > value0) {
        index0 = i;
        value0 = value;
      }
    }
    let index1 = -1;
    let value1 = -Infinity;
    for (let i = index0 + 1; i < bank.length; ++i) {
      const value = bank[i];
      if (value > value1) {
        index1 = i;
        value1 = value;
      }
    }
    const value = parseInt(`${value0}${value1}`);
    logger.debugLow(bank, { index0, value0, index1, value1 }, value);
    if (value0 === -Infinity || value1 === -Infinity || isNaN(value)) throw new Error('no');
    total += value;
  }
  // 17087
  logger.success('total', total);
}

function part2(banks: number[][], logger: Logger) {
  let total = 0;
  const batteries = 12;
  for (const bank of banks) {
    const values: number[] = [];
    let prevIndex = -1;
    for (let b = 0; b < batteries; ++b) {
      let index = -1;
      let value = -Infinity;
      for (let i = prevIndex + 1; i <= bank.length - (batteries - b); ++i) {
        if (bank[i] > value) {
          index = i;
          value = bank[i];
        }
      }
      logger.debugMed(bank, { values, b, index, value });
      if (index < 0 || value === -Infinity) throw new Error('no');
      values.push(value);
      prevIndex = index;
    }
    const bankValue = parseInt(values.join(''));
    logger.debugLow(bank, values, bankValue);
    if (values.length !== batteries) throw new Error('no');
    total += bankValue;
  }
  // 169019504359949
  logger.success('total', total);
}

function main() {
  const { data, logger, ...args } = parseArgs(import.meta.url);
  const banks = data.split('\n').map((line) => line.split('').map((token) => parseInt(token)));
  logger.debugLow(banks.map((bank) => `\n${bank.toString()}`).join(''));
  if (args.part1) part1(banks, logger.makeChild('part1'));
  if (args.part2) part2(banks, logger.makeChild('part2'));
}

main();
