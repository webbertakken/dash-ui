---
'@w5-ui/tokens': minor
'@w5-ui/svelte': minor
'@w5-ui/react': minor
'@w5-ui/wc': minor
---

Filled primary controls meet WCAG AA: white text on `brand-05` was 4.45:1 and on its `brand-06` hover 2.94:1. New tokens `--primary-fill` (brand-04, 5.83:1), `--primary-fill-hover` (brand-03), `--primary-fill-press` (brand-02) and `--primary-fill-fg`, as Tailwind colours and the `primaryFill` JS export. The primary Button and SplitButton, the info Badge, the active Stepper step and Pagination page, the selected date-picker days, the Sidebar and NotificationPanel count badges, the confirm dialog's info action and the SkipLink now use them.

`--primary` stays brand-05 as the accent (focus rings, slider tracks). Breaking: `--primary-hover`, `--primary-press` and `--primary-fg` (and their `-hover` / `-press` / `-fg` Tailwind colours) are removed; use the `--primary-fill-*` tokens.
