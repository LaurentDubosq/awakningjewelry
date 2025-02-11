# Awakningjewelry.com

This website offers for sale a range of categories of Buddhist jewelry and other related philosophies designed to express our philosophical values in all the activities of our modern lives.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/)
[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Development Principles

DRY, KISS, YAGNI, Clean Code, SRP (SOLID).

## Project Setup

```sh
git clone https://github.com/LaurentDubosq/awakningjewelry.git
```

```sh
cd awakningjewelry
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run mock-api
```

```sh
npm run dev
```

```sh
http://localhost:5173/
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Process to follow for your Commits

1. Create a new branch (git branch feature/add-feature)
2. Commit your changes (git commit -a -m 'Add a new feature')
3. Push the branch (git push origin feature/add-feature)
   Open a Pull Request

Make sure you respect coding standards and properly document your changes.
