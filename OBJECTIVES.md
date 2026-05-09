# Objectives

## Goal

To research the internet for missing useful patterns and components to use in the dashboard.
Update the dashboard with additional components or improve the quality of existing components.

The overarching idea is that we have a mega complete dashboard UI and design system that's ready to use for svelte 5 and latest react. 

## Success criteria

A row in `results.tsv` is `keep` only if the change improves at least one of:

- _e.g. Lighthouse performance score on `/` ≥ 90 (was: TBD baseline)_
- _e.g. Total JS for `dashboard-react` < 200 KB gzipped_
- _e.g. All pages render without console errors_
- _e.g. Visual parity between React and Svelte on Dashboard, Devices, Clients_
- _e.g. Visual regression testing shows clear improvement to before_

…without regressing any of them.

## Constraints

- Maintain the public API of `@dash-ui/react` or `@dash-ui/svelte`.
- Maintain WCAG 2.2 AA contrast.
- No new runtime deps without a recorded benefit.

(add/remove as needed)

## Ideas to try

Optional brainstorm. The agent may pick from here or invent its own.

- ...
- ...
