---
domain: technical
type: reference
status: active
topic: bifrost/knowledge
---

# Bifrost Tech Stack

Complete reference of all technologies, frameworks, libraries, and versions used in the Bifrost ecosystem.

**Source:** Bifrost Frontend Repository Manual (Section 3. Technology Stack) + package.json  
**Last Updated:** 2026-04-27  
**Maintained by:** Architecture team

---

## Core Technologies

| Technology       | Version       | Purpose                        |
| ---------------- | ------------- | ------------------------------ |
| **Angular**      | 15.0.1        | SPA framework                  |
| **TypeScript**   | ~4.8.3        | Language                       |
| **RxJS**         | ~6.6.0        | Reactive programming           |
| **Zone.js**      | ~0.11.4       | Angular change detection       |
| **Node.js (CI)** | 20.x          | Build & test runtime           |
| **Yarn**         | 3.5.0 (Berry) | Package manager (PnP disabled) |

---

## State Management

| Package                  | Version | Purpose                 |
| ------------------------ | ------- | ----------------------- |
| **@ngrx/store**          | 14.3.2  | Global Redux-like store |
| **@ngrx/effects**        | 14.3.2  | Side-effect management  |
| **@ngrx/entity**         | 14.3.2  | Entity collections      |
| **@ngrx/router-store**   | ^18.0.1 | Router state sync       |
| **@ngrx/store-devtools** | 14.3.2  | Time-travel debugging   |
| **@ngrx/schematics**     | 14.3.2  | Code generation         |

---

## UI & Styling

| Package                      | Version        | Purpose                               |
| ---------------------------- | -------------- | ------------------------------------- |
| **@angular/material**        | 15.0.0         | Material Design components            |
| **@angular/cdk**             | 15.0.0         | Component Dev Kit (overlays, portals) |
| **@angular/flex-layout**     | 14.0.0-beta.41 | Responsive flexbox layout             |
| **@mat-datetimepicker/core** | 10.0.2         | Date/time picker                      |
| **hammerjs**                 | 2.0.8          | Touch gesture support                 |
| **Sass/SCSS**                | Native         | CSS preprocessing                     |

---

## Internationalization (i18n)

| Package                        | Version | Purpose                        |
| ------------------------------ | ------- | ------------------------------ |
| **@ngx-translate/core**        | 14.0.0  | Runtime i18n                   |
| **@ngx-translate/http-loader** | 7.0.0   | HTTP-based translation loading |

**Supported Languages:**

- `en` — English
- `es` — Spanish
- `pt-br` — Brazilian Portuguese (primary)

---

## Maps & Geolocation

| Package                  | Version | Purpose                                 |
| ------------------------ | ------- | --------------------------------------- |
| **@angular/google-maps** | 14.2.2  | Google Maps integration                 |
| **viaCep**               | N/A     | Brazilian ZIP code (CEP) lookup service |

---

## Data & Charts

| Package                | Version | Purpose                                                  |
| ---------------------- | ------- | -------------------------------------------------------- |
| **highcharts**         | ^10.2.1 | Charting library                                         |
| **highcharts-angular** | ^3.0.0  | Angular wrapper for Highcharts                           |
| **bignumber.js**       | 9.1.0   | Arbitrary-precision arithmetic (aliased as `SafeMath`)   |
| **luxon**              | 2.3.0   | Date/time manipulation (modern alternative to moment.js) |
| **lodash-es**          | 4.17.21 | Tree-shakeable utility functions                         |
| **minisearch**         | ^3.1.0  | Client-side full-text search                             |

---

---

## Forms & Input

| Package            | Version | Purpose                                  |
| ------------------ | ------- | ---------------------------------------- |
| **@angular/forms** | 15.0.1  | Reactive forms framework                 |
| **ngx-mask**       | ^12.0.0 | Input masking (CPF, CNPJ, phone numbers) |
| **ngx-csv-parser** | ^1.2.0  | CSV file parsing                         |

**Brazilian Format Masks:**

- CPF: `000.000.000-00`
- CNPJ: `00.000.000/0000-00`
- Phone: `(00) 00000-0000`

---

## Carousel & UI Extras

| Package              | Version | Purpose                |
| -------------------- | ------- | ---------------------- |
| **@ngu/carousel**    | 6.0.1   | Touch-enabled carousel |
| **qrcode-generator** | 1.4.4   | QR code generation     |

---

## Export & Files

| Package               | Version | Purpose               |
| --------------------- | ------- | --------------------- |
| **export-xlsx**       | 0.1.4   | XLSX (Excel) export   |
| **file-saver**        | Latest  | Browser file save API |
| **@types/file-saver** | ^2.0.5  | TypeScript types      |

---

## Browser Detection & Compatibility

| Package                           | Version | Purpose                        |
| --------------------------------- | ------- | ------------------------------ |
| **detect-browser**                | 5.3.0   | Browser type/version detection |
| **browserslist**                  | 4.21.4  | Supported browsers config      |
| **browserslist-useragent-regexp** | 3.0.2   | User-agent string matching     |

**Supported Browsers:**

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

---

## Build & Tooling

| Tool                    | Version  | Purpose                          |
| ----------------------- | -------- | -------------------------------- |
| **Nx**                  | ^16.2.1  | Monorepo orchestration + caching |
| **nx-cloud**            | ^16.0.5  | Distributed remote caching       |
| **Jest**                | ^29.4.1  | Unit testing framework           |
| **jest-preset-angular** | ~13.0.0  | Angular-specific Jest preset     |
| **Cypress**             | ^12.11.0 | E2E testing framework            |
| **ESLint**              | ^8.28.0  | Code linting                     |
| **Prettier**            | Latest   | Code formatting                  |
| **patch-package**       | 6.5.0    | Patch node_modules on install    |
| **ng-packagr**          | ^15.0.1  | Angular library packaging        |

