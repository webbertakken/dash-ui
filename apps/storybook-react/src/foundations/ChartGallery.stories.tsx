// A visual gallery of every chart in @w5-ui/react, grouped by the same
// categories used in Foundations / Charts. Each tile renders one fixture
// inside a `<Card>` so userland can browse the lot in one scroll and pick
// the shape that fits the question.

import type { Meta, StoryObj } from '@storybook/react'
import { Caption, Card, CardTitle, Grid } from '@w5-ui/react'
import { FIXTURES } from '../../../../packages/react/test-fixtures/fixtures.js'

const meta: Meta = {
  title: 'Foundations/Chart gallery',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'One tile per chart, grouped by the categories in Foundations / Charts. Use this page as a visual picker — find the shape that answers your question, then jump into the matching component story for props and variants.',
      },
    },
  },
}
export default meta

type Story = StoryObj

const HERO = ['Stat', 'CountUp', 'Gauge', 'HealthBar'] as const

const COMPARISON = [
  'BarChart',
  'StackedBarChart',
  'MirroredBarChart',
  'LollipopChart',
  'DotPlot',
  'BulletChart',
  'BumpChart',
  'SlopeChart',
  'DumbbellChart',
  'ParetoChart',
  'MarimekkoChart',
  'WaffleChart',
  'RadialBarChart',
  'NightingaleChart',
  'RadarChart',
] as const

const TIME_SERIES = [
  'LineChart',
  'AreaChart',
  'StepChart',
  'ErrorBandChart',
  'ThresholdAreaChart',
  'AnnotatedTimeSeries',
  'StreamGraph',
  'HorizonChart',
  'CandlestickChart',
  'GanttChart',
  'UptimeTimeline',
  'DualAxisChart',
  'Sparkline',
  'SparklineMatrix',
] as const

const DISTRIBUTION = [
  'Histogram',
  'BoxPlot',
  'ViolinPlot',
  'RidgelinePlot',
  'BeeswarmChart',
  'StripeChart',
  'ScatterPlot',
  'BubbleChart',
  'QuadrantChart',
  'HexbinChart',
  'ContourPlot',
  'CumulativeDistribution',
  'ParallelCoordinates',
  'CorrelationMatrix',
  'MatrixChart',
  'HeatMap',
  'PolarHeatmap',
  'CalendarHeatmap',
  'PunchCard',
  'WordCloud',
] as const

const HIERARCHY_FLOW = [
  'Donut',
  'PieChart',
  'TreeMap',
  'SunburstChart',
  'IcicleChart',
  'CirclePacking',
  'Dendrogram',
  'ChordDiagram',
  'SankeyDiagram',
  'FunnelChart',
  'WaterfallChart',
  'ArcDiagram',
  'ForceGraph',
  'VennDiagram',
  'FlameGraph',
] as const

function Tile({ name }: { name: string }) {
  const v = FIXTURES[name]?.[0]
  if (!v) return null
  return (
    <Card span={4}>
      <CardTitle>{name}</CardTitle>
      <div className="chart-gallery-frame">{v.node}</div>
    </Card>
  )
}

function SectionHeading({ title, blurb }: { title: string; blurb: string }) {
  return (
    <header className="chart-gallery-section">
      <h2 className="dash-ui-eyebrow">{title}</h2>
      <Caption>{blurb}</Caption>
    </header>
  )
}

export const Gallery: Story = {
  name: 'Gallery',
  render: () => (
    <main className="content chart-gallery">
      <style>{`
        .chart-gallery {
          min-height: 100vh;
        }
        .chart-gallery-section {
          grid-column: 1 / -1;
          margin-top: var(--space-2);
        }
        .chart-gallery-section h2 {
          margin: 0;
        }
        .chart-gallery-section .dash-ui-caption {
          display: block;
          margin-top: var(--space-1);
        }
        .chart-gallery-frame {
          height: 140px;
          overflow: hidden;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }
        .chart-gallery-frame > * {
          flex: 1;
          width: 100%;
          max-height: 140px;
        }
      `}</style>
      <Grid>
        <SectionHeading
          title="Hero / KPI"
          blurb="A single number you want a glance to land on. Each of these is already a Card."
        />
        {HERO.map((n) => (
          <Tile key={n} name={n} />
        ))}

        <SectionHeading
          title="Comparison"
          blurb="How big is each item compared to the others, right now?"
        />
        {COMPARISON.map((n) => (
          <Tile key={n} name={n} />
        ))}

        <SectionHeading title="Time-series" blurb="What happened over time?" />
        {TIME_SERIES.map((n) => (
          <Tile key={n} name={n} />
        ))}

        <SectionHeading
          title="Distribution"
          blurb="How is the data spread? Where do outliers sit?"
        />
        {DISTRIBUTION.map((n) => (
          <Tile key={n} name={n} />
        ))}

        <SectionHeading
          title="Hierarchy & flow"
          blurb="How does the whole break down? How does mass move through stages?"
        />
        {HIERARCHY_FLOW.map((n) => (
          <Tile key={n} name={n} />
        ))}
      </Grid>
    </main>
  ),
}
