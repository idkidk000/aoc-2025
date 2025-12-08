import { AocArgParser } from '@/lib/args.1.ts';
import { HashedSet } from '@/lib/hashed-set.0.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Distance, Point3D, Point3DLike } from '@/lib/point3d.0.ts';

interface PointDist {
  left: Point3DLike;
  right: Point3DLike;
  d2: number;
}

function simulate(distances: PointDist[], circuits: HashedSet<Point3DLike, number>[], logger: Logger, exitCondition: number | 'merged') {
  for (const distance of (typeof exitCondition === 'number' ? distances.slice(0, exitCondition) : distances)) {
    const l = circuits.findIndex((circuit) => circuit.has(distance.left));
    const r = circuits.findIndex((circuit) => circuit.has(distance.right));
    logger.debugLow(distance, { l, r });
    if (l === -1 || r === -1) throw new Error('could not find one or more items');
    if (l === r) continue;
    circuits[l] = circuits[l].union(circuits[r]);
    circuits.splice(r, 1);
    if (exitCondition === 'merged' && circuits.length === 1) {
      logger.info('single circuit', distance);
      return distance.left.x * distance.right.x;
    }
  }
  if (exitCondition === 'merged') throw new Error('did not merge circuits');
  return circuits.map((circuit) => circuit.size).toSorted((a, b) => b - a).slice(0, 3).reduce((acc, item) => acc * item, 1);
}

function part1(distances: PointDist[], circuits: HashedSet<Point3DLike, number>[], logger: Logger) {
  const result = simulate(distances, circuits, logger, 1000);
  // 90036
  logger.success('result', result);
}

function part2(distances: PointDist[], circuits: HashedSet<Point3DLike, number>[], logger: Logger) {
  const result = simulate(distances, circuits, logger, 'merged');
  // 6083499488
  logger.success('result', result);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const points: Point3DLike[] = data.split('\n').map((line) => {
    const tokens = line.split(',').map((token) => parseInt(token));
    return { x: tokens[0], y: tokens[1], z: tokens[2] };
  });
  const distances: PointDist[] = [];
  for (const [l, left] of points.entries()) {
    for (const right of points.slice(l + 1)) {
      const d2 = Point3D.distance(left, right, Distance.Hypot2);
      distances.push({ left, right, d2 });
    }
  }
  distances.sort((a, b) => a.d2 - b.d2);
  if (part !== 2) part1(distances, points.map((point) => new HashedSet(Point3D.hash, [point])), logger.makeChild('part1'));
  if (part !== 1) part2(distances, points.map((point) => new HashedSet(Point3D.hash, [point])), logger.makeChild('part2'));
}

main();
