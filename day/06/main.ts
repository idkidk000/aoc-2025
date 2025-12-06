import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

// TODO: refactor a LOT

function part1(data: string, logger: Logger) {
  const intermediate = data.split('\n').map((line) => line.trim().split(/\s+/));
  logger.debugLow({ intermediate });
  const columns: { operation: string; values: number[] }[] = [];
  for (let c = 0; c < intermediate[0].length; ++c) {
    const operation = intermediate[intermediate.length - 1][c];
    const values = new Array<number>(intermediate[0].length - 1);
    for (let r = 0; r < intermediate.length - 1; ++r) {
      logger.debugMed({ c, r });
      values[r] = parseInt(intermediate[r][c]);
    }
    columns.push({ operation, values });
  }
  logger.debugLow({ columns });
  const calculated = columns.map(({ operation, values }) => {
    switch (operation) {
      case '+':
        return values.reduce((acc, item) => acc + item, 0);
      case '*':
        return values.reduce((acc, item) => acc * item, 1);
      default:
        throw new Error(`invalid operation${operation}`);
    }
  });
  logger.debugLow({ calculated });
  const total = calculated.reduce((acc, item) => acc + item, 0);
  // 4076006202939
  logger.success(total);
}

function part2(data: string, logger: Logger) {
  type Operation = '+' | '*';
  const rows = data.split('\n');
  const operationRow = rows[rows.length - 1].split('');
  const ranges: { from: number; to: number; operation: Operation }[] = [];
  let from = 0;
  let to = from;
  for (const [i, token] of operationRow.entries()) {
    logger.debugHigh({ i, token });
    if (i !== 0 && (token !== ' ' || i === operationRow.length - 1)) {
      if (i === operationRow.length - 1) to = i;
      logger.debugMed({ from, to, text: operationRow.slice(from, to).join('') });
      ranges.push({ from, to, operation: operationRow[from] as Operation });
      from = i;
      to = from;
    } else { to = i; }
  }
  logger.debugLow({ operationRow, ranges, len: operationRow.length });
  let total = 0;
  for (const range of ranges) {
    const values: number[] = [];
    for (let c = range.from; c <= range.to; ++c) {
      let value = '';
      for (let r = 0; r < rows.length - 1; ++r)
        value += rows[r][c];
      const trimmed = value.trim();
      if (trimmed.length) values.push(parseInt(trimmed));
    }
    logger.debugLow({ range, values });
    if (range.operation === '*') total += values.reduce((acc, item) => acc * item, 1);
    else if (range.operation === '+') total += values.reduce((acc, item) => acc + item, 0);
    else throw new Error(`invalid operation ${range.operation}`);
  }
  // 7903168391557
  logger.success(total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  if (part !== 2) part1(data, logger.makeChild('part1'));
  if (part !== 1) part2(data, logger.makeChild('part2'));
}

main();
