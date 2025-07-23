<h1 align="center">
  <img alt="logo" src="https://raw.githubusercontent.com/ckant/board-game-rng/main/src/lib/assets/logo.svg" width="75">
  <br>
  Board Game RNG
  <br>
</h1>

<h4 align="center">Random number generator for board games using <a href="https://svelte.dev/">Svelte + SvelteKit</a></h4>

<p align="center">
  <a href="https://svelte.dev">
    <img alt="Svelte" src="https://img.shields.io/badge/svelte-ff3e00.svg?style=for-the-badge&logo=svelte&logoColor=white&logoBackground=white" />
  </a>
</p>

<p align="center">
  <a href="#summary">Summary</a> •
  <a href="#features">Features</a> •
  <a href="#examples">Examples</a> •
  <a href="#development">Development</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<div align="center"><img src="https://raw.githubusercontent.com/ckant/board-game-rng/main/media/demo.png" alt="preview" width="50%"></div>

## Summary

### Helps you pick starting cards for board games

- Lots of games have decks of cards that you draw from only once at the start of the game
- These decks might only have a handful of cards, which makes them hard to shuffle
- Oftentimes, they just get a quick and dirty shuffle to avoid the hassle
- Most of the cards get returned to the box, so most of that shuffling goes to waste

**Avoid the shuffling and pick some random cards instead**

e.g. If you need **5** starting cards from a deck of **25** possible ones:

- Generate **5** random numbers from **1** to **25** (without duplicates)
  - Let's say you get **3**, **4**, **11**, **12**, and **17**
- Pick out the **3rd**, **4th**, **11th**, **12th**, and **17th** cards from the deck and you're set

## Features

- Mobile-first design with number-picker wheels and simple toggles
- Query params to allow for bookmarking custom initial values

## Examples

### With default initial values

> [!NOTE]
> Defaults to generating 2 numbers from 1 to 6 without duplicates

[ckant.github.io/board-game-rng](https://ckant.github.io/board-game-rng)

### With custom initial values

> [!NOTE]
> Custom initial values can be set for `quantity`, `from`, `to`, and `duplicates`

> [!TIP]
> Save a bookmark for one-click generation in the future

[ckant.github.io/board-game-rng?quantity=5&from=5&to=20&duplicates](https://ckant.github.io/board-game-rng?quantity=5&from=5&to=20&duplicates)

## Development

### Install dependencies

```bash
npm install
```

### Start dev server

```bash
npm run dev -- --open
```

### Make changes

See [Svelte](https://svelte.dev/docs/svelte/overview) and [SvelteKit](https://svelte.dev/docs/kit/introduction) docs

### Build

```bash
npm run build
```

### Preview (production)

```bash
npm run preview -- --open
```

## Credits

- [React Wheel Picker](https://react-wheel-picker.chanhdai.com/) for the great picker wheels (ported to svelte)
- [pure-rand](https://github.com/dubzzz/pure-rand) for the (unbiased) uniform int distribution
- [Svelte](https://svelte.dev) for the fun web framework

## License

Copyright © 2025 [Chris Kant](https://github.com/ckant).<br />
This project is [MIT](https://github.com/ckant/board-game-rng/blob/main/LICENSE) licensed.
