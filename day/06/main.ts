import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';

type Operation = '+' | '*';

function part1(data: string, logger: Logger) {
  const grid = data.split('\n').map((line) => line.trim().split(/\s+/));
  let total = 0;
  for (let c = 0; c < grid[0].length; ++c) {
    const operation = grid[grid.length - 1][c] as Operation;
    let value = operation === '*' ? 1 : 0;
    for (let r = 0; r < grid.length - 1; ++r) {
      if (operation === '+') value += parseInt(grid[r][c]);
      else if (operation === '*') value *= parseInt(grid[r][c]);
      else throw new Error(`invalid operation ${operation}`);
    }
    logger.debugLow({ c, operation, value });
    total += value;
  }
  // 4076006202939
  logger.success(total);
}

function part2(data: string, logger: Logger) {
  const rows = data.split('\n');
  let total = 0;
  let values: number[] = [];
  for (let c = rows[0].length - 1; c >= 0; --c) {
    let value = '';
    for (let r = 0; r < rows.length - 1; ++r) value += rows[r][c];
    const trimmed = value.trim();
    if (trimmed.length) values.push(parseInt(trimmed));
    const operation = rows[rows.length - 1][c] as Operation | ' ';
    if (operation === ' ') continue;
    logger.debugLow({ c, operation, values });
    if (operation === '+') total += values.reduce((acc, item) => acc + item, 0);
    else if (operation === '*') total += values.reduce((acc, item) => acc * item, 1);
    else throw new Error(`invalid operation ${operation}`);
    values = [];
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