---

## Development Setup

### TypeScript Configuration (`tsconfig.base.json`)

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "moduleResolution": "node",
    "lib": ["es2020", "dom"],
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "strictPropertyInitialization": false,
    "esModuleInterop": true,
    "paths": {
      "commonlib": ["libs/commonlib/src/index.ts"],
      "walletlib": ["libs/wallet/src/index.ts"]
    }
  }
}
```

### EditorConfig

- `indent_style`: space
- `indent_size`: 4
- `charset`: utf-8
- `insert_final_newline`: true
- `trim_trailing_whitespace`: true
- TypeScript files: `quote_type = single`

### Prettier Configuration

```json
{
  "singleQuote": true
}
```

### Yarn Configuration (`.yarnrc.yml`)

- Package manager: `yarn@3.5.0` (Berry)
- Mode: PnP disabled, node_modules mode
- `corepack enable` required before `yarn install`

### ESLint Rules Summary

| Category         | Rule                        | Value                       |
| ---------------- | --------------------------- | --------------------------- |
| **Formatting**   | Indent                      | 4 spaces                    |
|                  | Quotes                      | Single only                 |
|                  | Semicolons                  | Always                      |
|                  | Braces                      | Allman style                |
|                  | Max line length             | 140 chars                   |
| **Code Quality** | No `var`                    | Error                       |
|                  | Complexity                  | Max 4                       |
|                  | No `eval`                   | Error                       |
|                  | Prefer template literals    | Error                       |
| **TypeScript**   | Array type                  | `Array<T>` not `T[]`        |
|                  | No unused vars              | Error (unless prefixed `_`) |
|                  | Non-null assertions         | Off                         |
| **Angular**      | No native output events     | Off                         |
|                  | Module boundary enforcement | Off (commented)             |

---

## Version Management

### Framework Versions

- Angular: 15.0.1
- NgRx: 14.3.2
- Material: 15.0.0
- TypeScript: 4.8.3
- Nx: 16.2.1

### Compatibility Notes

- Angular 15 requires TypeScript 4.8 or 4.9
- Ivy compilation enabled (default)
- NgRx 14 works with Angular 15
- Material 15 matches Angular 15 versioning

---

## Applications

Each app uses the same core tech stack, but may have specific add-ons:

| App           | Extra Dependencies                     | Notes                         |
| ------------- | -------------------------------------- | ----------------------------- |
| **account**   | ngx-translate                          | Auth, onboarding, MFA         |
| **business**  | @ngu/carousel, highcharts              | Dashboard, campaigns, rewards |
| **shopping**  | @angular/google-maps                   | E-commerce, geosearch         |
| **tokengo**    | @angular/google-maps, qrcode-generator | AR gamification               |
| **commonlib** | (all core)                             | Shared library, components    |
| **wallet**    | (all core)                             | Financial operations          |

---

## Shared Libraries

### commonlib (`libs/commonlib/`)

Exports all shared components, services, utilities:

```typescript
export * from "./lib/animations";
export * from "./lib/commonlib.module";
export * from "./lib/components";
export * from "./lib/constants";
export * from "./lib/directives";
export * from "./lib/mocks";
export * from "./lib/models";
export * from "./lib/services";
export * from "./lib/utils";
```

### wallet (`libs/wallet/`)

Financial operations library (payments, transfers, statements):

```typescript
import { ... } from 'walletlib';
```

---

## Key Dependencies Rationale

| Package           | Why It Was Chosen                                                                       |
| ----------------- | --------------------------------------------------------------------------------------- |
| **bignumber.js**  | JavaScript floats are unsafe for financial calculations. All monetary ops use SafeMath. |
| **luxon**         | Modern date manipulation with better TS support than moment.js.                         |
| **lodash-es**     | Tree-shakeable; only imported functions appear in bundles.                              |
| **ngx-mask**      | Required for Brazilian document formatting: CPF, CNPJ, phone.                           |
| **minisearch**    | Client-side full-text search for offline/fast search features.                          |
| **patch-package** | Fix upstream bugs without forking or waiting for upstream releases.                     |
| **@ngu/carousel** | Lightweight touch carousel not available in Angular Material.                           |
| **highcharts**    | Full-featured charting for business analytics dashboards.                               |

---

## CI/CD Environment

**GitHub Actions uses:**

- Ubuntu latest
- Node 20.x
- Yarn 3.5.0
- ESLint, Jest, TypeScript strict mode

**Cache strategy:**

- Dependencies cached by yarn.lock hash
- Nx build cache cleared each run
- Remote cache via nx-cloud (optional)

---

## Performance Targets

- **Page load:** < 2 seconds
- **Build time:** < 5 minutes (full), < 1 minute (affected)
- **Test run:** < 10 minutes (full), < 2 minutes (affected)
- **Bundle size:** < 500KB (gzipped, per app)
- **Lighthouse score:** > 90 (accessibility, best practices)

---

## See Also

- **NAMING_CONVENTIONS.md** — Code style (enforced by ESLint)
- **GOTCHAS.md** — Known issues with these versions
- **Frontend_repository_manual.md** (Section 3) — Original source
