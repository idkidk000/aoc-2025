import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';
import { PackedMap } from '@/lib/packed-map.0.ts';
import { Point2D, Point2DLike } from '@/lib/point2d.0.ts';

interface Line {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
interface Rect extends Line {
  area: number;
}

function part1(_points: Point2DLike[], rects: Rect[], logger: Logger) {
  const largest = rects[0];
  // 4748985168
  logger.success(largest.area);
}

function part2(points: Point2DLike[], rects: Rect[], logger: Logger) {
  const lines: Line[] = points.map((a, i, arr) => {
    const b = arr[(i + 1) % arr.length];
    const [minX, maxX] = a.x < b.x ? [a.x, b.x] : [b.x, a.x];
    const [minY, maxY] = a.y < b.y ? [a.y, b.y] : [b.y, a.y];
    return { minX, maxX, minY, maxY };
  });

  // only need to test the coordinates which have features
  const xs = [...new Set(points.map(({ x }) => x))];
  const ys = [...new Set(points.map(({ y }) => y))];

  const pointCache = new PackedMap<Point2DLike, boolean, number>(Point2D.hash);
  function isPointInside(point: Point2DLike): boolean {
    const cached = pointCache.get(point);
    if (typeof cached !== 'undefined') return cached;
    // https://www.xjavascript.com/blog/check-if-polygon-is-inside-a-polygon/
    let inside = false;
    for (const line of lines) {
      if ((line.minY > point.y) !== (line.maxY > point.y)) {
        const xIntersect = ((point.y - line.minY) * (line.maxX - line.minX)) / (line.maxY - line.minY) + line.minX;
        if (point.x < xIntersect) inside = !inside;
      }
    }
    pointCache.set(point, inside);
    return inside;
  }

  function isRectInside(rect: Rect): boolean {
    // fail quickly on the corners and center
    if (!isPointInside({ x: rect.minX, y: rect.minY })) return false;
    if (!isPointInside({ x: rect.maxX, y: rect.maxY })) return false;
    if (!isPointInside({ x: rect.minX, y: rect.maxY })) return false;
    if (!isPointInside({ x: rect.maxX, y: rect.minY })) return false;
    if (!isPointInside({ x: rect.minX + Math.floor((rect.maxX - rect.minX) / 2), y: rect.minY + Math.floor((rect.maxY - rect.minY) / 2) })) return false;
    // brute force the edges and interior in compressed coordinate space
    // duplicates will hit the cache
    const rectXs = xs.filter((x) => x >= rect.minX && x <= rect.maxX);
    const rectYs = ys.filter((y) => y >= rect.minY && y <= rect.maxY);
    for (const x of rectXs) for (const y of rectYs) if (!isPointInside({ x, y })) return false;
    return true;
  }

  const largest = rects.find(isRectInside);
  if (!largest) throw new Error('found no fully enclosed rect');
  // 1550760868
  logger.success(largest.area);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const points: Point2DLike[] = data.split('\n').map((line) => {
    const parts = line.split(',').map((token) => parseInt(token));
    return { x: parts[0], y: parts[1] };
  });
  const rects: Rect[] = [];
  for (const [l, left] of points.entries()) {
    for (const right of points.slice(l + 1)) {
      const [minX, maxX] = left.x < right.x ? [left.x, right.x] : [right.x, left.x];
      const [minY, maxY] = left.y < right.y ? [left.y, right.y] : [right.y, left.y];
      const area = (maxX - minX + 1) * (maxY - minY + 1);
      rects.push({ minX, minY, maxX, maxY, area });
    }
  }
  rects.sort((a, b) => b.area - a.area);
  if (part !== 2) part1(points, rects, logger.makeChild('part1'));
  if (part !== 1) part2(points, rects, logger.makeChild('part2'));
}

main();
