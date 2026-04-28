# Bifrost Frontends — Master Manual

> **Open Source Documentation** — Open Source Community. Available under MIT License.

---

## 1. Project Overview

**Bifrost Frontends** is a **Nx Monorepo** hosting all web applications and shared frontend libraries of the Bifrost digital ecosystem. The ecosystem provides tools for consumers, businesses, and the Token token economy.

| Property        | Value                                                |
| --------------- | ---------------------------------------------------- |
| Organization    | Open Source Community                   |
| Framework       | Angular 15                                           |
| Monorepo Tool   | Nx 16                                                |
| Package Manager | Yarn 3.5.0 (Berry) — PnP disabled, node_modules mode |
| Language        | TypeScript 4.8                                       |
| Node (CI)       | 20.x                                                 |

---

## 2. Repository Structure

```
bifrost.frontends/
├── apps/
│   ├── account/          # Auth, user profile, onboarding
│   ├── business/         # Merchant/enterprise management platform
│   ├── shopping/         # E-commerce storefront
│   └── tokengo/           # Token Go gamification platform
├── libs/
│   ├── commonlib/        # Shared components, services, styles, utils
│   └── wallet/           # Financial & wallet features
├── config/               # Per-app dev proxy configs + env utilities
├── scripts/              # Postinstall automation (env generation, etc.)
├── tools/                # Nx workspace generators
├── patches/              # patch-package patches for dependencies
├── assets/               # Global assets
├── .github/              # CI workflows (angular_push.yml, angular_pr.yml)
├── .eslintrc.json        # Root ESLint config (applies to ALL apps/libs)
├── tsconfig.base.json    # Base TypeScript config with path aliases
├── nx.json               # Nx workspace config (cache, targets, generators)
├── jest.base.ts          # Shared Jest base configuration factory
├── package.json          # Workspace dependencies & scripts
└── yarn.lock             # Deterministic lock file
```

### Directory Conventions (Per App and Lib)

Every application follows this internal structure:

```
src/app/
├── app.component.{ts,html,scss,spec.ts}
├── app.module.ts
├── app-routing.module.ts
├── core/                 # Singleton: services, guards, interceptors, resolvers, NgRx stores
│   ├── adapters/         # Data transformation (API response → model)
│   ├── api/              # HTTP service classes (one per domain)
│   ├── effects/          # NgRx side-effect handlers
│   ├── guards/           # Route guards
│   ├── interceptors/     # HTTP interceptors
│   ├── resolvers/        # Route resolvers
│   ├── services/         # Domain services + models/
│   └── stores/           # NgRx state slices (actions, reducers, selectors, store interface)
├── shared/               # Reusable, presentation-only modules/components
└── containers/           # Smart/connected components (consume NgRx or services)
    └── {feature}/        # One folder per feature area
```

---

## 3. Technology Stack

### Core

| Technology | Version | Purpose                  |
| ---------- | ------- | ------------------------ |
| Angular    | 15.0.1  | SPA framework            |
| TypeScript | ~4.8.3  | Language                 |
| RxJS       | ~6.6.0  | Reactive programming     |
| Zone.js    | ~0.11.4 | Angular change detection |

### State Management

| Package              | Version | Purpose                        |
| -------------------- | ------- | ------------------------------ |
| @ngrx/store          | 14.3.2  | Global Redux-like store        |
| @ngrx/effects        | 14.3.2  | Side-effect management         |
| @ngrx/entity         | 14.3.2  | Entity collections             |
| @ngrx/router-store   | ^18.0.1 | Router state sync              |
| @ngrx/store-devtools | 14.3.2  | Dev-mode time-travel debugging |
| @ngrx/schematics     | 14.3.2  | Code generation                |

### UI & Styling

| Package                  | Version        | Purpose                                     |
| ------------------------ | -------------- | ------------------------------------------- |
| @angular/material        | 15.0.0         | Material Design component library           |
| @angular/cdk             | 15.0.0         | Component Dev Kit (overlays, portals, etc.) |
| @angular/flex-layout     | 14.0.0-beta.41 | Responsive flexbox layout directives        |
| @mat-datetimepicker/core | 10.0.2         | Date/time picker extending Angular Material |
| hammerjs                 | 2.0.8          | Touch gesture support                       |

### Internationalization

| Package                    | Version | Purpose                               |
| -------------------------- | ------- | ------------------------------------- |
| @ngx-translate/core        | 14.0.0  | Runtime i18n with translation pipes   |
| @ngx-translate/http-loader | 7.0.0   | Load translations from JSON over HTTP |

### Maps & Geolocation

| Package              | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| @angular/google-maps | 14.2.2  | Google Maps integration |

### Data & Charts

| Package            | Version | Purpose                                                |
| ------------------ | ------- | ------------------------------------------------------ |
| highcharts         | ^10.2.1 | Charting library                                       |
| highcharts-angular | ^3.0.0  | Angular wrapper for Highcharts                         |
| bignumber.js       | 9.1.0   | Arbitrary-precision arithmetic (aliased as `SafeMath`) |
| luxon              | 2.3.0   | Date/time manipulation                                 |
| lodash-es          | 4.17.21 | Tree-shakeable utility functions                       |
| minisearch         | ^3.1.0  | In-memory full-text search                             |

### Forms & Input

| Package        | Version | Purpose                                |
| -------------- | ------- | -------------------------------------- |
| ngx-mask       | ^12.0.0 | Input masking (CPF, CNPJ, phone, etc.) |
| ngx-csv-parser | ^1.2.0  | CSV file parsing                       |

