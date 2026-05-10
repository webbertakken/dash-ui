// Auto-loaded stories: one entry per fixture variant in @dash-ui/react.
//
// Storybook does not run TypeScript at story-discovery time, so we declare a
// CSF default export per category and emit named exports per component +
// variant via meta.title rewrites. To avoid one giant file pre-emitting 500
// stories at module load, we partition by category into separate files.

export {};
