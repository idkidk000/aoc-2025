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

interface IndicatorsQueueItem {
  indicators: number;
  presses: number[];
}

function solveIndicators(machine: Machine, logger: Logger): IndicatorsQueueItem {
  const queue = new Deque<IndicatorsQueueItem>();
  queue.pushBack({ indicators: 0, presses: [] });
  while (queue.size) {
    const item = queue.popFront();
    if (!item) continue;
    // pressing button 1 then 2 is the same as 2 then 1
    // pressing button 1 twice is the same as not pressing it at all
    for (let b = (item.presses.at(-1) ?? -1) + 1; b < machine.buttons.length; ++b) {
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

// i couldn't write a solution which would complete in a reasonable amount of time and i won't use a solver lib
// copied from https://github.com/mkern75/AdventOfCodePython/blob/main/year2025/Day10.py so i can learn
// https://redlib.catsarch.com/r/adventofcode/comments/1pity70/2025_day_10_solutions/nta30mi/?context=3#nta30mi
function solveJoltage(machine: Machine, logger: Logger) {
  function optimiseButtons(): number[][] {
    const buttons = machine.buttons.map((button) =>
      new Array<number>(machine.joltage.length).fill(0).map((_, i) => button & (1 << i) ? i : null).filter((value) => value !== null)
    );

    const optimisedButtons: number[][] = [];
    const buttonValueCounts = new Map<number, number>();
    while (buttons.length) {
      buttonValueCounts.clear();
      for (const button of buttons) for (const value of button) buttonValueCounts.set(value, (buttonValueCounts.get(value) ?? 0) + 1);
      const [[id]] = buttonValueCounts.entries().toArray().toSorted((a, b) => a[1] - b[1] || a[0] - b[0]);
      let ix: number | null = null;
      for (const [b, button] of buttons.entries()) if (button.includes(id) && (ix === null || buttons[ix].length < button.length)) ix = b;
      if (ix === null) throw new Error('oh no');
      optimisedButtons.push(buttons[ix]);
      buttons.splice(ix, 1);
    }

    return optimisedButtons;
  }

  const buttons = optimiseButtons();

  const pressesRemaining = Array.from({ length: buttons.length + 1 }, () => new Array<number>(machine.joltage.length).fill(0));
  for (let b = buttons.length - 1; b >= 0; --b) {
    for (let j = 0; j < machine.joltage.length; ++j) pressesRemaining[b][j] += pressesRemaining[b + 1][j];
    for (const id of buttons[b]) ++pressesRemaining[b][id];
  }

  logger.debugMed({ buttons, pressesRemaining });

  let best = Infinity;
  function recurse(remain: number[], buttonId: number, pressesSoFar: number) {
    logger.debugHigh({ remain, buttonId, pressesSoFar });
    if (pressesSoFar >= best) return;
    if (pressesSoFar + remain.reduce((acc, item) => Math.max(acc, item)) >= best) return;
    if (buttonId === buttons.length) {
      if (remain.every((value) => value === 0)) best = pressesSoFar;
      return;
    }
    let minPresses = 0;
    let maxPresses = Infinity;
    for (const id of buttons[buttonId]) {
      maxPresses = Math.min(maxPresses, remain[id]);
      if (pressesRemaining[buttonId][id] === 1) minPresses = Math.max(minPresses, remain[id]);
    }
    if (minPresses > maxPresses) return;
    for (let press = minPresses; press <= maxPresses; ++press) {
      const nextRemain = [...remain];
      for (const id of buttons[buttonId]) nextRemain[id] -= press;
      recurse(nextRemain, buttonId + 1, pressesSoFar + press);
    }
  }

  recurse([...machine.joltage], 0, 0);
  if (best === Infinity) throw new Error('oh no');
  return best;
}

function part1(machines: Machine[], logger: Logger) {
  let total = 0;
  for (const [m, { orig, ...machine }] of machines.entries()) {
    logger.debugLow({ m }, orig);
    const solution = solveIndicators({ orig, ...machine }, logger);
    logger.debugLow('  ', solution.presses.map((ix) => orig.buttons[ix]));
    total += solution.presses.length;
  }
  // 558
  logger.success(total);
}

function part2(machines: Machine[], logger: Logger) {
  let total = 0;
  for (const [m, { orig, ...machine }] of machines.entries()) {
    const best = solveJoltage({ orig, ...machine }, logger);
    logger.debugLow({ m, orig, best });
    total += best;
  }
  // 20317
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