### Carousel & UI Extras

| Package          | Version | Purpose                |
| ---------------- | ------- | ---------------------- |
| @ngu/carousel    | 6.0.1   | Touch-enabled carousel |
| qrcode-generator | 1.4.4   | QR code generation     |

### Export & Files

| Package           | Version | Purpose         |
| ----------------- | ------- | --------------- |
| export-xlsx       | 0.1.4   | XLSX export     |
| @types/file-saver | ^2.0.5  | File save types |

### Browser Detection & Compatibility

| Package                       | Version | Purpose                                |
| ----------------------------- | ------- | -------------------------------------- |
| detect-browser                | 5.3.0   | Detect browser type/version            |
| browserslist                  | 4.21.4  | Supported browsers config              |
| browserslist-useragent-regexp | 3.0.2   | Match browsers from user-agent strings |

### Dev Tools

| Tool                | Version  | Purpose                                     |
| ------------------- | -------- | ------------------------------------------- |
| Nx                  | ^16.2.1  | Monorepo orchestration, caching, generators |
| nx-cloud            | ^16.0.5  | Distributed Nx caching                      |
| jest                | ^29.4.1  | Unit testing                                |
| jest-preset-angular | ~13.0.0  | Angular-specific Jest preset                |
| cypress             | ^12.11.0 | E2E testing                                 |
| ESLint              | ^8.28.0  | Code linting                                |
| Prettier            | —        | Code formatting                             |
| patch-package       | 6.5.0    | Patch node_modules on install               |
| ng-packagr          | ^15.0.1  | Angular library packaging                   |

---

## 4. Workspace & Tooling Configuration

### TypeScript (`tsconfig.base.json`)

```jsonc
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
      "walletlib": ["libs/wallet/src/index.ts"],
    },
  },
}
```

**Rule:** Always use path aliases (`commonlib`, `walletlib`) rather than relative paths for cross-library imports.

### EditorConfig (`.editorconfig`)

- `indent_style`: space
- `indent_size`: 4
- `charset`: utf-8
- `insert_final_newline`: true
- `trim_trailing_whitespace`: true
- TypeScript files: `quote_type = single`

### Prettier (`.prettierrc`)

```json
{ "singleQuote": true }
```

### Browserslist (`.browserslistrc`)

```
last 2 versions
```

### Yarn (`.yarnrc.yml`)

- Package manager: `yarn@3.5.0` (Berry)
- Corepack must be enabled before running `yarn install`
- All CI steps run `corepack enable` first

### Nx (`nx.json`)

- **Cacheable operations**: `build`, `lint`, `test`, `e2e`
- **Parallel tasks**: max 2 at a time
- **Build dependency**: builds depend on `^build` (dependencies must build first)
- **Default generators**:
  - New apps: SCSS styling, ESLint linting, Jest unit tests, Cypress E2E
  - New libs: ESLint linting, Jest unit tests
  - New components: SCSS styling

---

## 5. Applications In-Depth

### 5.1 `account` — Authentication & User Management

**Purpose**: The central identity and authentication portal for all Bifrost users and enterprises.

**Key features**:

- Login / Logout with session management
- Multi-Factor Authentication (MFA) enrollment and verification
- User onboarding flows (personal and business)
- Password recovery and change
- Account verification
- Enterprise store selection and switching
- User profile editing
- Terms of service acceptance
- "For Business" and "For You" landing pages
- Token Go player mode

**NgRx Store slices** (defined in `core/stores/`):

| Slice                 | Purpose                                                           |
| --------------------- | ----------------------------------------------------------------- |
| `profile`             | Auth state, user details, MFA, session, app menu, store selection |
| `forBusiness`         | Business landing page data                                        |
| `accountForYou`       | Consumer landing page data                                        |
| `editAccount`         | Account editing state                                             |
| `accountVerification` | Verification flow state                                           |
| `changePassword`      | Password change flow state                                        |
| `sidebar`             | Sidebar navigation state                                          |

**HTTP Interceptor**: `SessionInterceptor`

- Handles request timeouts
- On HTTP 405 (session lost): auto-calls logout
- Translates backend error messages to i18n strings

**Container structure**:

```
containers/
├── home/
│   ├── account/          # Login, forgot password, verification, terms
│   ├── for-business/     # Business landing (header/body/footer)
│   ├── for-you/          # Consumer landing (header/body/footer)
│   ├── onboarding/       # Personal and business onboarding flows
│   └── token-go/          # Token Go landing
└── personal/
    ├── account-verification/
    ├── change-password/   # Includes MFA verify step
    ├── create-store/
    ├── edit-account/      # Business & personal sub-flows
    ├── enroll-mfa/        # Intro, enroll, secret-code, success steps
    ├── launchpad/
    └── onboarding-business/ # Company data, contact, transitions
```

**I18n languages**: `en`, `es`, `pt-br`

---

### 5.2 `business` — Merchant/Enterprise Platform

**Purpose**: Full back-office management tool for businesses and enterprises on the Bifrost platform.

**Key features**:

- Campaign management (share-win, push, product, streaming, guided, bonus)
- Rewards center and challenges
- Store management (config, affiliate, payment methods, permissions)
- Sales management (PDV, my-sales, shopping sales)
- Products and product center
- Finance (wallet, balance, statements, transfers)
- Segmentation and VIP groups
- Communication (Token Go campaigns, missions, spawn areas)
- Back-office admin tools
- Developer tools section
- Platform menu / home
- Enterprise management

