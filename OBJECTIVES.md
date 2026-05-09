# Objectives

Edit this file to steer the autoresearch loop. The agent reads it at the top of
every iteration. Be concrete — vague goals produce vague iterations.

## Goal

> _e.g. Improve perceived performance and visual polish of `dashboard-react`
> while keeping `dashboard-svelte` at visual + behavioural parity._

(replace this block)

## Success criteria

A row in `results.tsv` is `keep` only if the change improves at least one of:

- _e.g. Lighthouse performance score on `/` ≥ 90 (was: TBD baseline)_
- _e.g. Total JS for `dashboard-react` < 200 KB gzipped_
- _e.g. All pages render without console errors_
- _e.g. Visual parity between React and Svelte on Dashboard, Devices, Clients_

…without regressing any of them.

(replace this block; pick metrics you can actually measure from a script)

## Constraints

- Do not change the public API of `@dash-ui/react` or `@dash-ui/svelte`.
- Maintain WCAG 2.2 AA contrast.
- No new runtime deps without a recorded benefit.

(add/remove as needed)

## Ideas to try

Optional brainstorm. The agent may pick from here or invent its own.

- ...
- ...
