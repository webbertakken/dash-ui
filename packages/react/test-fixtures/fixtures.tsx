// Render fixtures for every public React component in @dash-ui/react.
// Each entry produces one or more React elements. The auto-render test
// (see packages/react/src/__tests__/auto-render.test.tsx) iterates all
// fixtures and asserts they render without throwing.
//
// Adding extra variants here is the primary way we drive line + branch
// coverage to 100% for component files that have multiple render paths.

import { useState } from 'react';
import * as U from '../src/index.js';
import { labels4, labels6, points, series1x6, series2x4, values4a, values4b, values6a } from './data.js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ref = { series1x6, values4a, labels6 };

const noop = () => {};

export type Variant = { name: string; node: React.ReactNode };

export const FIXTURES: Record<string, Variant[]> = {
  Accordion: [
    { name: 'default', node: <U.Accordion><U.AccordionItem title="One">One</U.AccordionItem><U.AccordionItem title="Two" defaultOpen>Two</U.AccordionItem></U.Accordion> },
  ],
  AccordionItem: [
    { name: 'closed', node: <U.AccordionItem title="Item">body</U.AccordionItem> },
    { name: 'open', node: <U.AccordionItem title="Item" defaultOpen>body</U.AccordionItem> },
  ],
  ActionMenu: [
    { name: 'default', node: <U.ActionMenu items={[{ id: 'a', label: 'Edit' }, { id: 'b', label: 'Delete', danger: true, disabled: true }]} onAction={noop} /> },
  ],
  ActivityFeed: [
    { name: 'default', node: <U.ActivityFeed items={[{ id: '1', title: 'Joined', time: 'now' }]} /> },
    { name: 'busy + autoscroll', node: <U.ActivityFeed items={[{ id: '1', title: 'Joined', description: 'desc', time: 'now', severity: 'warn' }]} busy autoScroll /> },
    { name: 'empty', node: <U.ActivityFeed items={[]} /> },
  ],
  Alert: [
    { name: 'info', node: <U.Alert>info text</U.Alert> },
    { name: 'success dismiss', node: <U.Alert variant="success" onDismiss={noop}>ok</U.Alert> },
    { name: 'warn', node: <U.Alert variant="warn">w</U.Alert> },
    { name: 'danger', node: <U.Alert variant="danger">d</U.Alert> },
  ],
  AnnotatedTimeSeries: [
    { name: 'default', node: <U.AnnotatedTimeSeries data={values6a} labels={labels6} annotations={[{ index: 2, label: 'spike' }]} /> },
    { name: 'no annotations', node: <U.AnnotatedTimeSeries data={values6a} /> },
  ],
  Topbar: [
    { name: 'default', node: <U.Topbar siteName="HQ" activeApp="network" /> },
    { name: 'with apps', node: <U.Topbar siteName="HQ" activeApp="network" onAppChange={noop} initials="WB" notificationCount={5} /> },
  ],
  Sidebar: [
    { name: 'default', node: <U.Sidebar activeId="dash" sections={[{ title: 'Manage', items: [{ id: 'dash', label: 'Dashboard', icon: null, count: 3, pill: 1 }, { id: 'devs', label: 'Devices', icon: null }] }]} onChange={noop} /> },
  ],
  ArcDiagram: [
    { name: 'default', node: <U.ArcDiagram nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B', color: '#fff' }, { id: 'c', label: 'C' }]} links={[{ source: 'a', target: 'c', value: 2 }, { source: 'b', target: 'c', color: '#0f0' }]} /> },
  ],
  AreaChart: [
    { name: 'default', node: <U.AreaChart series={series2x4} labels={labels4} /> },
  ],
  Avatar: [
    { name: 'initials', node: <U.Avatar initials="WB" /> },
    { name: 'image', node: <U.Avatar src="data:image/svg+xml,<svg/>" alt="me" size="lg" status="online" /> },
    { name: 'status away', node: <U.Avatar status="away" /> },
    { name: 'status offline', node: <U.Avatar status="offline" /> },
    { name: 'sm', node: <U.Avatar size="sm" /> },
  ],
  AvatarGroup: [
    { name: 'default', node: <U.AvatarGroup avatars={[{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }]} /> },
    { name: 'overflow', node: <U.AvatarGroup avatars={[{ initials: 'A' }, { initials: 'B' }, { initials: 'C' }, { initials: 'D' }]} max={2} size="sm" /> },
  ],
  Badge: [
    { name: 'count', node: <U.Badge count={3}>x</U.Badge> },
    { name: 'overflow', node: <U.Badge count={150} max={99}>x</U.Badge> },
    { name: 'showZero false', node: <U.Badge count={0}>x</U.Badge> },
    { name: 'showZero true', node: <U.Badge count={0} showZero color="info">x</U.Badge> },
    { name: 'dot', node: <U.Badge dot color="success">x</U.Badge> },
    { name: 'no count', node: <U.Badge>x</U.Badge> },
  ],
  Banner: [
    { name: 'info', node: <U.Banner>hello</U.Banner> },
    { name: 'with action', node: <U.Banner variant="success" title="Done" action={{ label: 'Undo', onClick: noop }} onDismiss={noop}>body</U.Banner> },
    { name: 'warn', node: <U.Banner variant="warn">w</U.Banner> },
    { name: 'danger', node: <U.Banner variant="danger">d</U.Banner> },
  ],
  BarChart: [
    { name: 'default', node: <U.BarChart series={series2x4} labels={labels4} /> },
  ],
  BeeswarmChart: [
    { name: 'default', node: <U.BeeswarmChart series={[{ label: 'A', points: [1, 2, 3, 4] }, { label: 'B', points: [2, 5, 6], color: '#0f0' }]} unit="ms" /> },
    { name: 'with yRange', node: <U.BeeswarmChart series={[{ label: 'A', points: [1, 2] }]} yRange={[0, 10]} /> },
  ],
  BoxPlot: [
    { name: 'default', node: <U.BoxPlot series={[{ label: 'A', q0: 1, q1: 3, q2: 5, q3: 7, q4: 9 }, { label: 'B', q0: 0, q1: 2, q2: 4, q3: 6, q4: 8, color: '#0f0' }]} /> },
    { name: 'yRange', node: <U.BoxPlot series={[{ label: 'A', q0: 0, q1: 2, q2: 4, q3: 6, q4: 8 }]} yRange={[0, 10]} /> },
  ],
  Breadcrumb: [
    { name: 'default', node: <U.Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Devices' }]} onNavigate={noop} /> },
  ],
  BubbleChart: [
    { name: 'default', node: <U.BubbleChart points={[{ x: 1, y: 2, r: 5 }, { x: 4, y: 7, r: 10, color: '#0f0' }]} /> },
    { name: 'fixed ranges', node: <U.BubbleChart points={[{ x: 1, y: 2, r: 5 }]} xRange={[0, 10]} yRange={[0, 10]} /> },
  ],
  BulletChart: [
    { name: 'default', node: <U.BulletChart items={[{ label: 'A', value: 60, target: 80, ranges: [40, 70], unit: '%' }, { label: 'B', value: 100, color: '#0f0' }]} /> },
  ],
  BumpChart: [
    { name: 'default', node: <U.BumpChart labels={labels4} series={[{ label: 'A', ranks: [1, 2, 1, 3] }, { label: 'B', ranks: [2, 1, 3, 1], color: '#0f0' }]} /> },
  ],
  Button: [
    { name: 'ghost', node: <U.Button>Click</U.Button> },
    { name: 'primary', node: <U.Button variant="primary">Save</U.Button> },
    { name: 'danger', node: <U.Button variant="danger">Delete</U.Button> },
    { name: 'iconOnly', node: <U.Button iconOnly aria-label="x">x</U.Button> },
    { name: 'loading', node: <U.Button loading>Loading</U.Button> },
    { name: 'disabled', node: <U.Button disabled>Disabled</U.Button> },
  ],
  IconButton: [
    { name: 'default', node: <U.IconButton title="x">x</U.IconButton> },
    { name: 'with aria-label', node: <U.IconButton aria-label="more">x</U.IconButton> },
  ],
  CIDRInput: [
    { name: 'default', node: <U.CIDRInput label="CIDR" /> },
    { name: 'controlled', node: <U.CIDRInput label="CIDR" value="10.0.0.0/8" onChange={noop} /> },
    { name: 'disabled', node: <U.CIDRInput label="CIDR" disabled /> },
  ],
  CalendarHeatmap: [
    { name: 'default', node: <U.CalendarHeatmap data={Array.from({ length: 60 }, (_, i) => ({ date: `2025-01-${(i % 30) + 1}`, value: i % 5 }))} /> },
    { name: 'maxValue', node: <U.CalendarHeatmap data={[{ date: '2025-01-01', value: 1 }]} maxValue={10} /> },
  ],
  Callout: [
    { name: 'info', node: <U.Callout title="i">body</U.Callout> },
    { name: 'success', node: <U.Callout variant="success">ok</U.Callout> },
    { name: 'warn', node: <U.Callout variant="warn">w</U.Callout> },
    { name: 'danger', node: <U.Callout variant="danger">d</U.Callout> },
  ],
  CandlestickChart: [
    { name: 'default', node: <U.CandlestickChart bars={[{ open: 10, close: 12, high: 14, low: 9 }, { open: 12, close: 11, high: 13, low: 10 }]} /> },
    { name: 'with yRange + unit', node: <U.CandlestickChart bars={[{ open: 1, close: 2, high: 3, low: 0 }]} yRange={[0, 5]} unit="$" /> },
  ],
  Card: [
    { name: 'default', node: <U.Card>x</U.Card> },
    { name: 'span', node: <U.Card span={2} className="extra">x</U.Card> },
  ],
  CardTitle: [
    { name: 'default', node: <U.CardTitle>Hello</U.CardTitle> },
  ],
  Carousel: [
    { name: 'default', node: <U.Carousel label="news" slides={[{ id: '1', title: 'A', body: 'a' }, { id: '2', title: 'B', body: 'b' }]} /> },
  ],
  Checkbox: [
    { name: 'default', node: <U.Checkbox label="agree" /> },
    { name: 'indeterminate', node: <U.Checkbox label="agree" indeterminate /> },
    { name: 'no label', node: <U.Checkbox aria-label="no label" /> },
  ],
  ChordDiagram: [
    { name: 'default', node: <U.ChordDiagram nodes={[{ label: 'A' }, { label: 'B', color: '#0f0' }, { label: 'C' }]} matrix={[[0, 5, 2], [5, 0, 1], [2, 1, 0]]} /> },
  ],
  CirclePacking: [
    { name: 'default', node: <U.CirclePacking items={[{ id: 'a', label: 'A', value: 10 }, { id: 'b', label: 'B', value: 20, color: '#0f0' }]} /> },
    { name: 'many circles', node: <U.CirclePacking items={Array.from({ length: 8 }, (_, i) => ({ id: String(i), label: `n${i}`, value: 100 - i * 8 }))} /> },
    { name: 'empty', node: <U.CirclePacking items={[]} /> },
  ],
  CodeBlock: [
    { name: 'default', node: <U.CodeBlock code="echo hi" /> },
    { name: 'with language', node: <U.CodeBlock code="echo hi" language="bash" label="shell" /> },
  ],
  ColorPicker: [
    { name: 'default', node: <U.ColorPicker /> },
    { name: 'controlled', node: <U.ColorPicker value="#006FFF" onChange={noop} srOnlyLabel /> },
    { name: 'disabled', node: <U.ColorPicker disabled /> },
  ],
  ColumnToggle: [
    { name: 'default', node: <U.ColumnToggle columns={[{ key: 'a', label: 'A', required: true }, { key: 'b', label: 'B' }]} visible={new Set(['a'])} onChange={noop} /> },
  ],
  Combobox: [
    { name: 'default', node: <U.Combobox label="Pick" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="a" onChange={noop} /> },
    { name: 'no value', node: <U.Combobox options={[{ value: 'a', label: 'A' }]} /> },
    { name: 'disabled', node: <U.Combobox options={[{ value: 'a', label: 'A' }]} disabled /> },
  ],
  CommandPalette: [
    { name: 'open', node: <U.CommandPalette open onClose={noop} items={[{ id: 'a', label: 'Open A', group: 'Pages', shortcut: 'A' }, { id: 'b', label: 'Open B' }]} onSelect={noop} /> },
    { name: 'closed', node: <U.CommandPalette open={false} onClose={noop} items={[]} onSelect={noop} /> },
  ],
  ConfirmDialog: [
    { name: 'open info', node: <U.ConfirmDialog open title="?" description="d" onConfirm={noop} onCancel={noop} /> },
    { name: 'open danger', node: <U.ConfirmDialog open title="?" variant="danger" onConfirm={noop} onCancel={noop} /> },
    { name: 'closed', node: <U.ConfirmDialog open={false} title="?" onConfirm={noop} onCancel={noop} /> },
  ],
  ContextMenu: [
    { name: 'open', node: <U.ContextMenu open x={10} y={10} onClose={noop} onAction={noop} items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B', danger: true, disabled: true }]} /> },
    { name: 'closed', node: <U.ContextMenu open={false} x={0} y={0} onClose={noop} onAction={noop} items={[]} /> },
  ],
  ContextualHelp: [
    { name: 'top', node: <U.ContextualHelp title="t" body="b" /> },
    { name: 'bottom', node: <U.ContextualHelp title="t" body="b" placement="bottom" /> },
  ],
  ContourPlot: [
    { name: 'default', node: <U.ContourPlot points={points} /> },
    { name: 'fixed ranges', node: <U.ContourPlot points={points} xRange={[0, 10]} yRange={[0, 10]} /> },
  ],
  CopyButton: [
    { name: 'default', node: <U.CopyButton text="hello" /> },
    { name: 'with label', node: <U.CopyButton text="hello" label="Copy hello" /> },
  ],
  CorrelationMatrix: [
    { name: 'default', node: <U.CorrelationMatrix labels={['A', 'B']} data={[[1, 0.4], [0.4, 1]]} /> },
  ],
  CountUp: [
    { name: 'default', node: <U.CountUp to={100} /> },
    { name: 'all options', node: <U.CountUp from={10} to={1234} duration={50} decimals={2} prefix="$" suffix="!" separator="," className="x" /> },
    { name: 'zero duration', node: <U.CountUp to={0} duration={0} /> },
    { name: 'no separator', node: <U.CountUp to={1000} separator="" /> },
  ],
  CumulativeDistribution: [
    { name: 'default', node: <U.CumulativeDistribution series={[{ label: 'a', color: '#006FFF', values: values6a }]} /> },
    { name: 'no guides', node: <U.CumulativeDistribution series={[{ label: 'a', color: '#006FFF', values: values6a }]} guides={[]} unit="ms" /> },
  ],
  DatePicker: [
    { name: 'default', node: <U.DatePicker /> },
    { name: 'controlled', node: <U.DatePicker value={new Date('2025-01-01')} onChange={noop} /> },
    { name: 'disabled', node: <U.DatePicker disabled /> },
  ],
  DateRangePicker: [
    { name: 'default', node: <U.DateRangePicker /> },
    { name: 'controlled', node: <U.DateRangePicker value={{ start: new Date('2025-01-01'), end: new Date('2025-01-10') }} onChange={noop} /> },
    { name: 'disabled', node: <U.DateRangePicker disabled /> },
  ],
  Dendrogram: [
    { name: 'default', node: <U.Dendrogram root={{ id: 'r', label: 'root', children: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B', color: '#0f0', children: [{ id: 'b1', label: 'B1' }] }] }} /> },
  ],
  Donut: [
    { name: 'default', node: <U.Donut segments={[{ label: 'A', value: 1, color: '#006FFF' }, { label: 'B', value: 2, color: '#0f0' }]} centerValue={3} centerLabel="Total" /> },
  ],
  DotPlot: [
    { name: 'default', node: <U.DotPlot items={[{ label: 'A', value: 5, compare: 3 }, { label: 'B', value: 10, color: '#0f0' }]} unit="ms" valueLegend="now" compareLegend="prev" /> },
    { name: 'no compare', node: <U.DotPlot items={[{ label: 'A', value: 5 }]} max={20} /> },
  ],
  Drawer: [
    { name: 'open', node: <U.Drawer open title="Drawer" onClose={noop}>hi</U.Drawer> },
    { name: 'closed', node: <U.Drawer open={false} title="Drawer" onClose={noop} /> },
  ],
  DualAxisChart: [
    { name: 'default', node: <U.DualAxisChart bars={{ label: 'b', color: '#006FFF', values: values4a }} line={{ label: 'l', color: '#0f0', values: values4b }} labels={labels4} /> },
  ],
  DumbbellChart: [
    { name: 'default', node: <U.DumbbellChart items={[{ label: 'A', start: 1, end: 9 }, { label: 'B', start: 4, end: 6, color: '#0f0' }]} unit="ms" /> },
  ],
  DurationInput: [
    { name: 'default', node: <U.DurationInput label="Time" /> },
    { name: 'controlled', node: <U.DurationInput label="Time" value={3700} onChange={noop} /> },
    { name: 'disabled', node: <U.DurationInput label="Time" disabled maxHours={12} /> },
  ],
  EmptyState: [
    { name: 'default', node: <U.EmptyState title="Nothing" /> },
    { name: 'with action', node: <U.EmptyState title="Nothing" description="d" action={<U.Button>do</U.Button>} className="x" /> },
  ],
  ErrorBandChart: [
    { name: 'default', node: <U.ErrorBandChart series={[{ label: 'a', color: '#006FFF', mean: [1, 2, 3], lower: [0.5, 1.5, 2.5], upper: [1.5, 2.5, 3.5] }]} xLabels={['a', 'b', 'c']} unit="ms" /> },
    { name: 'fixed yRange', node: <U.ErrorBandChart series={[{ label: 'a', color: '#006FFF', mean: [1], lower: [0], upper: [2] }]} yRange={[0, 5]} /> },
  ],
  ExpandableRow: [
    { name: 'closed', node: <table><U.ExpandableRow row={<td>row</td>} detail={<div>detail</div>} colSpan={1} /></table> },
    { name: 'open', node: <table><U.ExpandableRow row={<td>row</td>} detail={<div>detail</div>} colSpan={1} defaultExpanded /></table> },
  ],
  Field: [
    { name: 'default', node: <U.Field label="Name"><input /></U.Field> },
    { name: 'with hint', node: <U.Field label="Name" hint="hint" required>x</U.Field> },
    { name: 'with error', node: <U.Field label="Name" error="bad">x</U.Field> },
    { name: 'value', node: <U.Field label="Name" value="v">x</U.Field> },
  ],
  FileUpload: [
    { name: 'default', node: <U.FileUpload /> },
    { name: 'multiple', node: <U.FileUpload label="Logo" hint="png" accept=".png" multiple onFiles={noop} /> },
    { name: 'disabled', node: <U.FileUpload disabled /> },
  ],
  FilterBuilder: [
    { name: 'default', node: <U.FilterBuilder fields={[{ key: 'name', label: 'Name' }, { key: 'count', label: 'Count', type: 'number' }, { key: 'kind', label: 'Kind', type: 'select', options: ['a', 'b'] }]} /> },
    { name: 'with rules', node: <U.FilterBuilder fields={[{ key: 'name', label: 'Name' }]} value={[{ id: '1', field: 'name', op: 'is', value: 'foo' }]} conjunction="or" onChange={noop} /> },
  ],
  FlameGraph: [
    { name: 'default', node: <U.FlameGraph root={{ label: 'root', children: [{ label: 'a', value: 5 }, { label: 'b', value: 10, color: '#0f0', children: [{ label: 'b1', value: 4 }] }] }} /> },
  ],
  ForceGraph: [
    { name: 'default', node: <U.ForceGraph nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B', color: '#0f0', r: 8 }]} links={[{ source: 'a', target: 'b' }]} /> },
  ],
  FunnelChart: [
    { name: 'default', node: <U.FunnelChart segments={[{ label: 'a', value: 100 }, { label: 'b', value: 60, color: '#0f0' }, { label: 'c', value: 20 }]} /> },
  ],
  GanttChart: [
    { name: 'default', node: <U.GanttChart tasks={[{ id: '1', label: 'A', start: 0, end: 4 }, { id: '2', label: 'B', start: 2, end: 6, color: '#0f0' }]} xLabels={labels4} /> },
  ],
  Gauge: [
    { name: 'default', node: <U.Gauge value={0.5} label="cpu" /> },
    { name: 'all options', node: <U.Gauge value={0.8} label="mem" color="#0f0" size={80} ariaLabel="ag" /> },
    { name: 'high', node: <U.Gauge value={1.5} label="hot" /> },
  ],
  GroupedList: [
    { name: 'default', node: <U.GroupedList groups={[{ title: 'A', items: [{ label: 'one', sublabel: 's', meta: 'm', status: 'ok' }] }, { title: 'B', items: [{ label: 'two', status: 'warn' }, { label: 'three', status: 'critical' }] }]} /> },
    { name: 'not collapsible', node: <U.GroupedList groups={[{ title: 'A', items: [{ label: 'one' }] }]} collapsible={false} /> },
  ],
  HealthBar: [
    { name: 'default', node: <U.HealthBar value={0.6} /> },
    { name: 'with label', node: <U.HealthBar value={0.9} label="cpu" valueText="90%" fillStyle={{ background: '#0f0' }} /> },
  ],
  HeatMap: [
    { name: 'default', node: <U.HeatMap data={[[0, 0.5, 1], [1, 0.5, 0]]} xLabels={['x', 'y', 'z']} /> },
  ],
  HexbinChart: [
    { name: 'default', node: <U.HexbinChart points={points} /> },
    { name: 'fixed ranges', node: <U.HexbinChart points={points} xRange={[0, 10]} yRange={[0, 10]} /> },
  ],
  Histogram: [
    { name: 'default', node: <U.Histogram bins={[{ x0: 0, x1: 10, count: 5 }, { x0: 10, x1: 20, count: 8 }]} xUnit="ms" /> },
  ],
  HorizonChart: [
    { name: 'default', node: <U.HorizonChart series={[{ label: 'a', values: values6a }, { label: 'b', values: values6a, color: '#0f0' }]} xLabels={labels6} /> },
  ],
  HoverCard: [
    { name: 'default', node: <U.HoverCard content={<div>tip</div>}>trigger</U.HoverCard> },
    { name: 'placements', node: <div>{(['top', 'bottom', 'left', 'right'] as const).map((p) => (<U.HoverCard key={p} placement={p} delay={0} content={<div>tip</div>}>{p}</U.HoverCard>))}</div> },
  ],
  IPInput: [
    { name: 'default', node: <U.IPInput label="IP" /> },
    { name: 'controlled', node: <U.IPInput label="IP" value="1.2.3.4" onChange={noop} /> },
    { name: 'disabled', node: <U.IPInput label="IP" disabled /> },
  ],
  IcicleChart: [
    { name: 'default', node: <U.IcicleChart root={{ label: 'r', children: [{ label: 'a', value: 5 }, { label: 'b', value: 10, color: '#0f0', children: [{ label: 'b1', value: 4 }, { label: 'b2', value: 6 }] }] }} /> },
  ],
  InlineEdit: [
    { name: 'default', node: <U.InlineEdit value="hi" onConfirm={noop} label="Name" /> },
    { name: 'with placeholder', node: <U.InlineEdit value="" onConfirm={noop} label="Name" placeholder="…" /> },
  ],
  Input: [
    { name: 'default', node: <U.Input /> },
    { name: 'with className', node: <U.Input className="x" placeholder="p" /> },
  ],
  SearchBox: [
    { name: 'default', node: <U.SearchBox /> },
    { name: 'with placeholder', node: <U.SearchBox placeholder="Search devices" /> },
  ],
  InputGroup: [
    { name: 'default', node: <U.InputGroup><U.Input /></U.InputGroup> },
    { name: 'with prefix + suffix', node: <U.InputGroup prefix="$" suffix="USD"><U.Input /></U.InputGroup> },
  ],
  JsonViewer: [
    { name: 'object', node: <U.JsonViewer data={{ a: 1, b: [1, 2], c: { d: true, e: null, f: 'x' } }} /> },
    { name: 'collapsed', node: <U.JsonViewer data={{ a: { b: { c: { d: 1 } } } }} defaultExpanded={false} maxDepth={1} /> },
    { name: 'array', node: <U.JsonViewer data={[1, 2, 3]} /> },
    { name: 'primitive', node: <U.JsonViewer data="hi" /> },
  ],
  KVTable: [
    { name: 'default', node: <U.KVTable rows={[{ label: 'a', value: 'b' }]} /> },
    { name: 'with caption', node: <U.KVTable rows={[{ label: 'a', value: 'b' }]} caption="cap" /> },
  ],
  KanbanBoard: [
    { name: 'default', node: <U.KanbanBoard columns={[{ id: 'todo', title: 'To do', color: '#0f0', cards: [{ id: '1', title: 'A', subtitle: 's', meta: 'm' }] }, { id: 'done', title: 'Done', cards: [] }]} /> },
    { name: 'no callback', node: <U.KanbanBoard columns={[{ id: 'a', title: 'A', cards: [{ id: '1', title: 't' }] }]} /> },
  ],
  Kbd: [
    { name: 'string', node: <U.Kbd keys="K" /> },
    { name: 'array', node: <U.Kbd keys={['Ctrl', 'K']} className="x" /> },
  ],
  LineChart: [
    { name: 'default', node: <U.LineChart series={series2x4} labels={labels4} /> },
  ],
  LogViewer: [
    { name: 'default', node: <U.LogViewer entries={[{ time: '00:00', level: 'info', message: 'hi' }, { time: '00:01', level: 'warn', message: 'w' }, { time: '00:02', level: 'error', message: 'e', source: 'src' }, { time: '00:03', level: 'debug', message: 'd' }]} /> },
    { name: 'no follow', node: <U.LogViewer entries={[]} defaultFollow={false} className="x" /> },
  ],
  LollipopChart: [
    { name: 'default', node: <U.LollipopChart items={[{ label: 'A', value: 5 }, { label: 'B', value: 10, color: '#0f0' }]} unit="ms" /> },
  ],
  MACInput: [
    { name: 'default', node: <U.MACInput label="MAC" /> },
    { name: 'controlled', node: <U.MACInput label="MAC" value="ff:ff:ff:ff:ff:ff" onChange={noop} /> },
    { name: 'disabled', node: <U.MACInput label="MAC" disabled /> },
  ],
  MarimekkoChart: [
    { name: 'default', node: <U.MarimekkoChart columns={[{ label: 'A', segments: [{ label: 'a', value: 1 }, { label: 'b', value: 2, color: '#0f0' }] }, { label: 'B', segments: [{ label: 'a', value: 2 }] }]} /> },
    { name: 'empty segments', node: <U.MarimekkoChart columns={[{ label: 'A', segments: [] }, { label: 'B', segments: [{ label: 'x', value: 5 }] }]} /> },
  ],
  MatrixChart: [
    { name: 'default', node: <U.MatrixChart rows={['r1']} cols={['c1', 'c2']} values={[[0.1, 0.5]]} unit="x" /> },
  ],
  Menubar: [
    { name: 'default', node: <U.Menubar menus={[{ id: 'f', label: 'File', items: [{ id: 'open', label: 'Open' }, { id: 'sep', label: '', separator: true }, { id: 'close', label: 'Close', disabled: true }] }, { id: 'e', label: 'Edit', items: [{ id: 'cut', label: 'Cut' }] }]} onAction={noop} className="x" /> },
  ],
  MirroredBarChart: [
    { name: 'default', node: <U.MirroredBarChart items={[{ label: 'A', left: 5, right: 7 }]} unit="GB" /> },
  ],
  Modal: [
    { name: 'open with footer', node: <U.Modal open title="t" onClose={noop} footer={<button>ok</button>}>body</U.Modal> },
    { name: 'closed', node: <U.Modal open={false} title="t" onClose={noop} /> },
    { name: 'open empty', node: <U.Modal open title="t" onClose={noop} /> },
  ],
  MultiSelect: [
    { name: 'default', node: <U.MultiSelect options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value={['a']} onChange={noop} /> },
    { name: 'no value', node: <U.MultiSelect options={[{ value: 'a', label: 'A' }]} label="lab" /> },
    { name: 'disabled', node: <U.MultiSelect options={[{ value: 'a', label: 'A' }]} disabled /> },
  ],
  NightingaleChart: [
    { name: 'default', node: <U.NightingaleChart segments={[{ label: 'A', value: 5 }, { label: 'B', value: 9, color: '#0f0' }]} /> },
  ],
  NotificationPanel: [
    { name: 'open', node: <U.NotificationPanel open onClose={noop} notifications={[{ id: '1', title: 'hi', body: 'b', time: 'now', read: false, severity: 'info' }, { id: '2', title: 'h2', body: 'b2', time: 'now', read: true, severity: 'warn' }, { id: '3', title: 'h3', body: 'b3', time: 'now', read: false, severity: 'critical' }]} onMarkRead={noop} onMarkAllRead={noop} /> },
    { name: 'closed', node: <U.NotificationPanel open={false} onClose={noop} notifications={[]} /> },
    { name: 'no callbacks', node: <U.NotificationPanel open onClose={noop} notifications={[{ id: '1', title: 'hi', body: 'b', time: 'now', read: false, severity: 'info' }]} /> },
  ],
  NumberInput: [
    { name: 'default', node: <U.NumberInput label="N" /> },
    { name: 'controlled', node: <U.NumberInput label="N" value={5} onChange={noop} min={0} max={10} step={2} suffix="x" /> },
    { name: 'disabled', node: <U.NumberInput label="N" disabled /> },
  ],
  OTPInput: [
    { name: 'default', node: <U.OTPInput label="OTP" /> },
    { name: 'controlled', node: <U.OTPInput label="OTP" value="123" onChange={noop} length={4} /> },
    { name: 'disabled', node: <U.OTPInput label="OTP" disabled /> },
  ],
  Pagination: [
    { name: 'default', node: <U.Pagination page={1} pageSize={10} total={50} onChange={noop} /> },
    { name: 'last page', node: <U.Pagination page={5} pageSize={10} total={50} onChange={noop} /> },
    { name: 'no items', node: <U.Pagination page={1} pageSize={10} total={0} onChange={noop} /> },
  ],
  ParallelCoordinates: [
    { name: 'default', node: <U.ParallelCoordinates axes={[{ label: 'a' }, { label: 'b', range: [0, 10] }]} series={[{ label: 's', values: [1, 5] }, { label: 's2', values: [3, 7], color: '#0f0' }]} /> },
  ],
  ParetoChart: [
    { name: 'default', node: <U.ParetoChart items={[{ label: 'A', value: 50 }, { label: 'B', value: 30 }, { label: 'C', value: 20, color: '#0f0' }]} threshold={0.7} /> },
  ],
  PasswordInput: [
    { name: 'default', node: <U.PasswordInput label="P" /> },
    { name: 'controlled', node: <U.PasswordInput label="P" value="x" onChange={noop} placeholder="pw" autocomplete="new-password" /> },
    { name: 'disabled', node: <U.PasswordInput label="P" disabled /> },
  ],
  PieChart: [
    { name: 'default', node: <U.PieChart slices={[{ label: 'A', value: 1, color: '#006FFF' }, { label: 'B', value: 3, color: '#0f0' }]} /> },
  ],
  Pill: [
    { name: 'success', node: <U.Pill variant="success">ok</U.Pill> },
    { name: 'warn', node: <U.Pill variant="warn">w</U.Pill> },
    { name: 'danger', node: <U.Pill variant="danger">d</U.Pill> },
    { name: 'info', node: <U.Pill variant="info">i</U.Pill> },
    { name: 'neutral', node: <U.Pill>n</U.Pill> },
    { name: 'no dot', node: <U.Pill showDot={false} className="x">n</U.Pill> },
  ],
  PolarHeatmap: [
    { name: 'default', node: <U.PolarHeatmap data={[{ row: 0, col: 0, value: 1 }, { row: 1, col: 1, value: 0.5 }]} rows={2} cols={2} colLabels={['c1', 'c2']} /> },
  ],
  Popover: [
    { name: 'default', node: <U.Popover label="open">body</U.Popover> },
    { name: 'primary', node: <U.Popover label="open" variant="primary" title="t" placement="top">body</U.Popover> },
  ],
  ProgressBar: [
    { name: 'default', node: <U.ProgressBar value={0.5} /> },
    { name: 'with label', node: <U.ProgressBar value={0.9} label="cpu" valueText="90%" color="#0f0" /> },
  ],
  PunchCard: [
    { name: 'default', node: <U.PunchCard data={[[0, 1, 2, 5, 3], [2, 1, 0, 4, 2], [3, 5, 1, 0, 6]]} rowLabels={['r1', 'r2', 'r3']} colLabels={['c1', 'c2', 'c3', 'c4', 'c5']} /> },
    { name: 'no labels', node: <U.PunchCard data={[[1, 2], [3, 4]]} /> },
  ],
  QuadrantChart: [
    { name: 'default', node: <U.QuadrantChart points={[{ x: 1, y: 4, label: 'a' }, { x: 9, y: 9, label: 'b' }, { x: 1, y: 1, label: 'c' }, { x: 9, y: 1, label: 'd' }]} xThreshold={5} yThreshold={5} /> },
    { name: 'with axes labels', node: <U.QuadrantChart points={[{ x: 1, y: 1, label: 'a' }]} xThreshold={5} yThreshold={5} xRange={[0, 10]} yRange={[0, 10]} xLabel="cost" yLabel="value" /> },
    { name: 'with custom labels + colors', node: <U.QuadrantChart points={[{ x: 5, y: 5, label: 'mid' }]} xThreshold={5} yThreshold={5} quadrantLabels={['tl', 'tr', 'bl', 'br']} quadrantColors={['#000', '#111', '#222', '#333']} /> },
  ],
  RadarChart: [
    { name: 'default', node: <U.RadarChart series={[{ label: 'a', color: '#006FFF', values: [0.2, 0.5, 0.8, 0.3] }]} axes={['a', 'b', 'c', 'd']} /> },
  ],
  RadialBarChart: [
    { name: 'default', node: <U.RadialBarChart items={[{ label: 'A', value: 60, max: 100 }, { label: 'B', value: 80, max: 100, color: '#0f0', unit: '%' }]} /> },
    { name: 'over max', node: <U.RadialBarChart items={[{ label: 'A', value: 200, max: 100 }]} /> },
    { name: 'zero', node: <U.RadialBarChart items={[{ label: 'A', value: 0, max: 100 }]} /> },
  ],
  RadioGroup: [
    { name: 'default', node: <U.RadioGroup legend="L" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B', description: 'd', disabled: true }]} /> },
    { name: 'controlled', node: <U.RadioGroup legend="L" name="n" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="b" onChange={noop} srOnlyLegend horizontal /> },
    { name: 'defaultValue', node: <U.RadioGroup legend="L" options={[{ value: 'a', label: 'A' }]} defaultValue="a" /> },
  ],
  RangeSlider: [
    { name: 'default', node: <U.RangeSlider label="R" /> },
    { name: 'controlled', node: <U.RangeSlider label="R" low={20} high={80} onChange={noop} suffix="%" /> },
    { name: 'defaults', node: <U.RangeSlider label="R" defaultLow={10} defaultHigh={90} step={5} disabled className="x" /> },
  ],
  RankedList: [
    { name: 'default', node: <U.RankedList items={[{ label: 'A', value: 50, sublabel: 's' }, { label: 'B', value: 80, color: '#0f0' }]} unit="ms" /> },
    { name: 'fixed max', node: <U.RankedList items={[{ label: 'A', value: 50 }]} max={100} /> },
  ],
  ResizablePanel: [
    { name: 'vertical', node: <U.ResizablePanel>{[<div key="a">A</div>, <div key="b">B</div>]}</U.ResizablePanel> },
    { name: 'horizontal', node: <U.ResizablePanel orientation="horizontal" defaultSize={30} min={10} max={90} className="x" style={{ height: 100 }}>{[<div key="a">A</div>, <div key="b">B</div>]}</U.ResizablePanel> },
  ],
  RidgelinePlot: [
    { name: 'default', node: <U.RidgelinePlot series={[{ label: 'a', values: values6a }, { label: 'b', values: values6a, color: '#0f0' }]} /> },
    { name: 'fixed xRange', node: <U.RidgelinePlot series={[{ label: 'a', values: values6a }]} xRange={[0, 10]} /> },
  ],
  SankeyDiagram: [
    { name: 'default', node: <U.SankeyDiagram nodes={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B', color: '#0f0' }, { id: 'c', label: 'C' }]} links={[{ source: 'a', target: 'b', value: 5 }, { source: 'b', target: 'c', value: 3 }]} /> },
  ],
  ScatterPlot: [
    { name: 'default', node: <U.ScatterPlot points={points} /> },
    { name: 'fixed ranges', node: <U.ScatterPlot points={points} xRange={[0, 10]} yRange={[0, 10]} /> },
  ],
  SegmentedControl: [
    { name: 'default', node: <U.SegmentedControl label="L" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B', disabled: true }]} /> },
    { name: 'controlled', node: <U.SegmentedControl label="L" options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="b" onChange={noop} /> },
    { name: 'defaultValue', node: <U.SegmentedControl label="L" options={[{ value: 'a', label: 'A' }]} defaultValue="a" /> },
  ],
  Select: [
    { name: 'default', node: <U.Select options={[{ value: 'a', label: 'A' }]} /> },
    { name: 'controlled', node: <U.Select options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }]} value="b" onChange={noop} label="L" /> },
    { name: 'disabled', node: <U.Select options={[{ value: 'a', label: 'A' }]} disabled /> },
  ],
  SelectionToolbar: [
    { name: 'default', node: <U.SelectionToolbar count={3} actions={[{ id: 'd', label: 'Delete', danger: true }, { id: 'e', label: 'Edit' }]} onClear={noop}>extra</U.SelectionToolbar> },
  ],
  Signal: [
    { name: 'default', node: <U.Signal label="ok" /> },
    { name: 'weak', node: <U.Signal weak label="weak" /> },
    { name: 'no label', node: <U.Signal /> },
  ],
  Skeleton: [
    { name: 'text', node: <U.Skeleton /> },
    { name: 'rect', node: <U.Skeleton variant="rect" width={100} height={20} className="x" style={{ margin: 0 }} ariaLabel="rect" /> },
    { name: 'circle', node: <U.Skeleton variant="circle" width="40px" height="40px" /> },
  ],
  SkipLink: [
    { name: 'default', node: <U.SkipLink /> },
    { name: 'custom', node: <U.SkipLink href="#x" className="y">skip</U.SkipLink> },
  ],
  Slider: [
    { name: 'default', node: <U.Slider label="L" /> },
    { name: 'controlled', node: <U.Slider label="L" value={50} onChange={noop} min={0} max={100} step={5} suffix="%" /> },
    { name: 'disabled', node: <U.Slider label="L" disabled className="x" /> },
  ],
  SlopeChart: [
    { name: 'default', node: <U.SlopeChart items={[{ label: 'A', before: 5, after: 8 }, { label: 'B', before: 9, after: 4 }]} unit="ms" positiveIsGood /> },
    { name: 'no positive flag', node: <U.SlopeChart items={[{ label: 'A', before: 5, after: 5 }, { label: 'B', before: 1, after: 9 }]} /> },
  ],
  SortableList: [
    { name: 'default', node: <U.SortableList items={[{ id: '1', label: 'A', meta: 'm' }, { id: '2', label: 'B' }]} onChange={noop} /> },
    { name: 'with aria', node: <U.SortableList items={[{ id: '1', label: 'A' }]} onChange={noop} ariaLabel="x" /> },
  ],
  SortHeader: [
    { name: 'asc active', node: <table><thead><tr><U.SortHeader sortKey="a" activeKey="a" dir="asc" onSort={noop}>A</U.SortHeader></tr></thead></table> },
    { name: 'desc active', node: <table><thead><tr><U.SortHeader sortKey="a" activeKey="a" dir="desc" onSort={noop}>A</U.SortHeader></tr></thead></table> },
    { name: 'inactive', node: <table><thead><tr><U.SortHeader sortKey="a" activeKey="b" dir="asc" onSort={noop} style={{ width: 10 }}>A</U.SortHeader></tr></thead></table> },
  ],
  Sparkline: [
    { name: 'default', node: <U.Sparkline /> },
    { name: 'active', node: <U.Sparkline bars={10} active seed={42} ariaLabel="x" /> },
  ],
  SparklineMatrix: [
    { name: 'default', node: <U.SparklineMatrix rows={[{ label: 'a', values: values6a }, { label: 'b', values: values4a, color: '#0f0', meta: 'm', delta: '+1', deltaDir: 'up' }, { label: 'c', values: [1, 1], delta: '-1', deltaDir: 'down' }]} /> },
  ],
  Spinner: [
    { name: 'default', node: <U.Spinner /> },
    { name: 'sm', node: <U.Spinner size="sm" label="loading" /> },
    { name: 'lg', node: <U.Spinner size="lg" /> },
  ],
  SplitButton: [
    { name: 'default', node: <U.SplitButton label="Save" items={[{ id: 'a', label: 'Save as' }, { id: 'b', label: 'Save copy', disabled: true }]} onPrimaryClick={noop} onAction={noop} /> },
    { name: 'primary disabled', node: <U.SplitButton label="x" variant="primary" disabled items={[{ id: 'a', label: 'A' }]} /> },
    { name: 'danger', node: <U.SplitButton label="x" variant="danger" items={[{ id: 'a', label: 'A' }]} /> },
  ],
  Spoiler: [
    { name: 'default', node: <U.Spoiler><div style={{ height: 200 }}>tall</div></U.Spoiler> },
    { name: 'custom labels', node: <U.Spoiler maxHeight={20} showLabel="more" hideLabel="less" className="x"><div>x</div></U.Spoiler> },
  ],
  StackedBarChart: [
    { name: 'default', node: <U.StackedBarChart series={series2x4} labels={labels4} /> },
    { name: 'normalised', node: <U.StackedBarChart series={series2x4} labels={labels4} normalized /> },
    { name: 'no labels', node: <U.StackedBarChart series={series2x4} /> },
  ],
  StackedProgress: [
    { name: 'default', node: <U.StackedProgress segments={[{ label: 'A', value: 30, color: '#006FFF' }, { label: 'B', value: 60, color: '#0f0' }]} /> },
    { name: 'no legend + total', node: <U.StackedProgress segments={[{ label: 'A', value: 50, color: '#006FFF' }]} total={200} ariaLabel="x" showLegend={false} /> },
  ],
  StarRating: [
    { name: 'default', node: <U.StarRating label="rate" /> },
    { name: 'controlled', node: <U.StarRating label="rate" value={3} onChange={noop} max={6} size="sm" className="x" /> },
    { name: 'readonly', node: <U.StarRating label="rate" value={4} readOnly /> },
    { name: 'defaultValue', node: <U.StarRating label="rate" defaultValue={2} /> },
  ],
  Stat: [
    { name: 'default', node: <U.Stat label="L" value={42} /> },
    { name: 'all options', node: <U.Stat label="L" value="42" unit="ms" sub="sub" delta="+1" deltaDir="up" span={2} color="#0f0" /> },
    { name: 'down', node: <U.Stat label="L" value="42" delta="-1" deltaDir="down" /> },
  ],
  StatusIndicator: [
    { name: 'default', node: <U.StatusIndicator color="#0f0" text="ok" /> },
    { name: 'with textColor', node: <U.StatusIndicator color="#0f0" text="ok" textColor="#fff" /> },
  ],
  StepChart: [
    { name: 'default', node: <U.StepChart series={series2x4} labels={labels4} /> },
  ],
  Stepper: [
    { name: 'default', node: <U.Stepper steps={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }, { id: 'c', label: 'C' }]} active="b" /> },
    { name: 'with className', node: <U.Stepper steps={[{ id: 'a', label: 'A' }]} active="a" className="x" /> },
  ],
  StreamGraph: [
    { name: 'default', node: <U.StreamGraph labels={labels4} series={[{ label: 'a', values: values4a }, { label: 'b', values: values4b, color: '#0f0' }]} /> },
  ],
  StripeChart: [
    { name: 'default', node: <U.StripeChart data={[{ label: 'A', value: 1 }, { label: 'B', value: 5 }]} /> },
  ],
  SunburstChart: [
    { name: 'default', node: <U.SunburstChart root={{ label: 'r', children: [{ label: 'a', value: 1 }, { label: 'b', value: 2, color: '#0f0', children: [{ label: 'b1', value: 3 }] }] }} /> },
  ],
  SwitchPortGrid: [
    { name: 'default', node: <U.SwitchPortGrid ports={Array.from({ length: 8 }, (_, i) => ({ index: i + 1, status: (['up', 'down', 'disabled', 'poe'] as const)[i % 4], speed: '1G' }))} columns={4} onPortClick={noop} /> },
  ],
  TabPanel: [
    { name: 'active', node: <U.TabPanel id="a" active="a">A</U.TabPanel> },
    { name: 'inactive', node: <U.TabPanel id="a" active="b">A</U.TabPanel> },
  ],
  Tabs: [
    { name: 'default', node: <U.Tabs items={[{ id: 'a', label: 'A' }, { id: 'b', label: 'B', badge: <U.Pill>1</U.Pill> }]} active="a" onChange={noop} /> },
    { name: 'with aria', node: <U.Tabs items={[{ id: 'a', label: 'A' }]} active="a" ariaLabel="t" /> },
  ],
  Tag: [
    { name: 'default', node: <U.Tag label="x" /> },
    { name: 'removable', node: <U.Tag label="x" onRemove={noop} className="y" /> },
  ],
  TagInput: [
    { name: 'default', node: <U.TagInput label="L" /> },
    { name: 'controlled', node: <U.TagInput label="L" value={['a']} onChange={noop} placeholder="p" /> },
    { name: 'disabled', node: <U.TagInput label="L" disabled defaultValue={['a', 'b']} className="x" /> },
  ],
  Textarea: [
    { name: 'default', node: <U.Textarea /> },
    { name: 'with rows', node: <U.Textarea rows={6} className="x" /> },
  ],
  ThresholdAreaChart: [
    { name: 'default', node: <U.ThresholdAreaChart values={values6a} labels={labels6} threshold={5} thresholdLabel="warn" /> },
  ],
  TimePicker: [
    { name: 'default', node: <U.TimePicker label="T" /> },
    { name: 'controlled', node: <U.TimePicker label="T" value="12:00" onChange={noop} /> },
    { name: 'disabled', node: <U.TimePicker label="T" disabled /> },
  ],
  TimeRange: [
    { name: 'default', node: <U.TimeRange /> },
    { name: 'controlled', node: <U.TimeRange value="24h" onChange={noop} /> },
  ],
  Timeline: [
    { name: 'default', node: <U.Timeline events={[{ id: '1', title: 'a', time: 'now' }, { id: '2', title: 'b', time: 'later', description: 'd', icon: 'x' }]} className="x" /> },
  ],
  Toaster: [
    { name: 'default', node: <U.Toaster /> },
  ],
  Toggle: [
    { name: 'off', node: <U.Toggle on={false} ariaLabel="t" /> },
    { name: 'on', node: <U.Toggle on onToggle={noop} ariaDescribedBy="d" /> },
  ],
  RowToggle: [
    { name: 'default', node: <U.RowToggle title="t" description="d" on={false} /> },
    { name: 'on', node: <U.RowToggle title="t" description="d" on onToggle={noop} /> },
  ],
  RowToggleList: [
    { name: 'default', node: <U.RowToggleList items={[{ title: 'A', description: 'a' }, { title: 'B', description: 'b' }]} state={{ A: true, B: false }} onToggle={noop} /> },
  ],
  ToggleGroup: [
    { name: 'default', node: <U.ToggleGroup options={[{ value: 'a', label: 'A' }, { value: 'b', label: 'B', disabled: true }]} value={['a']} onChange={noop} ariaLabel="t" /> },
    { name: 'sm', node: <U.ToggleGroup options={[{ value: 'a', label: 'A' }]} value={[]} onChange={noop} ariaLabel="t" size="sm" className="x" /> },
  ],
  Tooltip: [
    { name: 'default', node: <U.Tooltip label="t"><span>x</span></U.Tooltip> },
    { name: 'placements', node: <div>{(['top', 'bottom', 'left', 'right'] as const).map((p) => (<U.Tooltip key={p} label="t" placement={p} className="x"><span>{p}</span></U.Tooltip>))}</div> },
  ],
  TransferList: [
    { name: 'default', node: <U.TransferList /> },
    { name: 'with items', node: <U.TransferList sourceLabel="src" targetLabel="tgt" defaultSource={[{ id: '1', label: 'A', description: 'd' }]} defaultTarget={[{ id: '2', label: 'B' }]} onChange={noop} className="x" /> },
    { name: 'controlled', node: <U.TransferList source={[{ id: '1', label: 'A' }]} target={[{ id: '2', label: 'B' }]} /> },
  ],
  TreeMap: [
    { name: 'default', node: <U.TreeMap nodes={[{ label: 'A', value: 5 }, { label: 'B', value: 10, color: '#0f0' }]} /> },
  ],
  TreeView: [
    { name: 'default', node: <U.TreeView nodes={[{ id: 'a', label: 'A', children: [{ id: 'b', label: 'B', icon: 'x', meta: 'm' }] }, { id: 'c', label: 'C' }]} defaultExpanded={['a']} selected="b" onSelect={noop} label="L" /> },
    { name: 'flat', node: <U.TreeView nodes={[{ id: 'a', label: 'A' }]} className="x" /> },
  ],
  UptimeTimeline: [
    { name: 'default', node: <U.UptimeTimeline series={[{ label: 'A', segments: [{ from: 0, to: 5, status: 'up' }, { from: 5, to: 8, status: 'degraded' }, { from: 8, to: 10, status: 'down' }] }]} xLabels={['0', '5', '10']} /> },
  ],
  VennDiagram: [
    { name: 'two sets', node: <U.VennDiagram sets={[{ label: 'A', size: 10 }, { label: 'B', size: 8 }]} intersections={[{ sets: ['A', 'B'], size: 3 }]} /> },
    { name: 'three sets', node: <U.VennDiagram sets={[{ label: 'A', size: 10, color: '#0f0' }, { label: 'B', size: 8 }, { label: 'C', size: 6 }]} intersections={[{ sets: ['A', 'B'], size: 2 }, { sets: ['A', 'B', 'C'], size: 1 }]} /> },
    { name: 'one set', node: <U.VennDiagram sets={[{ label: 'A', size: 10 }]} /> },
  ],
  ViolinPlot: [
    { name: 'default', node: <U.ViolinPlot series={[{ label: 'A', values: [1, 2, 2, 3, 4, 5, 5, 6] }, { label: 'B', values: [2, 3, 3, 4, 5], color: '#0f0' }]} /> },
    { name: 'with yRange', node: <U.ViolinPlot series={[{ label: 'A', values: [1, 2, 3] }]} yRange={[0, 10]} /> },
  ],
  VirtualList: [
    { name: 'default', node: <U.VirtualList items={Array.from({ length: 40 }, (_, i) => i)} itemHeight={20} height={100} renderItem={(n) => <span>{n}</span>} label="L" /> },
    { name: 'overscan', node: <U.VirtualList items={[1, 2]} itemHeight={20} height={50} overscan={5} className="x" renderItem={(n) => <span>{n}</span>} /> },
  ],
  WaffleChart: [
    { name: 'default', node: <U.WaffleChart segments={[{ label: 'A', value: 30 }, { label: 'B', value: 20, color: '#0f0' }]} /> },
    { name: 'with total', node: <U.WaffleChart segments={[{ label: 'A', value: 30 }]} total={100} cols={5} rows={5} gap={1} /> },
  ],
  WaterfallChart: [
    { name: 'default', node: <U.WaterfallChart bars={[{ label: 'a', value: 10, kind: 'start' }, { label: 'b', value: 5, kind: 'pos' }, { label: 'c', value: -3, kind: 'neg' }, { label: 'd', value: 12, kind: 'end' }]} /> },
    { name: 'all positive', node: <U.WaterfallChart bars={[{ label: 'a', value: 10, kind: 'start' }, { label: 'b', value: 1, kind: 'pos' }, { label: 'c', value: 11, kind: 'end' }]} /> },
  ],
  WordCloud: [
    { name: 'default', node: <U.WordCloud items={Array.from({ length: 25 }, (_, i) => ({ word: `w${i}`, weight: 1 + (i % 5) }))} /> },
    { name: 'colored', node: <U.WordCloud items={[{ word: 'a', weight: 1, color: '#0f0' }, { word: 'b', weight: 5 }]} /> },
  ],
};

// Icons are simple SVG functions; render each at default + with custom size + className.
const ICON_NAMES = [
  'SearchIcon', 'PlusIcon', 'DownloadIcon', 'CaretIcon', 'CloseIcon', 'BellIcon',
  'HelpIcon', 'UpdatesIcon', 'DashboardIcon', 'DevicesIcon', 'ClientsIcon',
  'TopologyIcon', 'AlarmIcon', 'LogsIcon', 'WifiIcon', 'PortsIcon', 'VpnIcon',
  'SecurityIcon', 'SettingsIcon', 'AirviewIcon', 'InfraIcon', 'IntegrationsIcon',
] as const;
for (const name of ICON_NAMES) {
  const Icon = (U as unknown as Record<string, (p: { size?: number; className?: string }) => React.ReactElement>)[name];
  FIXTURES[name] = [
    { name: 'default', node: <Icon /> },
    { name: 'sized', node: <Icon size={32} className="x" /> },
  ];
}

export const ALL_COMPONENTS = Object.keys(FIXTURES).sort();

// Smaller helper that lets the auto-render test wrap stateful interactions.
export function StatefulHarness({ children }: { children: (s: any, set: any) => React.ReactNode }) {
  const [s, set] = useState({});
  return <>{children(s, set)}</>;
}
