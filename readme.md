## Advent of Code 2025

### Requirements

This project uses [`deno`](https://deno.com/) and has my [`aoc-2025-deno-libs`](https://github.com/idkidk000/aoc-2025-deno-libs) project as a
[submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules). There are no other external dependencies.\
Either:

- Add `--recurse-submodules` to your `git clone` command, e.g. `git clone --recurse-submodules [repo_url] [local_dir]`
- Or run `git submodule init` and `git submodule update`

### Usage

To create day 1 from template and open in IDE:\
`deno task init 1`

To run day 1 part 2 with log level set to Debug:High (extremely verbose):\
`deno run -R day/01/main.ts -p 2 -l 0`

Args are documented in `lib/args.[version].ts`\
Log levels are documented in `lib/logger.[version].ts`

### Benchmarks

| Day                                        | Part 1 | Part 2   |
| ------------------------------------------ | ------ | -------- |
| [01 - Secret Entrance](day/01/main.ts)     | 0.051s | 0.054s   |
| [02 - Gift Shop](day/02/main.ts)           | 0.199s | 0.475s   |
| [03 - Lobby](day/03/main.ts)               | 0.050s | 0.053s   |
| [04 - Printing Department](day/04/main.ts) | 0.088s | 0.254s   |
| [05 - Cafeteria](day/05/main.ts)           | 0.049s | 0.052s   |
| [06 - Trash Compactor](day/06/main.ts)     | 0.048s | 0.051s   |
| [07 - Laboratories](day/07/main.ts)        | 0.059s | 0.063s   |
| [08 - Playground](day/08/main.ts)          | 0.242s | 0.256s   |
| [09 - Movie Theater](day/09/main.ts)       | 0.179s | 0.243s   |
| [10 - Factory](day/10/main.ts)             | 0.065s | 107.035s |
| [11 - Reactor](day/11/main.ts)             | 0.048s | 0.052s   |
| [12 - Christmas Tree Farm](day/12/main.ts) | 0.068s | -        |
