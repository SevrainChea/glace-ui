# GlaceSelect Design

**Date:** 2026-02-28

## Summary

A liquid glass custom select component with a dual API (props array + slots), teleported dropdown, and form consistency with GlaceInput (disabled/error states).

## Select vs Combobox distinction

- **Select** (this component): closed — user picks from a fixed list. `v-model` emits one of the provided option values.
- **Combobox** (future): open — user can type to filter or create values. GlaceSelect is intentionally designed so a future Combobox replaces only the `#trigger` slot with an `<input>`.

## Prop contract

```ts
export interface GlaceSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

export interface GlaceSelectProps {
  modelValue?: string | number | null
  options?: GlaceSelectOption[]
  placeholder?: string
  disabled?: boolean
  error?: string
}
```

**Emits:** `update:modelValue` → `string | number | null`

**Slots:**

| Slot       | Scoped props                                                        | Purpose                       |
| ---------- | ------------------------------------------------------------------- | ----------------------------- |
| `#trigger` | `{ selected: GlaceSelectOption \| null, placeholder: string }`      | Replace the trigger display   |
| `#option`  | `{ option: GlaceSelectOption, selected: boolean, active: boolean }` | Replace each option's content |

## DOM structure

```html
<!-- Root (inline, position: relative) -->
<div class="glace-select [--open] [--error] [--disabled]">
  <!-- Trigger -->
  <div class="glace-select__trigger glace-glass" role="combobox" aria-expanded="...">
    <slot name="trigger" :selected="selectedOption" :placeholder="placeholder">
      <span class="glace-select__value">Apple</span>
      <!-- or when nothing selected: -->
      <span class="glace-select__placeholder">Pick a fruit…</span>
    </slot>
    <span class="glace-select__chevron" aria-hidden="true">›</span>
  </div>

  <!-- Error message -->
  <p class="glace-select__error-text" role="alert">…</p>
</div>

<!-- Teleported to <body> -->
<ul class="glace-select__dropdown glace-glass" role="listbox">
  <li class="glace-select__option [--selected] [--active] [--disabled]" role="option">
    <slot name="option" :option="option" :selected="..." :active="..."> Apple </slot>
  </li>
</ul>
```

## Positioning

Dropdown uses `position: fixed` set via `getBoundingClientRect()` on the trigger on open:

```
top:   triggerRect.bottom + 4px
left:  triggerRect.left
width: triggerRect.width
```

On scroll or window resize, the dropdown closes (v1 simplification).

> **TODO:** Implement dynamic repositioning on scroll/resize instead of closing. Also handle viewport overflow (flip to open upward when near bottom of viewport).

## Keyboard navigation

| Key                          | Behaviour                            |
| ---------------------------- | ------------------------------------ |
| `Enter` / `Space` on trigger | Open                                 |
| `Arrow Down`                 | Next option (wraps); opens if closed |
| `Arrow Up`                   | Previous option (wraps)              |
| `Enter` on active option     | Select + close                       |
| `Escape`                     | Close, return focus to trigger       |
| `Tab`                        | Close                                |
| Click outside                | Close                                |

Active option (keyboard cursor) is tracked separately from selected value. Navigating with arrows does not commit the change — only `Enter` does. Disabled options are skipped during keyboard navigation.

On open, active option initialises to the currently selected option, or the first non-disabled option if nothing is selected.

## BEM classes

| Class                             | Purpose                         |
| --------------------------------- | ------------------------------- |
| `.glace-select`                   | Root wrapper                    |
| `.glace-select--open`             | Dropdown is open                |
| `.glace-select--error`            | Error state                     |
| `.glace-select--disabled`         | Disabled state                  |
| `.glace-select__trigger`          | Clickable trigger               |
| `.glace-select__value`            | Selected label text             |
| `.glace-select__placeholder`      | Placeholder text (no selection) |
| `.glace-select__chevron`          | Dropdown arrow icon             |
| `.glace-select__error-text`       | Error message below trigger     |
| `.glace-select__dropdown`         | Teleported panel                |
| `.glace-select__option`           | Individual option row           |
| `.glace-select__option--selected` | Currently selected value        |
| `.glace-select__option--active`   | Keyboard-focused option         |
| `.glace-select__option--disabled` | Non-selectable option           |

## Future extensibility

- **Combobox:** Replace `#trigger` slot with a `<GlaceInput>` that filters `options` before passing them down. The rest of the component is unchanged.
- **Multi-select:** Extend `modelValue` to `(string | number)[]`, update trigger to show multiple chips.
- **Dynamic positioning:** Replace the close-on-scroll behaviour with `ResizeObserver` + scroll listener that recalculates `getBoundingClientRect()`.