**Container structure (active areas)**:

```
containers/
├── back-office/          # Admin-level back-office view
├── comunication/         # Token Go campaign setup
├── devs/                 # Developer tools
├── enterprise/           # Enterprise-level management
├── finance/
│   └── wallet/           # Finance wallet sub-module (uses walletlib)
├── pdv/                  # Point of sale
│   ├── pdv-metrics/
│   ├── receive/
│   └── transaction/
├── platform-menu/
│   └── platform-home/
├── products/
│   ├── products-center/
│   ├── promotions/
│   ├── registers/
│   └── trusteeship-registers/
├── rewards/              # Full rewards domain
│   ├── answer-here/
│   ├── bonus-campaign/
│   ├── create-campaign/
│   ├── create-campaign-listen/
│   ├── create-campaign-product/
│   ├── create-campaign-push/
│   ├── create-campaign-watch/
│   ├── create-vip-group/
│   ├── guided-campaign/
│   ├── items-library/
│   ├── online-challenges/
│   ├── performance/
│   ├── product-campaign/
│   ├── push-campaign/
│   ├── rewards-center/
│   ├── rewards-challenge/
│   ├── share-win/
│   ├── share-win-campaigns/
│   ├── store-challenges/
│   ├── tabs-campaign/
│   ├── validate-coupon/
│   ├── vip-groups/
│   └── watch-win-campaigns/
├── sales/
│   ├── my-sales/
│   └── shopping/
├── shopping/
└── store/
    ├── affiliate/
    ├── config-store/
    ├── edit-store/
    ├── payment-methods/
    ├── permission/
    ├── permission-profile/
    ├── product/
    └── sale/
└── deprecated/           # Legacy features preserved but not actively maintained
```

**Notable patterns**:

- Uses `StoreRouterConnectingModule` for router–store synchronization
- Sets `LOCALE_ID` to `'pt'` and registers pt-BR locale for Angular pipes
- Translation files include a cache-bust timestamp: `?v=${Date.now()}`
- Extensive use of **Adapter pattern**: `core/adapters/` transforms raw API data into app models
- Feature-gated sections (see `Feature` enum and Feature Flags section)

---

### 5.3 `shopping` — E-Commerce Storefront

**Purpose**: Consumer-facing product browsing and shopping experience.

**Key features**:

- Product search and browsing
- Near-by item discovery (geo-based)
- Product detail pages
- Shopping cart
- Banner and promotional content

---

### 5.4 `tokengo` — Token Go Gamification Platform

**Purpose**: Augmented-reality style token collection and gamification experience.

**Key features**:

- Spawn area management
- Asset/character management (Hero, Villain, NPC, etc.)
- Mission and campaign creation
- Token token quotation display
- Player profile
- Google Maps integration for spawn areas

**I18n languages**: `en`, `es`, `pt-br` (stored under `src/app/assets/i18n/`)

---

## 6. Shared Libraries

### 6.1 `commonlib` — Core Shared Library

**Path alias**: `import { ... } from 'commonlib'`
**Entry point**: `libs/commonlib/src/index.ts`

The library exports everything through a single barrel file:

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

**Usage in apps**: Import `CommonlibModule.forRoot()` at the root `AppModule` level to register all providers/services. Child modules import `CommonlibModule` (without `forRoot()`).

#### 6.1.1 Components

