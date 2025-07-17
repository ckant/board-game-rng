<h1 align="center">
  <img alt="logo" src="https://raw.githubusercontent.com/ckant/board-game-rng/main/src/lib/assets/logo.svg" width="75">
  <br>
  Board Game RNG
  <br>
</h1>

<h4 align="center">Random number generator for board games using [Svelte + SvelteKit](https://svelte.dev/) (v5)</h4>

<p align="center">
  <a href="https://svelte.dev">
    <img alt="Svelte" src="https://img.shields.io/badge/svelte-ff3e00.svg?style=for-the-badge&logo=svelte&logoColor=white&logoBackground=white" />
  </a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#examples">Examples</a> •
  <a href="#development">Development</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Features

- Generates 1 to 12 numbers between 1 and 100 with or without duplicates
- Supports query params for initial `quantity`, `from`, `to`, and `duplicates`

## Examples

### With default values

[ckant.github.io/board-game-rng](https://ckant.github.io/board-game-rng)

### With initial values

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

- [React Wheel Picker](https://react-wheel-picker.chanhdai.com/)
- [pure-rand](https://github.com/dubzzz/pure-rand)
- [Svelte](https://svelte.dev)

## License

Copyright © 2025 [Chris Kant](https://github.com/ckant).<br />
This project is [MIT](https://github.com/ckant/board-game-rng/blob/main/LICENSE) licensed.
