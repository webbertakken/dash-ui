import { useState, useMemo } from 'react';
import { Button, SearchBox, Tabs, DownloadIcon, TimeRange, DateRangePicker, Card, PunchCard, LogViewer, FilterBuilder } from '@dash-ui/react';
import type { TimeRangeId, DateRange, LogEntry, FilterField, FilterRule } from '@dash-ui/react';
import { LOG_ROWS } from '../data.js';

const LOG_VOLUME: number[][] = [
  [12,8,5,3,2,4,18,42,67,85,92,88,74,68,71,76,83,88,79,65,52,38,24,16],
  [10,6,4,2,1,3,15,38,64,82,89,85,71,65,68,73,80,85,76,62,49,35,21,13],
  [14,9,6,4,2,5,20,45,70,88,95,91,77,71,74,79,86,91,82,68,55,41,27,18],
  [11,7,5,3,1,4,17,41,66,84,91,87,73,67,70,75,82,87,78,64,51,37,23,15],
  [16,11,7,5,3,6,22,48,73,91,98,94,80,74,77,82,89,94,85,71,58,44,30,20],
  [38,28,20,14,9,12,24,36,48,55,52,49,45,44,46,50,54,58,52,44,36,30,26,35],
  [28,20,14,9,6,8,17,26,35,41,39,36,33,32,34,37,40,43,38,32,26,22,20,26],
];

const ALL_ENTRIES: LogEntry[] = LOG_ROWS.map(([lvl, cat, ts, evt, subj, det], i) => ({
  id: String(i),
  level: lvl === 'danger' ? 'error' : (lvl as LogEntry['level']),
  category: cat,
  timestamp: ts,
  event: evt,
  subject: subj,
  detail: det,
}));

const LOG_FILTER_FIELDS: FilterField[] = [
  { key: 'level', label: 'Level', type: 'select', options: ['info', 'warn', 'error'] },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'event', label: 'Event', type: 'text' },
  { key: 'subject', label: 'Subject', type: 'text' },
];

function matchesRule(entry: LogEntry, rule: FilterRule): boolean {
  const raw = (entry as unknown as Record<string, unknown>)[rule.field];
  const val = String(raw ?? '').toLowerCase();
  const q = rule.value.toLowerCase();
  if (!q) return true;
  switch (rule.op) {
    case 'is':
    case 'equals':      return val === q;
    case 'is not':
    case 'not equals':  return val !== q;
    case 'contains':    return val.includes(q);
    case 'not contains': return !val.includes(q);
    case 'starts with': return val.startsWith(q);
    default:            return true;
  }
}

export function Logs() {
  const [tab, setTab] = useState('all');
  const [timeRange, setTimeRange] = useState<TimeRangeId>('1h');
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });
  const [filterRules, setFilterRules] = useState<FilterRule[]>([]);
  const [conjunction, setConjunction] = useState<'and' | 'or'>('and');

  const entries = useMemo(() => {
    if (filterRules.length === 0) return ALL_ENTRIES;
    const active = filterRules.filter((r) => r.value !== '');
    if (active.length === 0) return ALL_ENTRIES;
    return ALL_ENTRIES.filter((e) =>
      conjunction === 'and'
        ? active.every((r) => matchesRule(e, r))
        : active.some((r) => matchesRule(e, r))
    );
  }, [filterRules, conjunction]);

  return (
    <>
      <div className="ph-bar">
        <div className="ph-title">Logs</div>
        <div className="ph-actions">
          <SearchBox placeholder="Search logs…" />
          <TimeRange value={timeRange} onChange={setTimeRange} />
          <DateRangePicker value={customRange} onChange={setCustomRange} placeholder="Custom range" />
          <Button iconOnly title="Download">
            <DownloadIcon />
          </Button>
        </div>
      </div>
      <Tabs
        active={tab}
        onChange={setTab}
        items={[
          { id: 'all', label: 'All', badge: '2,418' },
          { id: 'network', label: 'Network', badge: '1,842' },
          { id: 'system', label: 'System', badge: 214 },
          { id: 'security', label: 'Security', badge: 187 },
          { id: 'vpn', label: 'VPN', badge: 62 },
          { id: 'access', label: 'Access', badge: 94 },
          { id: 'protect', label: 'Protect', badge: 19 },
        ]}
      />
      <div className="grid">
        <Card span={12}>
          <h3>Log volume <span className="unit">Events by day of week &times; hour</span></h3>
          <PunchCard
            data={LOG_VOLUME}
            height={160}
            ariaLabel="Log event volume by day of week and hour of day; highest activity on weekday business hours 09:00-17:00"
          />
        </Card>
        <Card span={12}>
          <h3>Live log stream</h3>
          <FilterBuilder
            fields={LOG_FILTER_FIELDS}
            value={filterRules}
            conjunction={conjunction}
            onChange={(rules, conj) => { setFilterRules(rules); setConjunction(conj); }}
            aria-label="Log filters"
          />
          <LogViewer
            entries={entries}
            height={380}
            ariaLabel="Live log stream"
          />
        </Card>
      </div>
    </>
  );
}
