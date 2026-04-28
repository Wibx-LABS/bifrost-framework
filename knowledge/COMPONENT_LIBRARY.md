---
domain: technical
type: reference
status: active
topic: bifrost/knowledge
---

# Bifrost Component Library

All reusable UI components available for use across the Bifrost ecosystem.

**Source:** Bifrost Frontend Repository Manual (Section 6.1 Components) + codebase  
**Last Updated:** 2026-04-27  
**Maintained by:** Frontend team

---

## Location

All components are in the `commonlib` shared library:

```typescript
import { AccordionComponent, CardComponent, /* ... */ } from 'commonlib';
```

**Path in monorepo:** `libs/commonlib/src/lib/components/`

---

## Form Components

### InputComponent

Text input field.

```typescript
<app-input
  [label]="'Email'"
  [value]="email"
  [error]="emailError"
  (valueChange)="onEmailChange($event)"
  [disabled]="false"
  [required]="true">
</app-input>
```

**Props:**
- `label: string` — Input label
- `value: string` — Current value
- `error: string` — Error message
- `disabled: boolean` — Disable input
- `required: boolean` — Mark as required
- `placeholder: string` — Placeholder text

**Events:**
- `valueChange: EventEmitter<string>` — Value changed

---

### SelectComponent

Dropdown select.

```typescript
<app-select
  [label]="'Category'"
  [options]="categories"
  [value]="selectedCategory"
  (valueChange)="onCategoryChange($event)">
</app-select>
```

**Props:**
- `label: string`
- `options: Array<{label, value}>`
- `value: any`

**Events:**
- `valueChange: EventEmitter<any>`

---

### CheckboxComponent

Checkbox input.

```typescript
<app-checkbox
  [label]="'Accept terms'"
  [checked]="termsAccepted"
  (checkedChange)="onTermsChange($event)">
</app-checkbox>
```

**Props:**
- `label: string`
- `checked: boolean`

**Events:**
- `checkedChange: EventEmitter<boolean>`

---

### RadioGroupComponent

Radio button group.

```typescript
<app-radio-group
  [label]="'Payment method'"
  [options]="['Credit Card', 'Debit Card', 'Wallet']"
  [value]="paymentMethod"
  (valueChange)="onPaymentChange($event)">
</app-radio-group>
```

---

### ButtonComponent

Standard button.

```typescript
<app-button
  [label]="'Submit'"
  [type]="'primary'"
  [disabled]="isLoading"
  (click)="onSubmit()">
</app-button>
```

**Props:**
- `label: string`
- `type: 'primary' | 'secondary' | 'danger'`
- `disabled: boolean`
- `loading: boolean`

---

### TextareaComponent

Multi-line text input.

```typescript
<app-textarea
  [label]="'Description'"
  [value]="description"
  [rows]="4"
  (valueChange)="onDescriptionChange($event)">
</app-textarea>
```

---

## Container Components

### CardComponent

Generic card container.

```typescript
<app-card [title]="'Card Title'">
  <p>Card content goes here</p>
</app-card>
```

---

### DialogComponent

Modal dialog.

```typescript
<app-dialog
  [title]="'Confirm Action'"
  [visible]="showDialog"
  (close)="onDialogClose()">
  <p>Dialog content</p>
  <button (click)="onConfirm()">Confirm</button>
</app-dialog>
```

---

### SidebarComponent

Collapsible sidebar with navigation.

```typescript
<app-sidebar
  [items]="sidebarItems"
  [open]="sidebarOpen"
  (itemClick)="onSidebarItemClick($event)">
</app-sidebar>
```

**Items structure:**
```typescript
interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  children?: SidebarItem[];
  separator?: boolean;
}
```

---

### AdminMenuComponent

Top-level navigation with header, menu, balance pill.

```typescript
<app-admin-menu
  [user]="currentUser"
  [balance]="walletBalance"
  (logout)="onLogout()">
</app-admin-menu>
```

---

## Display Components

### StatusPillComponent

Status badge.

```typescript
<app-status-pill
  [status]="'active'"
  [type]="'success'">
</app-status-pill>
```

