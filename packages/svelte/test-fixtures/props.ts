// Per-component prop bundles for the @w5-ui/svelte smoke + SSR tests.
//
// We mirror the React fixtures (packages/react/test-fixtures/fixtures.tsx)
// but emit plain prop bags so each entry is { props: object } that can be
// passed straight to Svelte's render() (server) and @testing-library/svelte
// render() (client). Slot content is described in the optional `slot` field
// and rendered via a thin Svelte test harness when needed.

export interface Bundle {
  name: string
  props?: Record<string, unknown>
  slot?: string
}

const labels4 = ['Mon', 'Tue', 'Wed', 'Thu']
const labels6 = ['M', 'T', 'W', 'T', 'F', 'S']
const values4a = [10, 30, 20, 40]
const values4b = [5, 18, 22, 17]
const values6a = [1, 4, 2, 7, 5, 9]
const points = [
  { x: 1, y: 4 },
  { x: 2, y: 9 },
  { x: 3, y: 6 },
  { x: 4, y: 8 },
]
const series2x4 = [
  { label: 'A', color: '#006FFF', values: values4a },
  { label: 'B', color: '#00C8C8', values: values4b },
]

const noop = () => {}

export const BUNDLES: Record<string, Bundle[]> = {
  Accordion: [{ name: 'default', slot: 'content' }],
  AccordionItem: [
    { name: 'closed', props: { title: 'T' }, slot: 'body' },
    { name: 'open', props: { title: 'T', defaultOpen: true }, slot: 'body' },
  ],
  ActionMenu: [
    {
      name: 'default',
      props: {
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', danger: true, disabled: true },
        ],
        onAction: noop,
      },
    },
  ],
  ActivityFeed: [
    { name: 'default', props: { items: [{ id: '1', title: 'Joined', time: 'now' }] } },
    {
      name: 'busy',
      props: {
        items: [{ id: '1', title: 'x', description: 'd', time: 'now', severity: 'warn' }],
        busy: true,
        autoScroll: true,
      },
    },
    { name: 'empty', props: { items: [] } },
  ],
  Alert: [
    { name: 'info', slot: 'info' },
    { name: 'success', props: { variant: 'success', onDismiss: noop }, slot: 'ok' },
    { name: 'warn', props: { variant: 'warn' }, slot: 'w' },
    { name: 'danger', props: { variant: 'danger' }, slot: 'd' },
  ],
  AnnotatedTimeSeries: [
    {
      name: 'default',
      props: { data: values6a, labels: labels6, annotations: [{ index: 2, label: 's' }] },
    },
    { name: 'no annotations', props: { data: values6a } },
  ],
  ArcDiagram: [
    {
      name: 'default',
      props: {
        nodes: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
        links: [
          { source: 'a', target: 'c', value: 2 },
          { source: 'b', target: 'c' },
        ],
      },
    },
  ],
  AreaChart: [{ name: 'default', props: { series: series2x4, labels: labels4 } }],
  Avatar: [
    { name: 'initials', props: { initials: 'WB' } },
    {
      name: 'image',
      props: { src: 'data:image/svg+xml,<svg/>', alt: 'me', size: 'lg', status: 'online' },
    },
    { name: 'away', props: { status: 'away' } },
    { name: 'sm', props: { size: 'sm' } },
  ],
  AvatarGroup: [
    { name: 'default', props: { avatars: [{ initials: 'A' }, { initials: 'B' }] } },
    {
      name: 'overflow',
      props: {
        avatars: [{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }, { initials: 'D' }],
        max: 2,
        size: 'sm',
      },
    },
  ],
  Badge: [
    { name: 'count', props: { count: 3 }, slot: 'x' },
    { name: 'overflow', props: { count: 200, max: 99 }, slot: 'x' },
    { name: 'showZero', props: { count: 0, showZero: true, color: 'info' }, slot: 'x' },
    { name: 'dot', props: { dot: true, color: 'success' }, slot: 'x' },
  ],
  Banner: [
    { name: 'info', slot: 'hi' },
    {
      name: 'success',
      props: {
        variant: 'success',
        title: 'Done',
        action: { label: 'Undo', onClick: noop },
        onDismiss: noop,
      },
      slot: 'body',
    },
    { name: 'warn', props: { variant: 'warn' }, slot: 'w' },
    { name: 'danger', props: { variant: 'danger' }, slot: 'd' },
  ],
  BarChart: [{ name: 'default', props: { series: series2x4, labels: labels4 } }],
  BeeswarmChart: [
    {
      name: 'default',
      props: {
        series: [
          { label: 'A', points: [1, 2, 3] },
          { label: 'B', points: [2, 5, 6], color: '#0f0' },
        ],
        unit: 'ms',
      },
    },
    { name: 'yRange', props: { series: [{ label: 'A', points: [1, 2] }], yRange: [0, 10] } },
  ],
  BoxPlot: [
    {
      name: 'default',
      props: {
        series: [
          { label: 'A', q0: 1, q1: 3, q2: 5, q3: 7, q4: 9 },
          { label: 'B', q0: 0, q1: 2, q2: 4, q3: 6, q4: 8, color: '#0f0' },
        ],
      },
    },
    {
      name: 'yRange',
      props: { series: [{ label: 'A', q0: 0, q1: 2, q2: 4, q3: 6, q4: 8 }], yRange: [0, 10] },
    },
  ],
  Breadcrumb: [
    {
      name: 'default',
      props: { items: [{ label: 'Home', href: '/' }, { label: 'Now' }], onNavigate: noop },
    },
  ],
  BubbleChart: [
    {
      name: 'default',
      props: {
        points: [
          { x: 1, y: 2, r: 5 },
          { x: 4, y: 7, r: 10, color: '#0f0' },
        ],
      },
    },
    { name: 'fixed', props: { points: [{ x: 1, y: 2, r: 5 }], xRange: [0, 10], yRange: [0, 10] } },
  ],
  BulletChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 60, target: 80, ranges: [40, 70], unit: '%' },
          { label: 'B', value: 100, color: '#0f0' },
        ],
      },
    },
  ],
  BumpChart: [
    {
      name: 'default',
      props: {
        labels: labels4,
        series: [
          { label: 'A', ranks: [1, 2, 1, 3] },
          { label: 'B', ranks: [2, 1, 3, 1], color: '#0f0' },
        ],
      },
    },
  ],
  Button: [
    { name: 'ghost', slot: 'Click' },
    { name: 'primary', props: { variant: 'primary' }, slot: 'Save' },
    { name: 'danger', props: { variant: 'danger' }, slot: 'Delete' },
    { name: 'iconOnly', props: { iconOnly: true, title: 'x' }, slot: 'x' },
    { name: 'loading', props: { loading: true }, slot: 'Loading' },
    { name: 'disabled', props: { disabled: true }, slot: 'd' },
  ],
  IconButton: [
    { name: 'default', props: { title: 'x' }, slot: 'x' },
    { name: 'aria', props: {}, slot: 'x' },
  ],
  CIDRInput: [
    { name: 'default', props: { label: 'C' } },
    { name: 'controlled', props: { label: 'C', value: '10.0.0.0/8', onChange: noop } },
    { name: 'disabled', props: { label: 'C', disabled: true } },
  ],
  CalendarHeatmap: [
    {
      name: 'default',
      props: {
        data: Array.from({ length: 60 }, (_, i) => ({
          date: `2025-01-${(i % 30) + 1}`,
          value: i % 5,
        })),
      },
    },
    { name: 'maxValue', props: { data: [{ date: '2025-01-01', value: 1 }], maxValue: 10 } },
  ],
  Callout: [
    { name: 'info', props: { title: 'i' }, slot: 'body' },
    { name: 'success', props: { variant: 'success' }, slot: 'ok' },
    { name: 'warn', props: { variant: 'warn' }, slot: 'w' },
    { name: 'danger', props: { variant: 'danger' }, slot: 'd' },
  ],
  CandlestickChart: [
    {
      name: 'default',
      props: {
        bars: [
          { open: 10, close: 12, high: 14, low: 9 },
          { open: 12, close: 11, high: 13, low: 10 },
        ],
      },
    },
    {
      name: 'yRange',
      props: { bars: [{ open: 1, close: 2, high: 3, low: 0 }], yRange: [0, 5], unit: '$' },
    },
  ],
  Card: [
    { name: 'default', slot: 'x' },
    { name: 'span', props: { span: 2 }, slot: 'x' },
  ],
  Carousel: [
    {
      name: 'default',
      props: {
        label: 'news',
        slides: [
          { id: '1', title: 'A', body: 'a' },
          { id: '2', title: 'B', body: 'b' },
        ],
      },
    },
  ],
  Checkbox: [
    { name: 'default', props: { label: 'agree' } },
    { name: 'indeterminate', props: { label: 'agree', indeterminate: true } },
    { name: 'no label', props: {} },
  ],
  ChordDiagram: [
    {
      name: 'default',
      props: {
        nodes: [{ label: 'A' }, { label: 'B', color: '#0f0' }, { label: 'C' }],
        matrix: [
          [0, 5, 2],
          [5, 0, 1],
          [2, 1, 0],
        ],
      },
    },
  ],
  CirclePacking: [
    {
      name: 'default',
      props: {
        items: [
          { id: 'a', label: 'A', value: 10 },
          { id: 'b', label: 'B', value: 20, color: '#0f0' },
        ],
      },
    },
    {
      name: 'many',
      props: {
        items: Array.from({ length: 8 }, (_, i) => ({
          id: String(i),
          label: `n${i}`,
          value: 100 - i * 8,
        })),
      },
    },
    { name: 'empty', props: { items: [] } },
  ],
  CodeBlock: [
    { name: 'default', props: { code: 'echo hi' } },
    { name: 'language', props: { code: 'echo hi', language: 'bash', label: 'shell' } },
  ],
  ColorPicker: [
    { name: 'default', props: {} },
    { name: 'controlled', props: { value: '#006FFF', onChange: noop, srOnlyLabel: true } },
    { name: 'disabled', props: { disabled: true } },
  ],
  ColumnToggle: [
    {
      name: 'default',
      props: {
        columns: [
          { key: 'a', label: 'A', required: true },
          { key: 'b', label: 'B' },
        ],
        visible: new Set(['a']),
        onChange: noop,
      },
    },
  ],
  Combobox: [
    {
      name: 'default',
      props: {
        label: 'Pick',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        value: 'a',
        onChange: noop,
      },
    },
    { name: 'no value', props: { options: [{ value: 'a', label: 'A' }] } },
    { name: 'disabled', props: { options: [{ value: 'a', label: 'A' }], disabled: true } },
  ],
  CommandPalette: [
    {
      name: 'open',
      props: {
        open: true,
        onClose: noop,
        items: [
          { id: 'a', label: 'A', group: 'P', shortcut: 'A' },
          { id: 'b', label: 'B' },
        ],
        onSelect: noop,
      },
    },
    { name: 'closed', props: { open: false, onClose: noop, items: [], onSelect: noop } },
  ],
  ConfirmDialog: [
    {
      name: 'open info',
      props: { open: true, title: '?', description: 'd', onConfirm: noop, onCancel: noop },
    },
    {
      name: 'open danger',
      props: { open: true, title: '?', variant: 'danger', onConfirm: noop, onCancel: noop },
    },
    { name: 'closed', props: { open: false, title: '?', onConfirm: noop, onCancel: noop } },
  ],
  ContextMenu: [
    {
      name: 'open',
      props: {
        open: true,
        x: 10,
        y: 10,
        onClose: noop,
        onAction: noop,
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', danger: true, disabled: true },
        ],
      },
    },
    {
      name: 'closed',
      props: { open: false, x: 0, y: 0, onClose: noop, onAction: noop, items: [] },
    },
  ],
  ContextualHelp: [
    { name: 'top', props: { title: 't', body: 'b' } },
    { name: 'bottom', props: { title: 't', body: 'b', placement: 'bottom' } },
  ],
  ContourPlot: [
    { name: 'default', props: { points } },
    { name: 'fixed', props: { points, xRange: [0, 10], yRange: [0, 10] } },
  ],
  CopyButton: [
    { name: 'default', props: { text: 'hello' } },
    { name: 'label', props: { text: 'hello', label: 'Copy hello' } },
  ],
  CorrelationMatrix: [
    {
      name: 'default',
      props: {
        labels: ['A', 'B'],
        data: [
          [1, 0.4],
          [0.4, 1],
        ],
      },
    },
  ],
  CountUp: [
    { name: 'default', props: { to: 100 } },
    {
      name: 'options',
      props: {
        from: 10,
        to: 1234,
        duration: 50,
        decimals: 2,
        prefix: '$',
        suffix: '!',
        separator: ',',
      },
    },
    { name: 'zero', props: { to: 0, duration: 0 } },
  ],
  CumulativeDistribution: [
    { name: 'default', props: { series: [{ label: 'a', color: '#006FFF', values: values6a }] } },
    {
      name: 'no guides',
      props: {
        series: [{ label: 'a', color: '#006FFF', values: values6a }],
        guides: [],
        unit: 'ms',
      },
    },
  ],
  DatePicker: [
    { name: 'default', props: {} },
    { name: 'controlled', props: { value: new Date('2025-01-01'), onChange: noop } },
    { name: 'disabled', props: { disabled: true } },
  ],
  DateRangePicker: [
    { name: 'default', props: {} },
    {
      name: 'controlled',
      props: {
        value: { start: new Date('2025-01-01'), end: new Date('2025-01-10') },
        onChange: noop,
      },
    },
    { name: 'disabled', props: { disabled: true } },
  ],
  Dendrogram: [
    {
      name: 'default',
      props: {
        root: {
          id: 'r',
          label: 'r',
          children: [
            { id: 'a', label: 'A' },
            { id: 'b', label: 'B', color: '#0f0', children: [{ id: 'b1', label: 'B1' }] },
          ],
        },
      },
    },
  ],
  Donut: [
    {
      name: 'default',
      props: {
        segments: [
          { label: 'A', value: 1, color: '#006FFF' },
          { label: 'B', value: 2, color: '#0f0' },
        ],
        centerValue: 3,
        centerLabel: 'Total',
      },
    },
  ],
  DotPlot: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 5, compare: 3 },
          { label: 'B', value: 10, color: '#0f0' },
        ],
        unit: 'ms',
        valueLegend: 'now',
        compareLegend: 'prev',
      },
    },
    { name: 'no compare', props: { items: [{ label: 'A', value: 5 }], max: 20 } },
  ],
  Drawer: [
    { name: 'open', props: { open: true, title: 'D', onClose: noop }, slot: 'hi' },
    { name: 'closed', props: { open: false, title: 'D', onClose: noop } },
  ],
  DualAxisChart: [
    {
      name: 'default',
      props: {
        bars: { label: 'b', color: '#006FFF', values: values4a },
        line: { label: 'l', color: '#0f0', values: values4b },
        labels: labels4,
      },
    },
  ],
  DumbbellChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', start: 1, end: 9 },
          { label: 'B', start: 4, end: 6, color: '#0f0' },
        ],
        unit: 'ms',
      },
    },
  ],
  DurationInput: [
    { name: 'default', props: { label: 'T' } },
    { name: 'controlled', props: { label: 'T', value: 3700, onChange: noop } },
    { name: 'disabled', props: { label: 'T', disabled: true, maxHours: 12 } },
  ],
  EmptyState: [
    { name: 'default', props: { title: 'Nothing' } },
    { name: 'with action', props: { title: 'N', description: 'd' } },
  ],
  ErrorBandChart: [
    {
      name: 'default',
      props: {
        series: [
          {
            label: 'a',
            color: '#006FFF',
            mean: [1, 2, 3],
            lower: [0.5, 1.5, 2.5],
            upper: [1.5, 2.5, 3.5],
          },
        ],
        xLabels: ['a', 'b', 'c'],
        unit: 'ms',
      },
    },
    {
      name: 'fixed',
      props: {
        series: [{ label: 'a', color: '#006FFF', mean: [1], lower: [0], upper: [2] }],
        yRange: [0, 5],
      },
    },
  ],
  ExpandableRow: [
    { name: 'closed', props: { colSpan: 1 } },
    { name: 'open', props: { colSpan: 1, defaultExpanded: true } },
  ],
  Field: [
    { name: 'default', props: { label: 'Name' } },
    { name: 'hint', props: { label: 'Name', hint: 'hint', required: true } },
    { name: 'error', props: { label: 'Name', error: 'bad' } },
    { name: 'value', props: { label: 'Name', value: 'v' } },
  ],
  FileUpload: [
    { name: 'default', props: {} },
    {
      name: 'multiple',
      props: { label: 'Logo', hint: 'png', accept: '.png', multiple: true, onFiles: noop },
    },
    { name: 'disabled', props: { disabled: true } },
  ],
  FilterBuilder: [
    {
      name: 'default',
      props: {
        fields: [
          { key: 'name', label: 'Name' },
          { key: 'count', label: 'Count', type: 'number' },
          { key: 'kind', label: 'K', type: 'select', options: ['a', 'b'] },
        ],
      },
    },
    {
      name: 'with rules',
      props: {
        fields: [{ key: 'name', label: 'Name' }],
        value: [{ id: '1', field: 'name', op: 'is', value: 'foo' }],
        conjunction: 'or',
        onChange: noop,
      },
    },
  ],
  FlameGraph: [
    {
      name: 'default',
      props: {
        root: {
          label: 'r',
          children: [
            { label: 'a', value: 5 },
            { label: 'b', value: 10, color: '#0f0', children: [{ label: 'b1', value: 4 }] },
          ],
        },
      },
    },
  ],
  ForceGraph: [
    {
      name: 'default',
      props: {
        nodes: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', color: '#0f0', r: 8 },
        ],
        links: [{ source: 'a', target: 'b' }],
      },
    },
  ],
  FunnelChart: [
    {
      name: 'default',
      props: {
        segments: [
          { label: 'a', value: 100 },
          { label: 'b', value: 60, color: '#0f0' },
          { label: 'c', value: 20 },
        ],
      },
    },
  ],
  GanttChart: [
    {
      name: 'default',
      props: {
        tasks: [
          { id: '1', label: 'A', start: 0, end: 4 },
          { id: '2', label: 'B', start: 2, end: 6, color: '#0f0' },
        ],
        xLabels: labels4,
      },
    },
  ],
  Gauge: [
    { name: 'default', props: { value: 0.5, label: 'cpu' } },
    { name: 'all', props: { value: 0.8, label: 'mem', color: '#0f0', size: 80 } },
    { name: 'high', props: { value: 1.5, label: 'hot' } },
  ],
  GroupedList: [
    {
      name: 'default',
      props: {
        groups: [
          { title: 'A', items: [{ label: 'one', sublabel: 's', meta: 'm', status: 'ok' }] },
          {
            title: 'B',
            items: [
              { label: 'two', status: 'warn' },
              { label: 'three', status: 'critical' },
            ],
          },
        ],
      },
    },
    {
      name: 'fixed',
      props: { groups: [{ title: 'A', items: [{ label: 'one' }] }], collapsible: false },
    },
  ],
  HealthBar: [
    { name: 'default', props: { value: 0.6 } },
    { name: 'with label', props: { value: 0.9, label: 'cpu', valueText: '90%' } },
  ],
  HeatMap: [
    {
      name: 'default',
      props: {
        data: [
          [0, 0.5, 1],
          [1, 0.5, 0],
        ],
        xLabels: ['x', 'y', 'z'],
      },
    },
  ],
  HexbinChart: [
    { name: 'default', props: { points } },
    { name: 'fixed', props: { points, xRange: [0, 10], yRange: [0, 10] } },
  ],
  Histogram: [
    {
      name: 'default',
      props: {
        bins: [
          { x0: 0, x1: 10, count: 5 },
          { x0: 10, x1: 20, count: 8 },
        ],
        xUnit: 'ms',
      },
    },
  ],
  HorizonChart: [
    {
      name: 'default',
      props: {
        series: [
          { label: 'a', values: values6a },
          { label: 'b', values: values6a, color: '#0f0' },
        ],
        xLabels: labels6,
      },
    },
  ],
  HoverCard: [{ name: 'default', props: {}, slot: 'trigger' }],
  IPInput: [
    { name: 'default', props: { label: 'IP' } },
    { name: 'controlled', props: { label: 'IP', value: '1.2.3.4', onChange: noop } },
    { name: 'disabled', props: { label: 'IP', disabled: true } },
  ],
  IcicleChart: [
    {
      name: 'default',
      props: {
        root: {
          label: 'r',
          children: [
            { label: 'a', value: 5 },
            { label: 'b', value: 10, color: '#0f0' },
          ],
        },
      },
    },
  ],
  InlineEdit: [
    { name: 'default', props: { value: 'hi', onConfirm: noop, label: 'Name' } },
    {
      name: 'placeholder',
      props: { value: '', onConfirm: noop, label: 'Name', placeholder: '...' },
    },
  ],
  Input: [
    { name: 'default', props: {} },
    { name: 'placeholder', props: { placeholder: 'p' } },
  ],
  SearchBox: [
    { name: 'default', props: {} },
    { name: 'placeholder', props: { placeholder: 'Search devices' } },
  ],
  InputGroup: [
    { name: 'default', props: {}, slot: 'x' },
    { name: 'pre suf', props: { prefix: '$', suffix: 'USD' }, slot: 'x' },
  ],
  JsonViewer: [
    { name: 'object', props: { data: { a: 1, b: [1, 2], c: { d: true, e: null, f: 'x' } } } },
    {
      name: 'collapsed',
      props: { data: { a: { b: { c: { d: 1 } } } }, defaultExpanded: false, maxDepth: 1 },
    },
    { name: 'array', props: { data: [1, 2, 3] } },
    { name: 'primitive', props: { data: 'hi' } },
  ],
  KVTable: [
    { name: 'default', props: { rows: [{ label: 'a', value: 'b' }] } },
    { name: 'caption', props: { rows: [{ label: 'a', value: 'b' }], caption: 'cap' } },
  ],
  KanbanBoard: [
    {
      name: 'default',
      props: {
        columns: [
          {
            id: 'todo',
            title: 'To do',
            color: '#0f0',
            cards: [{ id: '1', title: 'A', subtitle: 's', meta: 'm' }],
          },
          { id: 'done', title: 'Done', cards: [] },
        ],
      },
    },
    {
      name: 'no cb',
      props: { columns: [{ id: 'a', title: 'A', cards: [{ id: '1', title: 't' }] }] },
    },
  ],
  Kbd: [
    { name: 'string', props: { keys: 'K' } },
    { name: 'array', props: { keys: ['Ctrl', 'K'] } },
  ],
  LineChart: [{ name: 'default', props: { series: series2x4, labels: labels4 } }],
  LogViewer: [
    {
      name: 'default',
      props: {
        entries: [
          { time: '00:00', level: 'info', message: 'hi' },
          { time: '00:01', level: 'warn', message: 'w' },
          { time: '00:02', level: 'error', message: 'e', source: 'src' },
          { time: '00:03', level: 'debug', message: 'd' },
        ],
      },
    },
    { name: 'no follow', props: { entries: [], defaultFollow: false } },
  ],
  LollipopChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 5 },
          { label: 'B', value: 10, color: '#0f0' },
        ],
        unit: 'ms',
      },
    },
  ],
  MACInput: [
    { name: 'default', props: { label: 'MAC' } },
    { name: 'controlled', props: { label: 'MAC', value: 'ff:ff:ff:ff:ff:ff', onChange: noop } },
    { name: 'disabled', props: { label: 'MAC', disabled: true } },
  ],
  MarimekkoChart: [
    {
      name: 'default',
      props: {
        columns: [
          {
            label: 'A',
            segments: [
              { label: 'a', value: 1 },
              { label: 'b', value: 2, color: '#0f0' },
            ],
          },
          { label: 'B', segments: [{ label: 'a', value: 2 }] },
        ],
      },
    },
    {
      name: 'empty',
      props: {
        columns: [
          { label: 'A', segments: [] },
          { label: 'B', segments: [{ label: 'x', value: 5 }] },
        ],
      },
    },
  ],
  MatrixChart: [
    {
      name: 'default',
      props: { rows: ['r1'], cols: ['c1', 'c2'], values: [[0.1, 0.5]], unit: 'x' },
    },
  ],
  Menubar: [
    {
      name: 'default',
      props: {
        menus: [
          {
            id: 'f',
            label: 'File',
            items: [
              { id: 'open', label: 'Open' },
              { id: 'sep', label: '', separator: true },
              { id: 'close', label: 'Close', disabled: true },
            ],
          },
          { id: 'e', label: 'Edit', items: [{ id: 'cut', label: 'Cut' }] },
        ],
        onAction: noop,
      },
    },
  ],
  MirroredBarChart: [
    { name: 'default', props: { items: [{ label: 'A', left: 5, right: 7 }], unit: 'GB' } },
  ],
  Modal: [
    { name: 'open', props: { open: true, title: 't', onClose: noop }, slot: 'body' },
    { name: 'closed', props: { open: false, title: 't', onClose: noop } },
  ],
  MultiSelect: [
    {
      name: 'default',
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        value: ['a'],
        onChange: noop,
      },
    },
    { name: 'no value', props: { options: [{ value: 'a', label: 'A' }], label: 'lab' } },
    { name: 'disabled', props: { options: [{ value: 'a', label: 'A' }], disabled: true } },
  ],
  NightingaleChart: [
    {
      name: 'default',
      props: {
        segments: [
          { label: 'A', value: 5 },
          { label: 'B', value: 9, color: '#0f0' },
        ],
      },
    },
  ],
  NotificationPanel: [
    {
      name: 'open',
      props: {
        open: true,
        onClose: noop,
        notifications: [
          { id: '1', title: 'hi', body: 'b', time: 'now', read: false, severity: 'info' },
          { id: '2', title: 'h2', body: 'b2', time: 'now', read: true, severity: 'warn' },
          { id: '3', title: 'h3', body: 'b3', time: 'now', read: false, severity: 'critical' },
        ],
        onMarkRead: noop,
        onMarkAllRead: noop,
      },
    },
    { name: 'closed', props: { open: false, onClose: noop, notifications: [] } },
  ],
  NumberInput: [
    { name: 'default', props: { label: 'N' } },
    {
      name: 'controlled',
      props: { label: 'N', value: 5, onChange: noop, min: 0, max: 10, step: 2, suffix: 'x' },
    },
    { name: 'disabled', props: { label: 'N', disabled: true } },
  ],
  OTPInput: [
    { name: 'default', props: { label: 'OTP' } },
    { name: 'controlled', props: { label: 'OTP', value: '123', onChange: noop, length: 4 } },
    { name: 'disabled', props: { label: 'OTP', disabled: true } },
  ],
  Pagination: [
    { name: 'default', props: { page: 1, pageSize: 10, total: 50, onChange: noop } },
    { name: 'last', props: { page: 5, pageSize: 10, total: 50, onChange: noop } },
    { name: 'empty', props: { page: 1, pageSize: 10, total: 0, onChange: noop } },
  ],
  ParallelCoordinates: [
    {
      name: 'default',
      props: {
        axes: [{ label: 'a' }, { label: 'b', range: [0, 10] }],
        series: [
          { label: 's', values: [1, 5] },
          { label: 's2', values: [3, 7], color: '#0f0' },
        ],
      },
    },
  ],
  ParetoChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 50 },
          { label: 'B', value: 30 },
          { label: 'C', value: 20, color: '#0f0' },
        ],
        threshold: 0.7,
      },
    },
  ],
  PasswordInput: [
    { name: 'default', props: { label: 'P' } },
    {
      name: 'controlled',
      props: {
        label: 'P',
        value: 'x',
        onChange: noop,
        placeholder: 'pw',
        autocomplete: 'new-password',
      },
    },
    { name: 'disabled', props: { label: 'P', disabled: true } },
  ],
  PieChart: [
    {
      name: 'default',
      props: {
        slices: [
          { label: 'A', value: 1, color: '#006FFF' },
          { label: 'B', value: 3, color: '#0f0' },
        ],
      },
    },
  ],
  Pill: [
    { name: 'success', props: { variant: 'success' }, slot: 'ok' },
    { name: 'warn', props: { variant: 'warn' }, slot: 'w' },
    { name: 'danger', props: { variant: 'danger' }, slot: 'd' },
    { name: 'info', props: { variant: 'info' }, slot: 'i' },
    { name: 'neutral', props: {}, slot: 'n' },
    { name: 'no dot', props: { showDot: false }, slot: 'n' },
  ],
  PolarHeatmap: [
    {
      name: 'default',
      props: {
        data: [
          { row: 0, col: 0, value: 1 },
          { row: 1, col: 1, value: 0.5 },
        ],
        rows: 2,
        cols: 2,
        colLabels: ['c1', 'c2'],
      },
    },
  ],
  Popover: [
    { name: 'default', props: { label: 'open' }, slot: 'body' },
    {
      name: 'primary',
      props: { label: 'open', variant: 'primary', title: 't', placement: 'top' },
      slot: 'body',
    },
  ],
  ProgressBar: [
    { name: 'default', props: { value: 0.5 } },
    { name: 'with label', props: { value: 0.9, label: 'cpu', valueText: '90%', color: '#0f0' } },
  ],
  PunchCard: [
    {
      name: 'default',
      props: {
        data: [
          [0, 1, 2, 5, 3],
          [2, 1, 0, 4, 2],
          [3, 5, 1, 0, 6],
        ],
        rowLabels: ['r1', 'r2', 'r3'],
        colLabels: ['c1', 'c2', 'c3', 'c4', 'c5'],
      },
    },
    {
      name: 'no labels',
      props: {
        data: [
          [1, 2],
          [3, 4],
        ],
      },
    },
  ],
  QuadrantChart: [
    {
      name: 'default',
      props: {
        points: [
          { x: 1, y: 4, label: 'a' },
          { x: 9, y: 9, label: 'b' },
          { x: 1, y: 1, label: 'c' },
          { x: 9, y: 1, label: 'd' },
        ],
        xThreshold: 5,
        yThreshold: 5,
      },
    },
    {
      name: 'all options',
      props: {
        points: [{ x: 5, y: 5, label: 'mid' }],
        xThreshold: 5,
        yThreshold: 5,
        xRange: [0, 10],
        yRange: [0, 10],
        xLabel: 'cost',
        yLabel: 'value',
      },
    },
  ],
  RadarChart: [
    {
      name: 'default',
      props: {
        series: [{ label: 'a', color: '#006FFF', values: [0.2, 0.5, 0.8, 0.3] }],
        axes: ['a', 'b', 'c', 'd'],
      },
    },
  ],
  RadialBarChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 60, max: 100 },
          { label: 'B', value: 80, max: 100, color: '#0f0', unit: '%' },
        ],
      },
    },
    { name: 'over', props: { items: [{ label: 'A', value: 200, max: 100 }] } },
  ],
  RadioGroup: [
    {
      name: 'default',
      props: {
        legend: 'L',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', description: 'd', disabled: true },
        ],
      },
    },
    {
      name: 'controlled',
      props: {
        legend: 'L',
        name: 'n',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        value: 'b',
        onChange: noop,
        srOnlyLegend: true,
        horizontal: true,
      },
    },
    {
      name: 'default value',
      props: { legend: 'L', options: [{ value: 'a', label: 'A' }], defaultValue: 'a' },
    },
  ],
  RangeSlider: [
    { name: 'default', props: { label: 'R' } },
    { name: 'controlled', props: { label: 'R', low: 20, high: 80, onChange: noop, suffix: '%' } },
    {
      name: 'defaults',
      props: { label: 'R', defaultLow: 10, defaultHigh: 90, step: 5, disabled: true },
    },
  ],
  RankedList: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', value: 50, sublabel: 's' },
          { label: 'B', value: 80, color: '#0f0' },
        ],
        unit: 'ms',
      },
    },
    { name: 'fixed', props: { items: [{ label: 'A', value: 50 }], max: 100 } },
  ],
  ResizablePanel: [
    { name: 'vertical', props: {} },
    { name: 'horizontal', props: { orientation: 'horizontal', defaultSize: 30, min: 10, max: 90 } },
  ],
  RidgelinePlot: [
    {
      name: 'default',
      props: {
        series: [
          { label: 'a', values: values6a },
          { label: 'b', values: values6a, color: '#0f0' },
        ],
      },
    },
    { name: 'fixed', props: { series: [{ label: 'a', values: values6a }], xRange: [0, 10] } },
  ],
  RowToggleList: [
    {
      name: 'default',
      props: {
        items: [
          { title: 'A', description: 'a' },
          { title: 'B', description: 'b' },
        ],
        state: { A: true, B: false },
        onToggle: noop,
      },
    },
  ],
  SankeyDiagram: [
    {
      name: 'default',
      props: {
        nodes: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B', color: '#0f0' },
          { id: 'c', label: 'C' },
        ],
        links: [
          { source: 'a', target: 'b', value: 5 },
          { source: 'b', target: 'c', value: 3 },
        ],
      },
    },
  ],
  ScatterPlot: [
    { name: 'default', props: { points } },
    { name: 'fixed', props: { points, xRange: [0, 10], yRange: [0, 10] } },
  ],
  SegmentedControl: [
    {
      name: 'default',
      props: {
        label: 'L',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
      },
    },
    {
      name: 'controlled',
      props: {
        label: 'L',
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        value: 'b',
        onChange: noop,
      },
    },
    {
      name: 'default value',
      props: { label: 'L', options: [{ value: 'a', label: 'A' }], defaultValue: 'a' },
    },
  ],
  Select: [
    { name: 'default', props: { options: [{ value: 'a', label: 'A' }] } },
    {
      name: 'controlled',
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ],
        value: 'b',
        onChange: noop,
        label: 'L',
      },
    },
    { name: 'disabled', props: { options: [{ value: 'a', label: 'A' }], disabled: true } },
  ],
  SelectionToolbar: [
    {
      name: 'default',
      props: {
        count: 3,
        actions: [
          { id: 'd', label: 'Delete', danger: true },
          { id: 'e', label: 'Edit' },
        ],
        onClear: noop,
      },
    },
  ],
  Sidebar: [
    {
      name: 'default',
      props: {
        activeId: 'dash',
        sections: [
          {
            title: 'Manage',
            items: [
              { id: 'dash', label: 'Dashboard', count: 3, pill: 1 },
              { id: 'devs', label: 'Devices' },
            ],
          },
        ],
        onChange: noop,
      },
    },
  ],
  Signal: [
    { name: 'default', props: { label: 'ok' } },
    { name: 'weak', props: { weak: true, label: 'weak' } },
  ],
  Skeleton: [
    { name: 'text', props: {} },
    { name: 'rect', props: { variant: 'rect', width: 100, height: 20 } },
    { name: 'circle', props: { variant: 'circle', width: '40px', height: '40px' } },
  ],
  SkipLink: [
    { name: 'default', props: {} },
    { name: 'custom', props: { href: '#x' } },
  ],
  Slider: [
    { name: 'default', props: { label: 'L' } },
    {
      name: 'controlled',
      props: { label: 'L', value: 50, onChange: noop, min: 0, max: 100, step: 5, suffix: '%' },
    },
    { name: 'disabled', props: { label: 'L', disabled: true } },
  ],
  SlopeChart: [
    {
      name: 'default',
      props: {
        items: [
          { label: 'A', before: 5, after: 8 },
          { label: 'B', before: 9, after: 4 },
        ],
        unit: 'ms',
        positiveIsGood: true,
      },
    },
    {
      name: 'no flag',
      props: {
        items: [
          { label: 'A', before: 5, after: 5 },
          { label: 'B', before: 1, after: 9 },
        ],
      },
    },
  ],
  SortableList: [
    {
      name: 'default',
      props: {
        items: [
          { id: '1', label: 'A', meta: 'm' },
          { id: '2', label: 'B' },
        ],
        onChange: noop,
      },
    },
    { name: 'aria', props: { items: [{ id: '1', label: 'A' }], onChange: noop, ariaLabel: 'x' } },
  ],
  SortHeader: [
    {
      name: 'asc active',
      props: { sortKey: 'a', activeKey: 'a', dir: 'asc', onSort: noop },
      slot: 'A',
    },
    {
      name: 'desc active',
      props: { sortKey: 'a', activeKey: 'a', dir: 'desc', onSort: noop },
      slot: 'A',
    },
    {
      name: 'inactive',
      props: { sortKey: 'a', activeKey: 'b', dir: 'asc', onSort: noop },
      slot: 'A',
    },
  ],
  Sparkline: [
    { name: 'default', props: {} },
    { name: 'active', props: { bars: 10, active: true, seed: 42 } },
  ],
  SparklineMatrix: [
    {
      name: 'default',
      props: {
        rows: [
          { label: 'a', values: values6a },
          { label: 'b', values: values4a, color: '#0f0', meta: 'm', delta: '+1', deltaDir: 'up' },
          { label: 'c', values: [1, 1], delta: '-1', deltaDir: 'down' },
        ],
      },
    },
  ],
  Spinner: [
    { name: 'default', props: {} },
    { name: 'sm', props: { size: 'sm', label: 'loading' } },
    { name: 'lg', props: { size: 'lg' } },
  ],
  SplitButton: [
    {
      name: 'default',
      props: {
        label: 'Save',
        items: [
          { id: 'a', label: 'Save as' },
          { id: 'b', label: 'Save copy', disabled: true },
        ],
        onPrimaryClick: noop,
        onAction: noop,
      },
    },
    {
      name: 'primary',
      props: { label: 'x', variant: 'primary', disabled: true, items: [{ id: 'a', label: 'A' }] },
    },
    { name: 'danger', props: { label: 'x', variant: 'danger', items: [{ id: 'a', label: 'A' }] } },
  ],
  Spoiler: [
    { name: 'default', slot: 'tall' },
    { name: 'custom', props: { maxHeight: 20, showLabel: 'more', hideLabel: 'less' }, slot: 'x' },
  ],
  StackedBarChart: [
    { name: 'default', props: { series: series2x4, labels: labels4 } },
    { name: 'normalised', props: { series: series2x4, labels: labels4, normalized: true } },
  ],
  StackedProgress: [
    {
      name: 'default',
      props: {
        segments: [
          { label: 'A', value: 30, color: '#006FFF' },
          { label: 'B', value: 60, color: '#0f0' },
        ],
      },
    },
    {
      name: 'no legend',
      props: {
        segments: [{ label: 'A', value: 50, color: '#006FFF' }],
        total: 200,
        ariaLabel: 'x',
        showLegend: false,
      },
    },
  ],
  StarRating: [
    { name: 'default', props: { label: 'rate' } },
    { name: 'controlled', props: { label: 'rate', value: 3, onChange: noop, max: 6, size: 'sm' } },
    { name: 'readonly', props: { label: 'rate', value: 4, readOnly: true } },
    { name: 'default value', props: { label: 'rate', defaultValue: 2 } },
  ],
  Stat: [
    { name: 'default', props: { label: 'L', value: 42 } },
    {
      name: 'all options',
      props: {
        label: 'L',
        value: '42',
        unit: 'ms',
        sub: 'sub',
        delta: '+1',
        deltaDir: 'up',
        span: 2,
        color: '#0f0',
      },
    },
    { name: 'down', props: { label: 'L', value: '42', delta: '-1', deltaDir: 'down' } },
  ],
  StatusIndicator: [
    { name: 'default', props: { color: '#0f0', text: 'ok' } },
    { name: 'with textColor', props: { color: '#0f0', text: 'ok', textColor: '#fff' } },
  ],
  StepChart: [{ name: 'default', props: { series: series2x4, labels: labels4 } }],
  Stepper: [
    {
      name: 'default',
      props: {
        steps: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
        active: 'b',
      },
    },
    { name: 'with class', props: { steps: [{ id: 'a', label: 'A' }], active: 'a' } },
  ],
  StreamGraph: [
    {
      name: 'default',
      props: {
        labels: labels4,
        series: [
          { label: 'a', values: values4a },
          { label: 'b', values: values4b, color: '#0f0' },
        ],
      },
    },
  ],
  StripeChart: [
    {
      name: 'default',
      props: {
        data: [
          { label: 'A', value: 1 },
          { label: 'B', value: 5 },
        ],
      },
    },
  ],
  SunburstChart: [
    {
      name: 'default',
      props: {
        root: {
          label: 'r',
          children: [
            { label: 'a', value: 1 },
            { label: 'b', value: 2, color: '#0f0', children: [{ label: 'b1', value: 3 }] },
          ],
        },
      },
    },
  ],
  SwitchPortGrid: [
    {
      name: 'default',
      props: {
        ports: Array.from({ length: 8 }, (_, i) => ({
          index: i + 1,
          status: (['up', 'down', 'disabled', 'poe'] as const)[i % 4],
          speed: '1G',
        })),
        columns: 4,
        onPortClick: noop,
      },
    },
  ],
  TabPanel: [
    { name: 'active', props: { id: 'a', active: 'a' }, slot: 'A' },
    { name: 'inactive', props: { id: 'a', active: 'b' }, slot: 'A' },
  ],
  Tabs: [
    {
      name: 'default',
      props: {
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
        ],
        active: 'a',
        onChange: noop,
      },
    },
    { name: 'with aria', props: { items: [{ id: 'a', label: 'A' }], active: 'a', ariaLabel: 't' } },
  ],
  Tag: [
    { name: 'default', props: { label: 'x' } },
    { name: 'removable', props: { label: 'x', onRemove: noop } },
  ],
  TagInput: [
    { name: 'default', props: { label: 'L' } },
    { name: 'controlled', props: { label: 'L', value: ['a'], onChange: noop, placeholder: 'p' } },
    { name: 'disabled', props: { label: 'L', disabled: true, defaultValue: ['a', 'b'] } },
  ],
  Textarea: [
    { name: 'default', props: {} },
    { name: 'with rows', props: { rows: 6 } },
  ],
  ThresholdAreaChart: [
    {
      name: 'default',
      props: { values: values6a, labels: labels6, threshold: 5, thresholdLabel: 'warn' },
    },
  ],
  TimePicker: [
    { name: 'default', props: { label: 'T' } },
    { name: 'controlled', props: { label: 'T', value: '12:00', onChange: noop } },
    { name: 'disabled', props: { label: 'T', disabled: true } },
  ],
  TimeRange: [
    { name: 'default', props: {} },
    { name: 'controlled', props: { value: '24h', onChange: noop } },
  ],
  Timeline: [
    {
      name: 'default',
      props: {
        events: [
          { id: '1', title: 'a', time: 'now' },
          { id: '2', title: 'b', time: 'later', description: 'd', icon: 'x' },
        ],
      },
    },
  ],
  Toast: [{ name: 'default', props: {} }],
  Toggle: [
    { name: 'off', props: { on: false, ariaLabel: 't' } },
    { name: 'on', props: { on: true, onToggle: noop, ariaDescribedBy: 'd' } },
  ],
  RowToggle: [
    { name: 'default', props: { title: 't', description: 'd', on: false } },
    { name: 'on', props: { title: 't', description: 'd', on: true, onToggle: noop } },
  ],
  ToggleGroup: [
    {
      name: 'default',
      props: {
        options: [
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ],
        value: ['a'],
        onChange: noop,
        ariaLabel: 't',
      },
    },
    {
      name: 'sm',
      props: {
        options: [{ value: 'a', label: 'A' }],
        value: [],
        onChange: noop,
        ariaLabel: 't',
        size: 'sm',
      },
    },
  ],
  Tooltip: [{ name: 'default', props: { label: 't' }, slot: 'x' }],
  Topbar: [
    // activeApp must match one of DEFAULT_APPS ('system' / 'instances' /
    // 'agents'); otherwise no tab renders as `aria-current="page"` and the
    // active-tab underline never shows in the story.
    { name: 'default', props: { siteName: 'HQ', activeApp: 'system' } },
    {
      name: 'with apps',
      props: {
        siteName: 'HQ',
        activeApp: 'instances',
        onAppChange: noop,
        initials: 'WB',
        notificationCount: 5,
      },
    },
    { name: 'status=warn', props: { siteName: 'HQ', activeApp: 'system', status: 'warn' } },
    { name: 'status=danger', props: { siteName: 'HQ', activeApp: 'system', status: 'danger' } },
    { name: 'status=neutral', props: { siteName: 'HQ', activeApp: 'system', status: 'neutral' } },
    {
      name: 'siteSwitchable=false',
      props: { siteName: 'HQ', activeApp: 'system', siteSwitchable: false },
    },
  ],
  TransferList: [
    { name: 'default', props: {} },
    {
      name: 'with items',
      props: {
        sourceLabel: 'src',
        targetLabel: 'tgt',
        defaultSource: [{ id: '1', label: 'A', description: 'd' }],
        defaultTarget: [{ id: '2', label: 'B' }],
        onChange: noop,
      },
    },
    {
      name: 'controlled',
      props: { source: [{ id: '1', label: 'A' }], target: [{ id: '2', label: 'B' }] },
    },
  ],
  TreeMap: [
    {
      name: 'default',
      props: {
        nodes: [
          { label: 'A', value: 5 },
          { label: 'B', value: 10, color: '#0f0' },
        ],
      },
    },
  ],
  TreeView: [
    {
      name: 'default',
      props: {
        nodes: [
          { id: 'a', label: 'A', children: [{ id: 'b', label: 'B', icon: 'x', meta: 'm' }] },
          { id: 'c', label: 'C' },
        ],
        defaultExpanded: ['a'],
        selected: 'b',
        onSelect: noop,
        label: 'L',
      },
    },
    { name: 'flat', props: { nodes: [{ id: 'a', label: 'A' }] } },
  ],
  TreeItem: [
    {
      name: 'default',
      props: {
        node: { id: 'a', label: 'A' },
        depth: 0,
        expanded: new Set<string>(),
        selected: undefined,
        onToggle: noop,
        onSelect: noop,
      },
    },
  ],
  UptimeTimeline: [
    {
      name: 'default',
      props: {
        series: [
          {
            label: 'A',
            segments: [
              { from: 0, to: 5, status: 'up' },
              { from: 5, to: 8, status: 'degraded' },
              { from: 8, to: 10, status: 'down' },
            ],
          },
        ],
        xLabels: ['0', '5', '10'],
      },
    },
  ],
  VennDiagram: [
    {
      name: 'two sets',
      props: {
        sets: [
          { label: 'A', size: 10 },
          { label: 'B', size: 8 },
        ],
        intersections: [{ sets: ['A', 'B'], size: 3 }],
      },
    },
    {
      name: 'three sets',
      props: {
        sets: [
          { label: 'A', size: 10, color: '#0f0' },
          { label: 'B', size: 8 },
          { label: 'C', size: 6 },
        ],
      },
    },
  ],
  ViolinPlot: [
    {
      name: 'default',
      props: {
        series: [
          { label: 'A', values: [1, 2, 2, 3, 4, 5, 5, 6] },
          { label: 'B', values: [2, 3, 3, 4, 5], color: '#0f0' },
        ],
      },
    },
    { name: 'yRange', props: { series: [{ label: 'A', values: [1, 2, 3] }], yRange: [0, 10] } },
  ],
  VirtualList: [
    {
      name: 'default',
      props: {
        items: Array.from({ length: 40 }, (_, i) => i),
        itemHeight: 20,
        height: 100,
        label: 'L',
      },
    },
    { name: 'overscan', props: { items: [1, 2], itemHeight: 20, height: 50, overscan: 5 } },
  ],
  WaffleChart: [
    {
      name: 'default',
      props: {
        segments: [
          { label: 'A', value: 30 },
          { label: 'B', value: 20, color: '#0f0' },
        ],
      },
    },
    {
      name: 'with total',
      props: { segments: [{ label: 'A', value: 30 }], total: 100, cols: 5, rows: 5, gap: 1 },
    },
  ],
  WaterfallChart: [
    {
      name: 'default',
      props: {
        bars: [
          { label: 'a', value: 10, kind: 'start' },
          { label: 'b', value: 5, kind: 'pos' },
          { label: 'c', value: -3, kind: 'neg' },
          { label: 'd', value: 12, kind: 'end' },
        ],
      },
    },
  ],
  WordCloud: [
    {
      name: 'default',
      props: {
        items: Array.from({ length: 25 }, (_, i) => ({ word: `w${i}`, weight: 1 + (i % 5) })),
      },
    },
    {
      name: 'colored',
      props: {
        items: [
          { word: 'a', weight: 1, color: '#0f0' },
          { word: 'b', weight: 5 },
        ],
      },
    },
  ],
}

// Icon components
const ICON_NAMES = [
  'SearchIcon',
  'PlusIcon',
  'DownloadIcon',
  'CaretIcon',
  'CloseIcon',
  'BellIcon',
  'HelpIcon',
  'UpdatesIcon',
  'DashboardIcon',
  'DevicesIcon',
  'ClientsIcon',
  'TopologyIcon',
  'AlarmIcon',
  'LogsIcon',
  'WifiIcon',
  'PortsIcon',
  'VpnIcon',
  'SecurityIcon',
  'SettingsIcon',
  'WirelessIcon',
  'InfraIcon',
  'IntegrationsIcon',
]
for (const name of ICON_NAMES) {
  BUNDLES[name] = [
    { name: 'default', props: {} },
    { name: 'sized', props: { size: 32 } },
  ]
}

export const COMPONENT_NAMES = Object.keys(BUNDLES).sort()
