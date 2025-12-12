import { AocArgParser } from '@/lib/args.1.ts';
import { CoordSystem, Grid } from '@/lib/grid.0.ts';
import { Logger } from '@/lib/logger.0.ts';

interface Region {
  w: number;
  h: number;
  counts: Map<number, number>;
}
type Fill = '#' | '.';
type Present = Grid<Fill, CoordSystem.Xy>;

function part1(regions: Region[], presents: Present[], logger: Logger) {
  let defFit = 0;
  let mightFit = 0;
  let wontFit = 0;
  for (const region of regions) {
    // each present is 3x3
    const compressedMaxPresentArea = region.counts.values().reduce((acc, item) => acc + item, 0);
    const compressedRegionArea = Math.floor(region.w / 3) * Math.floor(region.h / 3);
    const minPresentArea = region.counts
      .entries()
      .map(([presentId, count]) =>
        presents[presentId]
          .findAll((value) => value === '#')
          .reduce((acc) => ++acc, 0) * count
      )
      .reduce((acc, item) => acc + item, 0);
    const regionArea = region.w * region.h;
    if (compressedRegionArea >= compressedMaxPresentArea) ++defFit;
    else if (regionArea >= minPresentArea) ++mightFit;
    else ++wontFit;
  }
  logger.debugLow({ defFit, mightFit, wontFit });
  if (mightFit !== 0) throw new Error('oh no');
  // 534
  logger.success(defFit);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const presents: Present[] = [];
  const regions: Region[] = [];
  for (const section of data.split('\n\n')) {
    if (/^\d+:\n/.test(section)) {
      // present
      presents.push(new Grid(section.split('\n').slice(1).map((line) => line.split('') as Fill[]), CoordSystem.Xy));
    } else {
      // regions
      for (const match of section.matchAll(/^(?<w>\d+)x(?<h>\d+): (?<counts>[\d ]+)$/gm)) {
        if (!match.groups) throw new Error('parsing error');
        const region: Region = {
          w: parseInt(match.groups.w),
          h: parseInt(match.groups.h),
          counts: new Map(match.groups.counts.split(/\s+/).map((token) => parseInt(token)).map((count, i) => [i, count])),
        };
        regions.push(region);
      }
    }
  }
  logger.debugHigh({ presents });
  logger.debugHigh({ regions });

  if (part !== 2) part1(regions, presents, logger.makeChild('part1'));
}

main();
