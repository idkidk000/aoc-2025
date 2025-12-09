import { AocArgParser } from '@/lib/args.1.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { ansiStyles, Logger } from '@/lib/logger.0.ts';
import { HashedMap } from '@/lib/hashed-map.0.ts';
import { Point2D, Point2DLike } from '@/lib/point2d.0.ts';
import { Utils } from '@/lib/utils.0.ts';

interface Rect {
  left: Point2DLike;
  right: Point2DLike;
  area: number;
}
function part1(_points: Point2DLike[], rects: Rect[], logger: Logger) {
  const largest = rects[0];
  // 4748985168
  logger.success(largest.area);
}

function part2(points: Point2DLike[], rects: Rect[], logger: Logger) {
  const polyLines = points.map((a, i, arr) => {
    const b = arr[(i + 1) % arr.length];
    return { minX: Math.min(a.x, b.x), maxX: Math.max(a.x, b.x), minY: Math.min(a.y, b.y), maxY: Math.max(a.y, b.y) };
  });

  const pointCache = new HashedMap<Point2DLike, boolean, number>(Point2D.hash);
  function isPointInside(point: Point2DLike): boolean {
    const cached = pointCache.get(point);
    if (typeof cached !== 'undefined') return cached;
    // incredible disdain for untyped chaos and single-letter variable names
    // https://www.xjavascript.com/blog/check-if-polygon-is-inside-a-polygon/
    let inside = false;
    for (const { minX, minY, maxX, maxY } of polyLines) {
      if (point.x >= minX && point.y <= maxX && point.y >= minY && point.y <= maxY) {
        pointCache.set(point, true);
        return true;
      }
      // TODO: i just blindly copied this part and don't understand it
      if ((minY > point.y) !== (maxY > point.y)) {
        const xIntersect = ((point.y - minY) * (maxX - minX)) / (maxY - minY) + minX;
        if (point.x < xIntersect) inside = !inside;
      }
    }
    pointCache.set(point, inside);
    return inside;
  }

  function isRectInside(minX: number, maxX: number, minY: number, maxY: number) {
    // TODO: it competently

    // const bounds = Point2D.getBounds(points);
    // const grid = new Grid({ rows: bounds.maxY + 1, cols: bounds.maxX + 1, fill: '.' }, CoordSystem.Xy, (cell, coord) => {
    //   // if ((coord.x !== minX && coord.x !== maxX) || (coord.y !== minY || coord.y !== maxY)) return cell;
    //   if ([minX, maxX].includes(coord.x) && [minY, maxY].includes(coord.y)) {
    //     return `${ansiStyles.bold}${isPointInside(coord) ? ansiStyles.fgIntense.green : ansiStyles.fgIntense.red}${
    //       cell === '.' ? '@' : cell
    //     }${ansiStyles.reset}`;
    //   }
    //   return cell;
    // });
    // for (const point of points) grid.cellSet(point, '#');
    // logger.debugLow(grid);

    // check the edges since we have a primitive
    for (let y = minY + 1; y < maxY - 1; ++y) {
      if (!isPointInside({ x: minX, y })) return false;
      if (!isPointInside({ x: maxX, y })) return false;
    }
    for (let x = minX; x <= maxX; ++x) {
      if (!isPointInside({ x, y: minY })) return false;
      if (!isPointInside({ x, y: maxY })) return false;
      // find all intersections. merge since poly lines have width 1, flip inside, etc
      // doing this for every x is incredibly inefficient. could probably filter lines for relevant first then iterate over the smaller set
      // maybe theres a solution in breaking the whole area into rects and tagging them `internal`/`external` according to poly
      // then i'd just need to test against each external rect instead of all this
      const intersects: { minY: number; maxY: number }[] = [
        { minY: minY, maxY: minY },
        ...polyLines.filter((line) =>
          (line.minX === line.maxX && line.minX === x && line.minY <= maxY && line.maxY >= minY) ||
          (line.minY === line.maxY && line.minX <= maxX && line.minX >= minX && line.minY <= maxY && line.maxY >= minY)
        ).map(({ minY, maxY }) => ({ minY, maxY })),
        { minY: maxY, maxY: maxY },
      ].toSorted((a, b) => a.minY - b.minY || a.maxY - b.maxY);
      logger.debugHigh('isRectInside', { x }, intersects);
      const merged: { minY: number; maxY: number }[] = [];
      for (const intersect of intersects) {
        if (merged.length && (merged[merged.length - 1].maxY + 1) >= intersect.minY)
          merged[merged.length - 1].maxY = Math.max(merged[merged.length - 1].maxY, intersect.maxY);
        else merged.push(intersect);
      }
      logger.debugHigh({ x, merged });
      let inside = false;
      for (const [c, current] of merged.slice(0, -1).entries()) {
        const next = merged[c + 1];
        logger.debugHigh({ current, next, inside });
        // hole
        if (inside && current.maxY < next.minY - 1) return false;
        inside = !inside;
      }
      // this might be nonsense
      if (!inside && merged[merged.length - 1].maxY < maxY - 1) return false;
    }
    return true;
  }

  for (const [r, rect] of rects.entries()) {
    const [minX, maxX] = Utils.minMax(rect.left.x, rect.right.x);
    const [minY, maxY] = Utils.minMax(rect.left.y, rect.right.y);
    const corners: Point2DLike[] = [
      { x: minX, y: minY },
      { x: minX, y: maxY },
      { x: maxX, y: maxY },
      { x: maxX, y: minY },
    ];
    if (corners.some((corner) => !isPointInside(corner))) {
      logger.debugLow({ r }, 'corners not inside', rect);
      continue;
    }
    logger.debugLow({ r }, 'corners inside', rect);
    if (!isRectInside(minX, maxX, minY, maxY)) {
      logger.debugLow({ r }, 'rect not fully enclosed', rect);
      continue;
    }
    logger.info({ r }, 'rect fully enclosed', rect);
    // 1550760868
    logger.success(rect.area);
    return;
  }
  throw new Error('found no fully enclosed rect');
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
      const area = (Math.abs(right.x - left.x) + 1) * (Math.abs(right.y - left.y) + 1);
      rects.push({ left, right, area });
    }
  }
  rects.sort((a, b) => b.area - a.area);
  if (part !== 2) part1(points, rects, logger.makeChild('part1'));
  if (part !== 1) part2(points, rects, logger.makeChild('part2'));
}

main();
