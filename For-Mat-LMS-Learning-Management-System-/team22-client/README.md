# Projet Synthese Team #22 [Frontend]

Projet Synthese

#### 1464595@cshawi.ca Jonathan
#### 0894957@cshawi.ca Alain
#### 9580342@cshawi.ca Simon
#### 1764198@cshawi.ca Carlos
#### 2224245@cshawi.ca Oualid
#### 6166649@cshawi.ca Yanshang

Projet de synthèse incluant nodejs, mongodb, mongoose, css, vitejs.

##### nodejs : v18
##### npm : 9.6.7

## Team #22

## Install Local Branch Protection
```bash
cp extra/pre-push .git/hooks/
chmod +x .git/hooks/pre-push 
```
11

## Install the dependencies

```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Build the app for production

```bash
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```bash
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```bash
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```bash
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```bash
npm run lint
```

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).