| Component                         | Description                                                                                                                                                                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccordionComponent`              | Collapsible accordion with expansion panels                                                                                                                                                                                                          |
| `AdminMenuComponent`              | Top-level navigation with header, nav, balance pill, overlays                                                                                                                                                                                        |
| `AppLoadComponent`                | Application loading screen                                                                                                                                                                                                                           |
| `BrazilMapComponent`              | Interactive Brazil map visualization                                                                                                                                                                                                                 |
| `CalendarComponent`               | Calendar with custom header                                                                                                                                                                                                                          |
| `CardComponent`                   | Generic card container                                                                                                                                                                                                                               |
| `CardButtonComponent`             | Clickable card button                                                                                                                                                                                                                                |
| `CardItemComponent`               | Product/item card                                                                                                                                                                                                                                    |
| `CardProductComponent`            | Product display card                                                                                                                                                                                                                                 |
| `CarouselComponent`               | Touch-enabled image carousel                                                                                                                                                                                                                         |
| `CodeMfaComponent`                | MFA code input                                                                                                                                                                                                                                       |
| `CommonDialogs`                   | `MessageDialogComponent`, `TipsModalComponent`                                                                                                                                                                                                       |
| `DialogComponent`                 | Generic dialog wrapper                                                                                                                                                                                                                               |
| `DynamicComponentFacadeComponent` | Dynamic component loading                                                                                                                                                                                                                            |
| `FormComponents`                  | `ButtonComponent`, `CheckboxComponent`, `InputComponent`, `QuantityComponent`, `RadioCardGroupComponent`, `RadioGroupComponent`, `SelectComponent`, `SelectButtonComponent`, `SelectDatetimePickerComponent`, `TextareaComponent`, `ToggleComponent` |
| `HideUntilComponent`              | Skeleton loading wrapper with `LoadContainerComponent`                                                                                                                                                                                               |
| `InRowProductCardComponent`       | Horizontal product card                                                                                                                                                                                                                              |
| `InputSearchComponent`            | Search input with debounce                                                                                                                                                                                                                           |
| `ListComponent`                   | Generic list display                                                                                                                                                                                                                                 |
| `MaintenanceComponent`            | Maintenance mode screen                                                                                                                                                                                                                              |
| `MapComponent`                    | Google Maps wrapper                                                                                                                                                                                                                                  |
| `OutputGraphComponent`            | Graph output display                                                                                                                                                                                                                                 |
| `PaginatorComponent`              | Pagination controls                                                                                                                                                                                                                                  |
| `PerformanceCardComponent`        | Performance metrics card                                                                                                                                                                                                                             |
| `ProductImageViewerComponent`     | Multi-image product viewer                                                                                                                                                                                                                           |
| `ProgressBarComponent`            | Progress indicator                                                                                                                                                                                                                                   |
| `QrcodeViewerComponent`           | QR code display                                                                                                                                                                                                                                      |
| `RateIconComponent`               | Star rating icon                                                                                                                                                                                                                                     |
| `SecretCodeComponent`             | Secret/OTP code display                                                                                                                                                                                                                              |
| `SidebarComponent`                | Collapsible sidebar with items, separators, sub-menus                                                                                                                                                                                                |
| `SimpleUploadComponent`           | Single file upload                                                                                                                                                                                                                                   |
| `SkeletonLoadingComponent`        | Loading skeleton UI                                                                                                                                                                                                                                  |
| `SliderComponent`                 | Range slider                                                                                                                                                                                                                                         |
| `SnackBarComponent`               | Toast notifications                                                                                                                                                                                                                                  |
| `SpinnerComponent`                | Loading spinner                                                                                                                                                                                                                                      |
| `StarRatingComponent`             | Interactive star rating                                                                                                                                                                                                                              |
| `StatusPillComponent`             | Status badge/pill                                                                                                                                                                                                                                    |
| `StepBarComponent`                | Multi-step progress bar                                                                                                                                                                                                                              |
| `TabGroupComponent`               | Tabbed content switcher                                                                                                                                                                                                                              |
| `TableComponent`                  | Data table                                                                                                                                                                                                                                           |
| `TooltipComponent`                | Custom tooltip                                                                                                                                                                                                                                       |
| `UploadCsvComponent`              | CSV file upload                                                                                                                                                                                                                                      |
| `UploadLogoComboComponent`        | Logo + combo upload                                                                                                                                                                                                                                  |
| `UploadPictureAreaComponent`      | Picture area uploader                                                                                                                                                                                                                                |
| `WarningBrowserComponent`         | Unsupported browser warning                                                                                                                                                                                                                          |
| `WarningMobileComponent`          | Mobile device warning                                                                                                                                                                                                                                |

**Admin Menu overlays**:

- `AccountSwitcherComponent` — Switch between enterprise accounts
- `ApplicationsComponent` — Cross-app navigation (with `AppMenuItem` model)
- `MenuOverlayComponent` — Generic overlay wrapper
- `NotificationsComponent` — Notification panel
- `OptionsComponent` — User options menu
- `QuickSearchComponent` — Quick search overlay
- `ResponsiveNavComponent` / `ItemListComponent` — Mobile navigation

#### 6.1.2 Services

| Service                     | Purpose                                                      |
| --------------------------- | ------------------------------------------------------------ |
| `CommonlibBootstrapService` | Library initialization                                       |
| `DialogService`             | Angular Material dialog wrapper                              |
| `DomPortalHostService`      | CDK portal host management                                   |
| `ErrorHandlingService`      | Standardized HTTP error handling (snackbar + store dispatch) |
| `ExportFileService`         | File export utilities (XLSX, CSV)                            |
| `FunctionControlService`    | Feature function gating                                      |
| `LocalStorageService`       | Type-safe localStorage wrapper                               |
| `ParametersService`         | Server-side parameter loading                                |
| `ScriptLoaderService`       | Dynamic script loading (via scriptjs)                        |
| `SidebarService`            | Sidebar open/closed state management                         |
| `SvgService`                | Dynamic SVG loading                                          |
| `ValidationUtilService`     | Form validation helpers                                      |
| `SnackBarService`           | Toast notification helper (used by `ErrorHandlingService`)   |

#### 6.1.3 Directives

| Directive               | Purpose                         |
| ----------------------- | ------------------------------- |
| `AutoHeightDirective`   | Dynamically sets element height |
| `HoverTooltipDirective` | Shows tooltip on hover          |

#### 6.1.4 Pipes

| Pipe                | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `CombinationIdPipe` | Formats combination IDs                        |
| `DocumentPipe`      | Formats CPF/CNPJ Brazilian documents           |
| `SafeHtmlPipe`      | Bypasses Angular DomSanitizer for trusted HTML |
| `TruncateLinesPipe` | Truncates text to N lines                      |

#### 6.1.5 Animations

Available from `import { ... } from 'commonlib'`:

- `fadeAnimation` — Fade in/out
- `growAnimation` — Scale grow/shrink
- `openPanelAnimation` — Panel open/close
- `slideAnimation` — Slide in/out

#### 6.1.6 Models

| Model/Type                                         | Purpose                                                                                |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `CheckboxTableModel`                               | Checkbox-enabled table row                                                             |
| `CommonEnvironmentModel`                           | Shared environment interface                                                           |
| `ComponentTypeModel`                               | Dynamic component type                                                                 |
| `CsvFilesModel`                                    | CSV file structure                                                                     |
| `ErrorPayload`                                     | Standardized API error shape                                                           |
| `ErrorTranslationTable` / `ErrorTranslationMapper` | Maps validation errors to translation strings                                          |
| `ExportTypeEnum`                                   | Export format enum                                                                     |
| `ExportXlsxModel`                                  | XLSX export configuration                                                              |
| `Feature` (enum)                                   | Feature flag identifiers (see Section 20)                                              |
| `GraphModel`                                       | Highcharts-compatible graph data                                                       |
| `NullableModel`                                    | `Nullable<T>` utility type                                                             |
| `Parameters`                                       | Server-side link parameters (account/admin/fidelity/shopping/transactions/wallet URLs) |
| `RateIconModel`                                    | Rating icon config                                                                     |
| `RewardUtilizationEnum`                            | Reward usage types                                                                     |
| `SegmentationModel`                                | Audience segmentation definition                                                       |
| `SimpleFileModel`                                  | Single file container                                                                  |

#### 6.1.7 Utils

| Util                                      | Purpose                                                                          |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| `color-scale.util`                        | Color scale calculations                                                         |
| `ControlValueAccessorUtil<T>`             | Abstract base class for custom form controls (implements `ControlValueAccessor`) |
| `createCustomInputControlValueAccessor()` | Factory to create `NG_VALUE_ACCESSOR` provider                                   |
| `currency.util`                           | Currency formatting helpers                                                      |
| `form-validators.util`                    | Custom Angular form validators                                                   |
| `get-enum-key-name.util`                  | Get string key from enum value                                                   |
| `get-first-value.util`                    | Extract first emission from observable                                           |
| `number.util`                             | Number parsing and formatting                                                    |
| `pipes.util`                              | Pipe utility functions                                                           |
| `SafeMath`                                | Re-exports `BigNumber` from `bignumber.js` for safe arithmetic                   |
| `save-file.util`                          | Trigger browser file save                                                        |
| `simple-of.util`                          | `simpleOf(value)` — thin wrapper over `of()`                                     |
| `url.util`                                | `toQueryParam()`, `generateQueryParam()` — URL query string builders             |
| `uuid.util`                               | UUID generation helpers                                                          |
| `weakref.util`                            | WeakRef utilities for memory management                                          |

#### 6.1.8 Constants

| Constant                     | Purpose                                                                                   |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| `api`                        | **Central API URL factory** — all endpoint functions organized by domain (see Section 10) |
| `ConfigurationEntry`         | App configuration entry constants                                                         |
| `ErrorValidator`             | Form validation error constants                                                           |
| `MapCoordinatesDefault`      | Default lat/lng coordinates                                                               |
| `PlatformApplication` (enum) | Platform app ID enum (see Section 21)                                                     |
| `TranslationConstants`       | Error message translation helpers                                                         |

#### 6.1.9 Mocks

Located at `libs/commonlib/src/lib/mocks/stubs/` — test stub objects for use in specs.

---

### 6.2 `wallet` — Financial & Wallet Library

**Path alias**: `import { ... } from 'walletlib'`
**Entry point**: `libs/wallet/src/index.ts`

A self-contained feature library for all financial operations. Includes its own routing, components, services, and models.

#### Components

| Component                       | Purpose                       |
| ------------------------------- | ----------------------------- |
| `AddFundsComponent`             | Add funds flow                |
| `ConfirmationModalComponent`    | Add-funds confirmation dialog |
| `PaymentStatusModalComponent`   | Payment result modal          |
| `PayComponent`                  | Payment initiation flow       |
| `PaymentCodeComponent`          | Enter payment code step       |
| `PaymentFinalComponent`         | Payment final confirmation    |
| `PaymentMfaComponent`           | MFA verification for payment  |
| `PaymentSummaryComponent`       | Payment summary review        |
| `ReceiveComponent`              | Generate receive/QR code      |
| `StatementComponent`            | Transaction history list      |
| `StatementDetailsComponent`     | Single transaction detail     |
| `TransferComponent`             | Initiate Token transfer        |
| `TransferConfirmationComponent` | Confirm transfer              |
| `TransferDataComponent`         | Enter transfer amount         |
| `TransferDestinationComponent`  | Select transfer recipient     |
| `TransferMfaComponent`          | MFA verification for transfer |

#### Shared Components (within wallet)

| Component                          | Purpose                            |
| ---------------------------------- | ---------------------------------- |
| `ActionBarComponent`               | Action toolbar for wallet flows    |
| `BusinessAssistantHeaderComponent` | Business-mode wallet header        |
| `ContentComponent`                 | Wallet content layout wrapper      |
| `EmptyStateComponent`              | Empty state UI for wallet sections |
| `QuotationModalComponent`          | Token/BRL conversion quotation      |

#### Services

| Service          | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `WalletService`  | Core wallet operations (balance, history) |
| `PaymentService` | Payment processing                        |
| `ViaCepService`  | Brazilian ZIP code (CEP) lookup           |

#### Models

| Model             | Purpose                         |
| ----------------- | ------------------------------- |
| `ActionBarModel`  | Action bar configuration        |
| `BiometricsModel` | Biometric auth configuration    |
| `PaymentModel`    | Payment request/response        |
| `PlansModel`      | Service credit plan definitions |
| `TransferModel`   | Transfer request/response       |
| `WalletModel`     | Wallet balance and state        |

#### Constants

- `BrazilianStates` — Array of all Brazilian states for address forms

---

## 7. State Management (NgRx)

The project uses NgRx 14 following a structured, per-feature slice pattern.

### Store Slice Structure

Each feature domain in `core/stores/` contains exactly four files:

```
{feature}/
├── {feature}.actions.ts    # Action creators using createAction() + props<>()
├── {feature}.reducer.ts    # Pure reducer function using createReducer() + on()
├── {feature}.selectors.ts  # Memoized selectors using createSelector()
└── {feature}.store.ts      # Store interface definition + storeTag constant
```

### Naming Convention

Action names follow the format: `[Store Name] Action Description`

Example:

```typescript
export const storeTag: string = "[Profile Store]";

