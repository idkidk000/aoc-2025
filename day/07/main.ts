import { AocArgParser } from '@/lib/args.1.ts';
import { Counter } from '@/lib/counter.0.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Point2DLike } from '@/lib/point2d.0.ts';

function part1(grid: Grid<string, CoordSystem.Xy>, start: Point2DLike, logger: Logger) {
  let xs = new Set([start.x]);
  let nextXs = new Set<number>();
  let splits = 0;
  for (let y = start.y; y >= 0; --y) {
    for (const x of xs) {
      if (grid.cellAt({ x, y: y - 1 }) === '^') {
        ++splits;
        for (const xOffset of [-1, 1]) {
          nextXs.add(x + xOffset);
          logger.debugLow('split', { x, y, xOffset, splits });
        }
      } else { nextXs.add(x); }
    }
    [xs, nextXs] = [nextXs, xs];
    nextXs.clear();
  }
  // 1630
  logger.success(splits);
}

function part2(grid: Grid<string, CoordSystem.Xy>, start: Point2DLike, logger: Logger) {
  let xs = new Counter<number, number>(0, 1, [[start.x, 1]]);
  let nextXs = new Counter<number, number>(0, 1);
  for (let y = start.y; y >= 0; --y) {
    for (const [x, count] of xs.entries()) {
      if (grid.cellAt({ x, y: y - 1 }) === '^') {
        for (const xOffset of [-1, 1]) {
          nextXs.add(x + xOffset, count);
          logger.debugLow('split', { x, y, xOffset, count });
        }
      } else { nextXs.add(x, count); }
    }
    [xs, nextXs] = [nextXs, xs];
    nextXs.clear();
  }
  const timelines = xs.values().reduce((acc, item) => acc + item, 0);
  // 47857642990160
  logger.success(timelines);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  const start = grid.find((item) => item === 'S');
  if (!start) throw new Error('could not find start');
  if (part !== 2) part1(grid, start, logger.makeChild('part1'));
  if (part !== 1) part2(grid, start, logger.makeChild('part2'));
}

main();
