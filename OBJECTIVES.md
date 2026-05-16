# Objectives

## Goal

Right now, the dashboard looks mostly good, both in dev server and storybook. However, the code
blocks don't render correctly and the markdown tables aren't shown correctly in storybook. The whole
styling on the pages seems a bit off. And when userland
(i.e.`~/Repositories/assistant/apps/dashboard`) try to implement the design system it ends up
looking a lot different with regard to spacing and distance between elements.

We need to make sure the design system is optimised and has proper and well formatted instructions
UI for humands and for agentic implementers, so that resulting userland applications actually look
more like the intended design, as shown in the "Dashboard" section in Storybook.

## Success criteria

A row in `results.tsv` is `keep` only if the change improves at least one of:

- _e.g. Lighthouse performance score on `/` ≥ 90 (was: TBD baseline)_
- _e.g. Total JS for `dashboard-react` < 200 KB gzipped_
- _e.g. All pages render without console errors_
- _e.g. Visual parity between React and Svelte on Dashboard, Devices, Clients_
- _e.g. Visual regression testing shows clear improvement to before_
- Design system becomes easier to implement correctly for userland
- Instructions are equal or more clear

…without regressing any of them.

## Constraints

- Maintain WCAG 2.2 AA contrast.
- No new runtime deps without a recorded benefit.

## Ideas to try

Optional brainstorm. The agent may pick from here or invent its own.

- Add Design System best practices for better userland experience
- Better instructions for users (including agents) of how the dashboard design can be recreated in
  userland applications.
- Explanation pages with succinct writing in the writing style of React documentation / blog
- Reusable composite components to ensure integrity of the UI of combined components (i.e. Top bar
  and its groups)
- Graphs in storybook keep into account that bottom panel, so they don't fall behind it - easier to
  quickly see the whole graph.
- A page with all graphs, their names, intended usage and styling.