export const loginUser = createAction(
  `${storeTag} Login the user`,
  props<{ email: string; password: string }>(),
);
export const loginUserSuccess = createAction(
  `${storeTag} Login the user success`,
  props<{ user: UserDetails }>(),
);
export const loginUserError = createAction(
  `${storeTag} Login the user error`,
  props<{ error: ErrorPayload }>(),
);
```

**Every action group** follows the triad pattern: `action` → `actionSuccess` → `actionError`.

### Effects Pattern

Effects live in `core/effects/` and use the standard `@ngrx/effects` pattern:

- Inject `ErrorHandlingService` for unified error dispatch + snackbar
- Use `exhaustMap` or `switchMap` for API calls
- Return success/error actions

### `AppState` Interface

Each app defines a root `AppState` interface in `core/stores/store.ts`:

```typescript
export interface AppState {
  profile: ProfileStore;
  forBusiness: ForBusinessStore;
  // ... other slices
}

export const reducers: ActionReducerMap<object, Action> = {
  profile: profileReducer,
  forBusiness: forBusinessReducer,
  // ...
};
```

### Store DevTools

In development mode, `StoreDevtoolsModule.instrument({ maxAge: 25, name: 'Bifrost <AppName>' })` is imported via the environment configuration.

---

## 8. Styling System

All styles live in `libs/commonlib/styles/` and are available via `@commonlib/styles/<partial>`.

### Style File Reference

| File                         | Purpose                                         |
| ---------------------------- | ----------------------------------------------- |
| `_colors.scss`               | All color tokens and maps                       |
| `_breakpoints.scss`          | Responsive breakpoint variables and mixins      |
| `_fonts.scss`                | Typography mixins                               |
| `_icons.scss`                | CSS icon classes using `background-image` (SVG) |
| `_mixins.scss`               | Reusable utility mixins                         |
| `_reset.scss`                | CSS reset/normalize                             |
| `_sizes.scss`                | Sidebar dimensions and `home-sizer` mixin       |
| `_theme.scss`                | Angular Material theme definition               |
| `_tooltip-theme.scss`        | Custom tooltip styling                          |
| `_datetimepicker-theme.scss` | Mat datetimepicker theming                      |

### Color System

Colors are defined in two systems:

**1. Color map functions** (preferred for new code):

```scss
@include theme-color($purple-color, "primary") // #301457
  @include theme-color($green-color, "primary"); // #00EFA5
