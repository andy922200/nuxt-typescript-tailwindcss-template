# nuxt3-typescript-tailwindcss-template

## Table of Contents
- [Recommended IDE Setup](#recommended-ide-setup)
- [About this project](#about-this-project)
- [Prerequisites](#prerequisites)
- [Related Files](#related-files)

## Recommended IDE Setup
- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=vue.volar)

## About this project 
<p>This template includes the following packages:</p>
<p>這模板整合了以下套件</p>

- [Vue 3](https://vuejs.org/) - The Progressive JavaScript Framework.
- [TypeScript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types.
- [Vue I18n](https://vue-i18n.intlify.dev/) - Vue I18n is internationalization plugin for Vue.js
- [Dayjs](https://day.js.org/) - Fast 2kB alternative to Moment.js with the same modern API
- [ESLint](https://eslint.org/) - Find and fix problems in your JavaScript code
- [Tailwind](https://tailwindcss.com/) - Rapidly build modern websites without ever leaving your HTML.
- [Vitest](https://vitest.dev/) - A Vite-native testing framework. It's fast!
- [Nuxt Test Utils](https://www.npmjs.com/package/@nuxt/test-utils) - Nuxt offers first-class support for e2e and unit testing of your Nuxt applications.
- [unplugin-icons](https://www.npmjs.com/package/unplugin-icons) - Access thousands of icons as components on-demand universally

## Prerequisites
<p>請先安裝好 Node.js 環境</p>

- [pnpm](https://pnpm.io/zh-TW/)
- [Node.js](https://nodejs.org/en/download/)

This Demo project is running on Node.js (20.12.0), NPM (10.5.0) while testing.

## Environment
1. 開發時，請自行新增 .env.dev 於根目錄
2. 若是選擇 Server-Side 渲染，那請修改 start-server.sh 中的變數內容，然後再執行 deploy.sh。
start-server.sh & deploy.sh 的內容，亦可透過遠端托管程式碼的伺服器來進行
3. 若是選擇 pre-render 渲染，那請執行 start-generate.sh，並修改其變數內容

## Clone / Download
1. Clone this repository to your local machine
2. Start your development

```
$ git clone https://github.com/andy922200/nuxt3-typescript-tailwindcss-template.git
```

## Related Scripts

**1. Enter the project folder**
```
> Open a new terminal window and enter the folder
$ cd <project folder>
```
**2. Install packages via pnpm**
```
$ pnpm install
```
**3. Compiles the webpack for development**
```
$ pnpm dev
```
**4. Fix the coding style automatically ( js / html )**
```
$ pnpm lint
```
**5. Execute Unit Testing**
```
$ pnpm test-vitest
```
**6. Execute Preview Environment**
```
$ pnpm preview-prod
```
## Author
- [Andy Lien](https://github.com/andy922200)
