import { AocArgParser } from '@/lib/args.1.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Offset2D, Point2D, Point2DLike } from '@/lib/point2d.0.ts';

function part1(grid: Grid<string, CoordSystem.Xy>, logger: Logger) {
  let total = 0;
  for (const current of grid.findAll((item) => item === '@')) {
    let count = 0;
    for (const neighbour of Point2D.neighbours(current, 1, Offset2D.Square)) {
      logger.debugMed(current, neighbour, grid.inBounds(neighbour), grid.cellAt(neighbour));
      if (grid.inBounds(neighbour) && grid.cellAt(neighbour) === '@') {
        ++count;
        if (count === 4) break;
      }
    }
    if (count < 4) {
      ++total;
      logger.debugLow(current, { count, total });
    }
  }
  // 1467
  logger.success('total', total);
}

function part2(grid: Grid<string, CoordSystem.Xy>, logger: Logger) {
  let total = 0;
  while (true) {
    const toRemove: Point2DLike[] = [];
    for (const current of grid.findAll((item) => item === '@')) {
      let count = 0;
      for (const neighbour of Point2D.neighbours(current, 1, Offset2D.Square)) {
        if (grid.inBounds(neighbour) && grid.cellAt(neighbour) === '@') {
          ++count;
          if (count === 4) break;
        }
      }
      if (count < 4) toRemove.push(current);
    }
    if (toRemove.length) {
      for (const point of toRemove) grid.cellSet(point, '.');
      total += toRemove.length;
      logger.debugLow({ toRemove, total });
    } else { break; }
  }
  // 8484
  logger.success('total', total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  if (part !== 2) part1(grid, logger.makeChild('part1'));
  if (part !== 1) part2(grid, logger.makeChild('part2'));
}

main();