```

Available maps: `$green-color`, `$purple-color`, `$blue-color`, `$pink-color`, `$yellow-color`, `$gray-color`, `$white-color`
Each map has keys: `'primary'`, `'secondary'`, `'third'`, `'fourth'`, `'fifth'`

**2. Direct SCSS variables** (legacy but still in use):

| Category      | Key Variables                                                                       |
| ------------- | ----------------------------------------------------------------------------------- |
| Brand Primary | `$primary-purple: #301457`, `$secondary-purple: #662d91`, `$primary-green: #00efa5` |
| Text          | `$primary-gray: #423E45`, `$cold-grey: #676767`, `$subtitle-grey: $cold-grey`       |
| Backgrounds   | `$secondary-grey: #f9f7fb`, `$eighth-grey: #F7F7FC`, `$fifth-grey: #fafafa`         |
| Status        | `$primary-pink: #EB1056`, `$hard-green: #3DC04E`, `$primary-yellow: #F6AE2D`        |

**Module Color Map** (`$module-colors`): Named semantic colors for campaign modules:
`sky`, `teal`, `lime`, `goldenrod`, `tangerine`, `rose`, `lavender`, `plum`, `royal`, `grape`, `slate`

**CSS Filter Map** (`$color-filter`): Pre-computed CSS filter strings for SVG icon colorization.

### Responsive Breakpoints

| Mixin            | Range         | Pixels          |
| ---------------- | ------------- | --------------- |
| `@include xs`    | Mobile only   | ≤ 599px         |
| `@include sm`    | Tablet        | 768px – 959px   |
| `@include md`    | Small desktop | 992px – 1279px  |
| `@include lg`    | Desktop       | 1200px – 1919px |
| `@include xl`    | Large desktop | ≥ 1200px        |
| `@include lt-sm` | < sm          | ≤ 599px         |
| `@include lt-md` | < md          | ≤ 959px         |
| `@include lt-lg` | < lg          | ≤ 1279px        |
| `@include gt-xs` | > xs          | ≥ 768px         |
| `@include gt-sm` | > sm          | ≥ 992px         |
| `@include gt-md` | > md          | ≥ 1200px        |

### Typography Mixins

Font family: **Inter** (sans-serif fallback)

```scss
@include font-light // weight 300
  @include font-regular // weight 400
  @include font-medium // weight 500
  @include font-semi-bold // weight 600
  @include font-bold // weight 700
  @include font-extra-bold // weight 800
  @include font-style($size, $color, $line-height);
```

