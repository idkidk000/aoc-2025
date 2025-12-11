import { AocArgParser } from '@/lib/args.1.ts';
import { Deque } from '@/lib/deque.0.ts';
import { Logger } from '@/lib/logger.0.ts';

interface Machine {
  id: number;
  indicators: string;
  buttons: number[][];
  joltages: number[];
}

function part1(machines: Machine[], logger: Logger) {
  type Bitfield = number & { __brand: 'Bitfield' };
  interface QueueItem {
    indicators: Bitfield;
    buttonId: number;
    presses: number;
  }

  function solve(machine: Pick<Machine, 'indicators' | 'buttons'>): number {
    // convert indicators to a target number and buttons to xor masks
    const target = parseInt(machine.indicators.split('').map((token) => token === '#' ? '1' : '0').toReversed().join(''), 2) as Bitfield;
    const buttons = machine.buttons.map((button) => {
      let mask = 0;
      for (const indicatorId of button) mask |= 1 << indicatorId;
      return mask as Bitfield;
    });

    const queue = new Deque<QueueItem>();
    queue.pushBack({ indicators: 0 as Bitfield, buttonId: 0, presses: 0 });

    while (queue.size) {
      const item = queue.popFront();
      if (!item) continue;
      // each button can be pressed exactly 0 or 1 times. other counts create duplicate states
      for (let b = item.buttonId; b < buttons.length; ++b) {
        const button = buttons[b];
        const nextItem: QueueItem = {
          indicators: (item.indicators ^ button) as Bitfield,
          buttonId: b + 1,
          presses: item.presses + 1,
        };
        logger.debugMed({ item, button, nextItem });
        if (nextItem.indicators === target) return nextItem.presses;
        queue.pushBack(nextItem);
      }
    }

    throw new Error(`could not solve ${JSON.stringify(machine)}`);
  }

  let total = 0;
  for (const { joltages: _, id, ...machine } of machines) {
    logger.debugLow(id, '/', machines.length, machine);
    const presses = solve(machine);
    logger.debugLow('  ', presses);
    total += presses;
  }

  // 558
  logger.success(total);
}

/** i couldn't write a solution which would complete in a reasonable amount of time and i won't use a solver lib\
 * copied from https://github.com/mkern75/AdventOfCodePython/blob/main/year2025/Day10.py so i can learn\
 * https://redlib.catsarch.com/r/adventofcode/comments/1pity70/2025_day_10_solutions/nta30mi/?context=3#nta30mi */
function part2(machines: Machine[], logger: Logger) {
  // non-branded types would simplify to their primitives
  type ButtonId = number & { __brand: 'ButtonId' };
  type CounterId = number & { __brand: 'CounterId' };
  type CounterIdCount = number & { __brand: 'CounterIdCount'; __indexedBy: 'CounterId' };
  type Button = CounterId[] & { __brand: 'Button'; __indexedBy: 'ButtonId' };
  type Counters = number[] & { __brand: 'Counters'; __indexedBy: 'CounterId' };

  /** recursively sort buttons with least common counterIds of the remaining buttons towards the front */
  function optimiseButtons(buttons: Readonly<Machine['buttons']>): Button[] {
    const original = [...buttons];
    const optimised: Button[] = [];
    const counterIdCounts = new Map<number, number>();

    while (original.length) {
      counterIdCounts.clear();
      for (const counterId of original.flat()) counterIdCounts.set(counterId, (counterIdCounts.get(counterId) ?? 0) + 1);
      const [[counterId]] = counterIdCounts.entries().toArray().toSorted((a, b) => a[1] - b[1] || a[0] - b[0]);
      let bestIx = -1;
      for (const [b, button] of original.entries()) if (button.includes(counterId) && (bestIx === -1 || original[bestIx].length < button.length)) bestIx = b;
      optimised.push(original[bestIx] as Button);
      original.splice(bestIx, 1);
    }

    return optimised;
  }

  function solve({ id, ...machine }: Pick<Machine, 'buttons' | 'joltages' | 'id'>): number {
    const buttons = optimiseButtons(machine.buttons);

    /** counterId activation counts by buttonId, accumulated from the last toward the first\
     * used to detect when our button is the last which activates a given counter, i.e. it **must** be pressed */
    const buttonsRemaining: Record<ButtonId, CounterIdCount[]> = {};
    for (const [buttonId, button] of buttons.entries().toArray().toReversed()) {
      // accumulate from back to front
      const activations = buttonId === buttons.length - 1
        ? new Array<CounterIdCount>(machine.joltages.length).fill(0 as CounterIdCount)
        : [...buttonsRemaining[(buttonId + 1) as ButtonId]];
      // incremement counts for all counterIds in the current button
      for (const counterId of button) ++activations[counterId];
      buttonsRemaining[buttonId as ButtonId] = activations;
    }
    logger.debugHigh({ id, buttons, buttonsRemaining });

    let best = Infinity;
    function recurse(remain: Counters, buttonId: ButtonId, pressesSoFar: number) {
      if (pressesSoFar >= best || pressesSoFar + Math.max(...remain) >= best) return;

      // completed
      if (buttonId === buttons.length) {
        if (Math.max(...remain) === 0) {
          best = pressesSoFar;
          logger.debugMed({ id }, 'new best', pressesSoFar);
        }
        return;
      }

      const button = buttons[buttonId];
      /** 0 unless there is only one way left to complete one of the counters which our button activates*/
      let minPresses = 0;
      /** max presses before overrunning target in one of the counter fields*/
      let maxPresses = Infinity;

      for (const counterId of button) {
        maxPresses = Math.min(maxPresses, remain[counterId]);
        if (buttonsRemaining[buttonId][counterId] === 1) minPresses = Math.max(minPresses, remain[counterId]);
      }

      if (minPresses > maxPresses) return;

      for (let presses = minPresses; presses <= maxPresses; ++presses) {
        const nextRemain = [...remain] as Counters;
        for (const counterId of button) nextRemain[counterId] -= presses;
        // move to the next button
        recurse(nextRemain, (buttonId + 1) as ButtonId, pressesSoFar + presses);
      }
    }

    recurse([...machine.joltages] as Counters, 0 as ButtonId, 0);
    if (best === Infinity) throw new Error('oh no');
    return best;
  }

  let total = 0;
  for (const { indicators: _, id, ...machine } of machines) {
    logger.debugLow(id, '/', machines.length, machine);
    const started = performance.now();
    const presses = solve({ id, ...machine });
    logger.debugLow('  ', presses, { elapsed: performance.now() - started });
    total += presses;
  }
  // 20317
  logger.success(total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const machines: Machine[] = data.trimEnd().split('\n').map((line, id) => {
    const tokens = line.split(/\s+/);
    const indicators = tokens.shift()?.slice(1, -1);
    const joltages = tokens.pop()?.slice(1, -1).split(',').map((token) => parseInt(token));
    if (!indicators || !joltages) throw new Error('parsing error');
    const buttons = tokens.map((token) => token.slice(1, -1).split(',').map((value) => parseInt(value)));
    return { indicators, buttons, joltages, id };
  });
  if (part !== 2) part1(machines, logger.makeChild('part1'));
  if (part !== 1) part2(machines, logger.makeChild('part2'));
}

main();
