import { parseArgs } from '@/lib/args.0.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Offset2D, Point2D, Point2DLike } from '@/lib/point2d.0.ts';

function part1(data: string, logger: Logger) {
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  // logger.debugLow(grid);
  // const displayGrid = new Grid(grid);
  let total = 0;
  for (const current of grid.findAll((item) => item === '@')) {
    let count = 0;
    for (const neighbour of Point2D.neighbours(current, 1, Offset2D.Square)) {
      logger.debugHigh(current, neighbour, grid.inBounds(neighbour), grid.cellAt(neighbour));
      if (grid.inBounds(neighbour) && grid.cellAt(neighbour) === '@') {
        ++count;
        if (count === 4) break;
      }
    }
    if (count < 4) {
      // displayGrid.cellSet(current, 'x');
      ++total;
      logger.debugMed(current, { count, total });
    }
  }
  // logger.debugLow(displayGrid);
  // 1467
  logger.success('total', total);
}

function part2(data: string, logger: Logger) {
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  let total = 0;
  while (true) {
    const toRemove: Point2DLike[] = [];
    for (const current of grid.findAll((item) => item === '@')) {
      let count = 0;
      for (const neighbour of Point2D.neighbours(current, 1, Offset2D.Square)) {
        logger.debugHigh(current, neighbour, grid.inBounds(neighbour), grid.cellAt(neighbour));
        if (grid.inBounds(neighbour) && grid.cellAt(neighbour) === '@') {
          ++count;
          if (count === 4) break;
        }
      }
      if (count < 4) {
        ++total;
        toRemove.push(current);
      }
    }
    if (toRemove.length) {
      for (const point of toRemove) grid.cellSet(point, '.');
    } else { break; }
  }
  // 8484
  logger.success('total', total);
}

function main() {
  const { data, logger, ...args } = parseArgs(import.meta.url);
  if (args.part1) part1(data, logger.makeChild('part1'));
  if (args.part2) part2(data, logger.makeChild('part2'));
}

main();