**Status types:** `success` (green), `warning` (yellow), `error` (red), `info` (blue)

---

### ProgressBarComponent

Progress indicator.

```typescript
<app-progress-bar
  [value]="65"
  [max]="100"
  [label]="'65%'">
</app-progress-bar>
```

---

### SkeletonLoadingComponent

Loading skeleton (placeholder while data loads).

```typescript
<app-skeleton-loading
  [lines]="3"
  [width]="'100%'">
</app-skeleton-loading>
```

---

### SpinnerComponent

Loading spinner.

```typescript
<app-spinner
  [size]="'medium'"
  [color]="'primary'">
</app-spinner>
```

---

### CarouselComponent

Touch-enabled image carousel.

```typescript
<app-carousel
  [images]="productImages"
  [autoPlay]="true"
  [interval]="5000">
</app-carousel>
```

---

### TableComponent

Data table with sorting, pagination.

```typescript
<app-table
  [columns]="tableColumns"
  [data]="tableData"
  [paginated]="true"
  [pageSize]="20"
  (rowClick)="onRowClick($event)">
</app-table>
```

---

## Specialized Components

### QrcodeViewerComponent

QR code display.

```typescript
<app-qrcode-viewer
  [value]="qrCodeValue"
  [size]="300">
</app-qrcode-viewer>
```

---

### MapComponent

Google Maps wrapper.

```typescript
<app-map
  [center]="{ lat: -23.5505, lng: -46.6333 }"
  [zoom]="15"
  [markers]="mapMarkers">
</app-map>
```

---

### RateIconComponent

Star rating display (read-only).

```typescript
<app-rate-icon
  [rating]="4.5"
  [max]="5">
</app-rate-icon>
```

---

### StarRatingComponent

Interactive star rating.

```typescript
<app-star-rating
  [rating]="currentRating"
  [max]="5"
  (ratingChange)="onRatingChange($event)">
</app-star-rating>
```

---

### ProductImageViewerComponent

Multi-image product viewer with thumbnails.

```typescript
<app-product-image-viewer
  [images]="productImages"
  [selectedIndex]="0"
  (imageSelect)="onImageSelect($event)">
</app-product-image-viewer>
```

---

### UploadComponent

File upload with preview.

```typescript
<app-simple-upload
  [accept]="'.jpg,.png'"
  [maxSize]="5242880"
  (fileSelected)="onFileSelected($event)">
</app-simple-upload>
```

---

## Layout Components

### TabGroupComponent

Tabbed content switcher.

```typescript
<app-tab-group
  [tabs]="tabs"
  [activeTabIndex]="0"
  (tabChange)="onTabChange($event)">
</app-tab-group>
```

**Tab structure:**
```typescript
interface Tab {
  label: string;
  content: any;
}
```

---

### AccordionComponent

Collapsible accordion with expansion panels.

```typescript
<app-accordion
  [items]="accordionItems">
</app-accordion>
```

**Item structure:**
```typescript
interface AccordionItem {
  title: string;
  content: string;
  expanded?: boolean;
}
```

---

## Patterns & Best Practices

### Form Validation

```typescript
// In component
emailError: string = '';

onEmailChange(value: string) {
  if (!this.validateEmail(value)) {
    this.emailError = 'Invalid email';
  } else {
    this.emailError = '';
  }
}

// In template
<app-input
  [error]="emailError"
  (valueChange)="onEmailChange($event)">
</app-input>
```

### Loading States

```typescript
// Show spinner while loading
<app-spinner *ngIf="isLoading"></app-spinner>

// Show data when loaded
<div *ngIf="!isLoading">
  <app-table [data]="tableData"></app-table>
</div>
```

### Error Handling

```typescript
// Use status pill for error states
<app-status-pill
  *ngIf="error"
  [status]="'error'"
  [type]="'error'">
  {{ error }}
</app-status-pill>
```

---

## See Also

- **NAMING_CONVENTIONS.md** — Component naming patterns
- **TECH_STACK.md** — Dependencies (Angular Material, etc.)
- **Frontend_repository_manual.md** (Section 6.1) — Original source
