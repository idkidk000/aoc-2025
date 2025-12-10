import { AocArgParser } from '@/lib/args.1.ts';
import { Logger } from '@/lib/logger.0.ts';
import { Deque } from '@/lib/deque.0.ts';

/** `indicators`: bitfield of indicator string
 *
 * `buttons`: array of xor masks */
interface Machine {
  indicators: number;
  buttons: number[];
  joltage: number[];
  orig: {
    indicators: string;
    buttons: string[];
    joltage: string;
  };
}

/** `presses`: array of button indices */
interface IndicatorsQueueItem {
  indicators: number;
  presses: number[];
}

/** `presses`: array of button indices */
interface JoltageQueueItem {
  counters: number[];
  presses: number[];
}

function solveIndicators(machine: Machine, logger: Logger): IndicatorsQueueItem {
  const queue = new Deque<IndicatorsQueueItem>();
  queue.pushBack({ indicators: 0, presses: [] });
  while (queue.size) {
    const item = queue.popFront();
    if (!item) continue;
    const prevB = item.presses.at(-1) ?? 0;
    for (let b = prevB; b < machine.buttons.length; ++b) {
      // pressing button 1 then 2 is the same as 2 then 1
      if (b < prevB) continue;
      const button = machine.buttons[b];
      const nextItem: IndicatorsQueueItem = {
        indicators: item.indicators ^ button,
        presses: [...item.presses, b],
      };
      logger.debugMed({ item, button, nextItem });
      if (nextItem.indicators === machine.indicators) return nextItem;
      queue.pushBack(nextItem);
    }
  }
  throw new Error('oh no');
}

function part1(machines: Machine[], logger: Logger) {
  let total = 0;
  for (const [m, { orig, ...machine }] of machines.entries()) {
    logger.debugLow({ m }, machine);
    logger.debugLow({ orig });
    const solution = solveIndicators({ orig, ...machine }, logger);
    logger.debugLow('  ', solution.presses.map((ix) => orig.buttons[ix]));
    total += solution.presses.length;
  }
  // 558
  logger.success(total);
}

/*
  needs more optimization. lcm of machine.joltage where multipliers are constrained to machine.buttons maybe
*/
function solveJoltage(machine: Machine, logger: Logger): JoltageQueueItem {
  const queue = new Deque<JoltageQueueItem>();
  queue.pushBack({ counters: [...machine.joltage].fill(0), presses: [] });
  while (queue.size) {
    const item = queue.popFront();
    if (!item) continue;
    const prevB = item.presses.at(-1) ?? 0;
    for (let b = 0; b < machine.buttons.length; ++b) {
      if (b < prevB) continue;
      const button = machine.buttons[b];
      const nextCounters = [...item.counters];
      for (let i = 0; i < nextCounters.length; ++i)
        if (button & (1 << i)) ++nextCounters[i];
      const nextItem: JoltageQueueItem = {
        counters: nextCounters,
        presses: [...item.presses, b],
      };
      logger.debugMed({ item, button, nextItem });
      if (nextItem.counters.every((counter, i) => counter === machine.joltage[i])) return nextItem;
      if (nextItem.counters.some((counter, i) => counter > machine.joltage[i])) continue;
      queue.pushBack(nextItem);
    }
  }
  throw new Error('oh no');
}

function part2(machines: Machine[], logger: Logger) {
  let total = 0;
  for (const [m, { orig, ...machine }] of machines.entries()) {
    logger.debugLow({ m }, machine);
    logger.debugLow({ orig });
    const solution = solveJoltage({ orig, ...machine }, logger);
    logger.debugLow('  ', solution.presses.map((ix) => orig.buttons[ix]), solution.presses.length);
    total += solution.presses.length;
  }
  logger.success(total);
}

function main() {
  const { data, logger, part } = new AocArgParser(import.meta.url);
  const machines: Machine[] = data.split('\n').map((line) => {
    const tokens = line.split(/\s+/);
    // deno-lint-ignore no-non-null-assertion
    const strIndicators = tokens.shift()!;
    const indicators = parseInt(strIndicators.slice(1, -1).split('').map((token) => token === '#' ? '1' : '0').toReversed().join(''), 2);
    // deno-lint-ignore no-non-null-assertion
    const strJoltage = tokens.pop()!;
    const joltage = strJoltage.slice(1, -1).split(',').map((token) => parseInt(token));
    const buttons = tokens.map((token) => {
      const values = token.slice(1, -1).split(',').map((value) => parseInt(value));
      let mask = 0;
      for (const value of values) mask |= 1 << value;
      return mask;
    });
    return { indicators, buttons, joltage, orig: { buttons: tokens, indicators: strIndicators, joltage: strJoltage } };
  });
  if (part !== 2) part1(machines, logger.makeChild('part1'));
  if (part !== 1) part2(machines, logger.makeChild('part2'));
}

main();