### Sidebar Size Constants

```scss
$sidebar-closed-size: 100px;
$sidebar-opened-size: 248px;
```

### Utility Mixins

```scss
@include thin-scrollbar($axis: "y") // 5px custom scrollbar (webkit)
  @include home-sizer; // 1200px centered max-width for main content
```

### Angular Material Theme

Material is configured with:

- `$app-primary`: Indigo palette
- `$app-accent`: Pink palette
- `$app-warn`: Red palette
- Theme type: **light**
- Global overrides: `mat-dialog-content`, `.message-dialog-panel`, `.cdk-overlay-dark-backdrop` (blur backdrop), and outline form field label fix

### Icon CSS Classes

Icons are applied via `<i class="...">` elements using `background-image` with SVG assets. Key classes include:

`dropdown`, `search`, `search-green`, `edit`, `delete`, `trash-grey`, `copy`, `add`, `add-green`, `refresh`, `close`, `close-white`, `close-grey`, `expand`, `eye`, `no-eye`, `exit`, `password`, `privacity`, `notification`, `applications`, `sandwich`, `calendar-green`, `circle-add`, `alert-icon`, `wbx-grey`, `wbx-green`, `wbx-total`, `wbx-sales`, `qr-code`, `pdv-green`, `pdv-black`, `play`, `pause`, `stop`, `pen`, `pen-white`, `pen-green`, `edit-green`, `edit-black`, `upload`, `upload-csv`, `date-grey`, `time-grey`, `real-green`, `real-dark`, `token-price`, `facebook-green`, `twitter-green`, `telegram-green`, `instagram-green`, `whatsapp-green`, `youtube`, `linkedin`, `x`, `pin-purple`, `phone-purple`, `at-purple`, `photo-camera`, `percentage`, `clock-green`, `status`, `ticket`, `sale-reminder`, `sale-confirm`, `cancellation`, `amount`, `payment-request`

---

## 9. Internationalization (i18n)

All apps use `@ngx-translate/core` with HTTP-loaded JSON files.

### Setup Pattern (in `AppModule`)

```typescript
export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    "./assets/i18n/",
    `.json?v=${Date.now()}`,
  );
}

TranslateModule.forRoot({
  loader: {
    provide: TranslateLoader,
    useFactory: httpLoaderFactory,
    deps: [HttpClient],
  },
});
```

The cache-bust `?v=${Date.now()}` prevents stale translation file caching in production.

### Translation Files Location

```
apps/{app}/src/assets/i18n/
├── en.json       # English
├── es.json       # Spanish
└── pt-br.json    # Brazilian Portuguese (primary)
```

The `tokengo` app stores its translations at `apps/tokengo/src/app/assets/i18n/`.

### Error Message Translation

`TranslationConstants` service in commonlib provides `translateErrorMessage(message)`, which maps backend error strings to frontend i18n keys. This is called by both `ErrorHandlingService` and `SessionInterceptor`.

The translation key namespace `commonlib.backend-translation.*` is reserved for backend-originated error messages.

---

## 12. Angular Module Architecture

### Module Types

| Type               | Location                                   | Purpose                                                         |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------- |
| `AppModule`        | `app.module.ts`                            | Root application module                                         |
| `AppRoutingModule` | `app-routing.module.ts`                    | Root lazy-loading routes                                        |
| `CoreModule`       | `core/core.module.ts`                      | Singleton services, registers interceptors/guards/effects/store |
| `SharedModule`     | `shared/shared.module.ts`                  | Re-exported common modules for use in feature modules           |
| `ContainersModule` | `containers/containers.module.ts`          | Top-level containers orchestrator                               |
| Feature modules    | `containers/{feature}/{feature}.module.ts` | Lazy-loaded per feature                                         |

### Lazy Loading Pattern

All feature modules are lazy-loaded via `loadChildren`:

```typescript
{
    path: 'rewards',
    loadChildren: () => import('./containers/rewards/rewards.module')
        .then(m => m.RewardsModule)
}
```

### `CommonlibModule.forRoot()` Pattern

Must be called exactly **once** in `AppModule` to register all singleton services. Feature modules import `CommonlibModule` directly (without `forRoot()`).

### Store Registration

Stores are registered in `CoreModule` using `StoreModule.forRoot(reducers)` and `EffectsModule.forRoot([...effects])`.

---

## 13. Coding Standards & ESLint Rules

The root `.eslintrc.json` enforces strict rules across all TypeScript files. Key rules:

### Formatting Rules

| Rule                 | Enforcement                                           |
| -------------------- | ----------------------------------------------------- |
| `indent`             | 4 spaces; `ObjectExpression: 1`, `ArrayExpression: 1` |
| `quotes`             | Single quotes only                                    |
| `comma-dangle`       | Never (no trailing commas)                            |
| `comma-spacing`      | Space after comma, no space before                    |
| `brace-style`        | `allman` — braces on their own line                   |
| `no-trailing-spaces` | Error                                                 |
| `max-len`            | 140 chars; import statements and URLs exempted        |
| `no-tabs`            | Error                                                 |

### Code Quality Rules

