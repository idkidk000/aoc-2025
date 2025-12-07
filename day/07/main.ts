import { AocArgParser } from '@/lib/args.1.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { PackedMap } from '@/lib/packed-map.0.ts';
import { PackedSet } from '@/lib/packed-set.0.ts';
import { Point2D, Point2DLike } from '@/lib/point2d.0.ts';

function part1(data: string, logger: Logger) {
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  const start = grid.find((item) => item === 'S');
  if (!start) throw new Error('could not find start');
  let points = new PackedSet(Point2D.pack32, Point2D.unpack32);
  let nextPoints = new PackedSet(Point2D.pack32, Point2D.unpack32);
  let splits = 0;
  points.add(start);
  logger.debugLow(grid);
  for (let i = 0; i < grid.rows - 1; ++i) {
    for (const point of points) {
      const down = Point2D.add(point, { x: 0, y: -1 });
      if (grid.cellAt(down) === '^') {
        ++splits;
        for (const side of [Point2D.add(down, { x: -1, y: 0 }), Point2D.add(down, { x: 1, y: 0 })]) {
          grid.cellSet(side, '|');
          nextPoints.add(side);
          logger.debugMed('split', { point, down, side, splits });
        }
      } else {
        grid.cellSet(down, '|');
        nextPoints.add(down);
      }
    }
    logger.debugLow({ i }, grid);
    [points, nextPoints] = [nextPoints, points];
    nextPoints.clear();
  }
  // 1630
  logger.success(splits);
}

function part2(data: string, logger: Logger) {
  const grid = new Grid(data.split('\n').map((line) => line.split('')), CoordSystem.Xy);
  const start = grid.find((item) => item === 'S');
  if (!start) throw new Error('could not find start');
  let points = new PackedMap<Point2DLike, number, number>(Point2D.pack32, Point2D.unpack32);
  let nextPoints = new PackedMap<Point2DLike, number, number>(Point2D.pack32, Point2D.unpack32);
  points.set(start, 1);
  logger.debugLow(grid);
  for (let i = 0; i < grid.rows - 1; ++i) {
    for (const [point, count] of points) {
      const down = Point2D.add(point, { x: 0, y: -1 });
      if (grid.cellAt(down) === '^') {
        for (const side of [Point2D.add(down, { x: -1, y: 0 }), Point2D.add(down, { x: 1, y: 0 })]) {
          grid.cellSet(side, '|');
          nextPoints.set(side, (nextPoints.get(side) ?? 0) + count);
          logger.debugMed('split', { point, down, side });
        }
      } else {
        grid.cellSet(down, '|');
        nextPoints.set(down, (nextPoints.get(down) ?? 0) + count);
      }
    }
    logger.debugLow({ i }, nextPoints, grid);

    [points, nextPoints] = [nextPoints, points];
    nextPoints.clear();
  }
  const timelines = points.values().reduce((acc, item) => acc + item, 0);
  // 47857642990160
  logger.success(timelines);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  if (part !== 2) part1(data, logger.makeChild('part1'));
  if (part !== 1) part2(data, logger.makeChild('part2'));
}

main();
