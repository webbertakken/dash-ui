// Reusable data fixtures for chart and list components.
// Kept tiny and deterministic so tests stay fast.

export const labels4 = ['Mon', 'Tue', 'Wed', 'Thu'];
export const labels6 = ['M', 'T', 'W', 'T', 'F', 'S'];
export const values4a = [10, 30, 20, 40];
export const values4b = [5, 18, 22, 17];
export const values6a = [1, 4, 2, 7, 5, 9];
export const values6b = [3, 2, 6, 4, 8, 6];

export const series2x4 = [
  { label: 'A', color: '#006FFF', values: values4a },
  { label: 'B', color: '#00C8C8', values: values4b },
];

export const series1x6 = [{ label: 'A', color: '#006FFF', values: values6a }];

export const points = [
  { x: 1, y: 4 },
  { x: 2, y: 9 },
  { x: 3, y: 6 },
  { x: 4, y: 8 },
];