| Rule                   | Enforcement                                      |
| ---------------------- | ------------------------------------------------ |
| `no-var`               | Error — use `const`/`let` only                   |
| `prefer-const`         | Error                                            |
| `eqeqeq`               | Always use `===`                                 |
| `yoda`                 | Never — `value === 'foo'`, not `'foo' === value` |
| `no-eval`              | Error                                            |
| `no-else-return`       | Error — return early instead                     |
| `no-lonely-if`         | Error                                            |
| `no-new-wrappers`      | Error                                            |
| `prefer-template`      | Error — use template literals                    |
| `prefer-object-spread` | Error                                            |
| `prefer-spread`        | Error                                            |
| `complexity`           | Max cyclomatic complexity: **4**                 |
| `no-new-object`        | Error                                            |
| `no-unneeded-ternary`  | Error                                            |
| `spaced-comment`       | Error                                            |

### TypeScript Rules

| Rule                                       | Value                                    |
| ------------------------------------------ | ---------------------------------------- |
| `@typescript-eslint/array-type`            | `generic` — use `Array<T>` not `T[]`     |
| `@typescript-eslint/no-unused-vars`        | Error; args prefixed with `_` are exempt |
| `@typescript-eslint/no-non-null-assertion` | Off                                      |
| `@typescript-eslint/no-inferrable-types`   | Off                                      |
| `@typescript-eslint/ban-types`             | Off                                      |

### Angular Rules

| Rule                               | Value                        |
| ---------------------------------- | ---------------------------- |
| `@angular-eslint/no-output-native` | Off                          |
| `@nx/enforce-module-boundaries`    | Commented out (not enforced) |

### File Naming (Unicorn)

```
unicorn/filename-case: kebab-case
```

All source files must use kebab-case filenames (e.g., `my-component.component.ts`).

### HTML Templates

Templates extend `plugin:@angular-eslint/template/recommended`.

### Example: Allman Brace Style

```typescript
// CORRECT
if (condition) {
  doSomething();
} else {
  doOther();
}

// WRONG (will fail lint)
if (condition) {
  doSomething();
}
```

---

## 14. File Header Compliance

**Every TypeScript file MUST begin** with the Bifrost confidentiality header:

```typescript
/**
 * Bifrost OPEN SOURCE
 * ------------------
 * Copyright (C) {year} Open Source Community - MIT License.
 *
 * This file, project or its parts can not be copied and/or distributed without
 * contributions to Open Source Community.
 *
 * @file {filename.ts}
 * @author {Author Name} <{author@email}>
 * @date {Day}, {Date}th {Month} {Year} {HH:MM:SS am/pm}
 * @description {Brief description of the file's purpose}
 */
```

This is a hard organizational requirement and is present on every committed file in the repository.

---

## 15. Testing Strategy

### Unit Tests (Jest)

- **Runner**: Jest 29 with `jest-preset-angular`
- **Environment**: `jest-environment-jsdom`
- **Transform**: All `.ts`, `.mjs`, `.js`, `.html` files via `jest-preset-angular`
- **ES Module exceptions**: `export-xlsx`, `lodash`, and `.mjs` files bypass transform ignore
- **Snapshot serializers**: `no-ng-attributes`, `ng-snapshot`, `html-comment`
- **Test file naming**: `*.spec.ts`
- **Setup file**: Each project has `src/test-setup.ts`

### Base Config Factory

```typescript
// jest.base.ts
export function jestBaseConfig(displayName: string) {
  return {
    displayName,
    preset: "../../jest.preset.cjs",
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    // ... transforms, serializers
  };
}
```

Each app/lib has its own `jest.config.ts` that calls `jestBaseConfig(appName)`.

### E2E Tests (Cypress)

- **Runner**: Cypress 12
- Configured via `@nx/cypress`
- Run with `nx e2e {app-name}-e2e`

### Mocks & Stubs

- Located at `libs/commonlib/src/lib/mocks/stubs/`
- Imported through the `commonlib` barrel

### Running Tests

```bash
# Single app
nx test account
nx test business

# All apps and libraries
yarn test

# Only affected by changes (CI PR mode)
nx affected --targets=test
```

## 20. Feature Flags

The `Feature` enum in `commonlib` defines all server-side feature flags. These are loaded from the server via `api.system.parameters()` and used to gate functionality.

```typescript
import { Feature } from 'commonlib';

// Usage pattern (check if feature is enabled via loaded parameters)
if (this.parameters.hasFeature(Feature.EXAMPLE_FEATURE)) { ... }
```



---

## 23. Key Dependencies Reference

### Why Specific Packages Were Chosen

| Package                       | Reason                                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `bignumber.js` (→ `SafeMath`) | JavaScript floating-point arithmetic is unsafe for financial calculations. All monetary operations use `SafeMath` |
| `luxon`                       | Modern date manipulation. Replaces moment.js with better TypeScript support                                       |
| `lodash-es`                   | Tree-shakeable lodash — only imported functions appear in bundles                                                 |
| `ngx-mask`                    | Required for Brazilian document formatting: CPF (`000.000.000-00`), CNPJ (`00.000.000/0000-00`), phone            |
| `minisearch`                  | Client-side full-text search for offline/fast search features                                                     |
| `patch-package`               | Applied to fix upstream bugs in dependencies without forking or waiting for upstream releases                     |
| `@ngu/carousel`               | Lightweight, touch-enabled carousel not available in Angular Material                                             |
| `scriptjs`                    | Async dynamic script injection (e.g., payment gateway SDKs)                                                       |
| `highcharts`                  | Full-featured charts for business analytics dashboards                                                            |

---

_This document was generated by thorough static analysis of the repository source code. Keep it updated whenever new applications, libraries, or significant patterns are introduced._

_Last updated: 2026-04-27_
