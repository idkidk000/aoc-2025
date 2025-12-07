import { AocArgParser } from '@/lib/args.1.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { PackedMap } from '@/lib/packed-map.0.ts';
import { PackedSet } from '@/lib/packed-set.0.ts';
import { Point2D, Point2DLike } from '@/lib/point2d.0.ts';

function part1(grid: Grid<string, CoordSystem.Xy>, start: Point2DLike, logger: Logger) {
  let points = new PackedSet(Point2D.pack32, Point2D.unpack32, [start]);
  let nextPoints = new PackedSet(Point2D.pack32, Point2D.unpack32);
  let splits = 0;
  for (let y = start.y; y >= 0; --y) {
    for (const point of points) {
      const down = Point2D.add(point, { x: 0, y: -1 });
      if (grid.cellAt(down) === '^') {
        ++splits;
        for (const side of [Point2D.add(down, { x: -1, y: 0 }), Point2D.add(down, { x: 1, y: 0 })]) {
          nextPoints.add(side);
          logger.debugLow('split', { point, down, side, splits });
        }
      } else { nextPoints.add(down); }
    }
    [points, nextPoints] = [nextPoints, points];
    nextPoints.clear();
  }
  // 1630
  logger.success(splits);
}

function part2(grid: Grid<string, CoordSystem.Xy>, start: Point2DLike, logger: Logger) {
  let points = new PackedMap<Point2DLike, number, number>(Point2D.pack32, Point2D.unpack32, [[start, 1]]);
  let nextPoints = new PackedMap<Point2DLike, number, number>(Point2D.pack32, Point2D.unpack32);
  for (let y = start.y; y >= 0; --y) {
    for (const [point, count] of points) {
      const down = Point2D.add(point, { x: 0, y: -1 });
      if (grid.cellAt(down) === '^') {
        for (const side of [Point2D.add(down, { x: -1, y: 0 }), Point2D.add(down, { x: 1, y: 0 })]) {
          nextPoints.set(side, (nextPoints.get(side) ?? 0) + count);
          logger.debugLow('split', { point, down, side, count });
        }
      } else { nextPoints.set(down, (nextPoints.get(down) ?? 0) + count); }
    }
    [points, nextPoints] = [nextPoints, points];
    nextPoints.clear();
  }
  const timelines = points.values().reduce((acc, item) => acc + item, 0);
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
