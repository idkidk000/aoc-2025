## Advent of Code 2025

### Requirements

This project uses [`deno`](https://deno.com/) and has [`aoc-2025-deno-libs`](../aoc-2025-deno-libs/readme.md) as a
[submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules).\
Either:

- Add `--recurse-submodules` to your `git clone` command, e.g. `git clone --recurse-submodules [repo_url] [local_dir]`
- Or run `git submodule init` and `git submodule fetch`

### Usage

To create day 1 from template and open in IDE:\
`deno task init 1`

To run day 1 part 2 with log level set to Debug:High (extremely verbose):\
`deno run -R day/01/main.ts -p 2 -l 0`

Args are documented in `lib/args.[version].ts`\
Log levels are documented in `lib/logger.[version].ts`

### Index

- [Day 01 - Secret Entrance](day/01/main.ts)
- [Day 02 - Gift Shop](day/02/main.ts)
- [Day 03 - Lobby](day/03/main.ts)
- [Day 04 - Printing Department](day/04/main.ts)
- [Day 05 - Cafeteria](day/05/main.ts)
- [Day 06 - Trash Compactor](day/06/main.ts)
- [Day 07 - Laboratories](day/07/main.ts)
- [Day 08 - Playground](day/08/main.ts)
- [Day 09 - Movie Theater](day/09/main.ts)
- [Day 10 - Factory](day/10/main.ts)
- [Day 11 - Reactor](day/11/main.ts)
- [Day 12 - ???](day/12/main.ts)
