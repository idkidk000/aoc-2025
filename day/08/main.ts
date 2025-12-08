import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';
import { PackedSet } from '@/lib/packed-set.0.ts';
import { Distance, Point3D, Point3DLike } from '@/lib/point3d.0.ts';

function part1(data: string, logger: Logger) {
  const points: (Point3DLike /*  & { used: boolean } */)[] = data.split('\n').map((line) => {
    const tokens = line.split(',').map((token) => parseInt(token));
    return { x: tokens[0], y: tokens[1], z: tokens[2] /* used: false */ };
  });

  const distances: { left: Point3DLike; right: Point3DLike; d2: number }[] = [];
  for (const [l, left] of points.entries()) {
    for (const right of points.slice(l + 1)) {
      const d2 = Point3D.distance(left, right, Distance.Hypot2);
      distances.push({ left, right, d2 });
    }
  }

  distances.sort((a, b) => a.d2 - b.d2);
  logger.debugLow('distances', distances.slice(0, 10));

  const circuits = points.map((point) => new PackedSet(Point3D.pack, Point3D.unpack, [point]));
  for (const distance of distances.slice(0, 1000)) {
    const l = circuits.findIndex((circuit) => circuit.has(distance.left));
    const r = circuits.findIndex((circuit) => circuit.has(distance.right));
    logger.debugLow(distance, { l, r });
    if (l === r) continue;
    if (l === -1 || r === -1) throw new Error('could not find one or more items');
    circuits[l] = circuits[l].union(circuits[r]);
    circuits.splice(r, 1);
    logger.debugLow(circuits);
  }

  const result = circuits.map((circuit) => circuit.size).toSorted((a, b) => b - a).slice(0, 3).reduce((acc, item) => acc * item, 1);
  // 90036
  logger.success('result', result);
}

function part2(data: string, logger: Logger) {
  const points: (Point3DLike /*  & { used: boolean } */)[] = data.split('\n').map((line) => {
    const tokens = line.split(',').map((token) => parseInt(token));
    return { x: tokens[0], y: tokens[1], z: tokens[2] /* used: false */ };
  });

  const distances: { left: Point3DLike; right: Point3DLike; d2: number }[] = [];
  for (const [l, left] of points.entries()) {
    for (const right of points.slice(l + 1)) {
      const d2 = Point3D.distance(left, right, Distance.Hypot2);
      distances.push({ left, right, d2 });
    }
  }

  distances.sort((a, b) => a.d2 - b.d2);
  logger.debugLow('distances', distances.slice(0, 10));

  const circuits = points.map((point) => new PackedSet(Point3D.pack, Point3D.unpack, [point]));
  let result: number | null = null;
  for (const distance of distances) {
    const l = circuits.findIndex((circuit) => circuit.has(distance.left));
    const r = circuits.findIndex((circuit) => circuit.has(distance.right));
    logger.debugLow(distance, { l, r });
    if (l === r) continue;
    if (l === -1 || r === -1) throw new Error('could not find one or more items');
    circuits[l] = circuits[l].union(circuits[r]);
    circuits.splice(r, 1);
    logger.debugLow(circuits);
    if (circuits.length === 1) {
      logger.info('single circuit', distance);
      result = distance.left.x * distance.right.x;
      break;
    }
  }

  // 6083499488
  if (result !== null) logger.success('result', result);
  else logger.error('did not merge circuit');
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  if (part !== 2) part1(data, logger.makeChild('part1'));
  if (part !== 1) part2(data, logger.makeChild('part2'));
}

main();
