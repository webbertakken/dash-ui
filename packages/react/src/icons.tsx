import type { SVGProps } from 'react';

export type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (props: IconProps): SVGProps<SVGSVGElement> => ({
  width: props.size ?? 16,
  height: props.size ?? 16,
  fill: 'none',
  'aria-hidden': true,
  focusable: false,
  ...props,
});

export const SearchIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg viewBox="0 0 12 12" {...base({ size: 12, ...p })}>
    <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg viewBox="0 0 14 14" {...base({ size: 14, ...p })}>
    <path d="M7 1.5v7m0 0L4.5 6m2.5 2.5L9.5 6M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretIcon = (p: IconProps) => (
  <svg viewBox="0 0 20 20" {...base({ size: 14, ...p })}>
    <path d="M5.5 8 10 12.5 14.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = (p: IconProps) => (
  <svg viewBox="0 0 14 14" {...base({ size: 14, ...p })}>
    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BellIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="M4 6.5a4 4 0 0 1 8 0V9l1.2 2H2.8L4 9V6.5ZM6.5 12.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HelpIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.4 6.2c.2-1 1-1.5 1.9-1.5 1.1 0 1.9.7 1.9 1.7s-.6 1.4-1.4 1.8c-.6.3-1 .6-1 1.2v.3M8 11.6h0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const UpdatesIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="M8 2v6m0 0L5 5.5M8 8l3-2.5M3 12h10M3 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DashboardIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const DevicesIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="2.5" y="3.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2.5" y1="6.5" x2="13.5" y2="6.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const ClientsIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="8" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 13c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const TopologyIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="8" cy="3.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="3.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 5.1v2.4M6.7 8.5l-2.4 2.6M9.3 8.5l2.4 2.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AlarmIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="m8 2 6 11H2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 7v3M8 11.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const LogsIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="3" y="2.5" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5.5" y1="6" x2="10.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="5.5" y1="9" x2="10.5" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const WifiIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="M2 6c3-3 9-3 12 0M4 9c2.5-2.5 5.5-2.5 8 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const PortsIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="2" y="5" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <line x1="5" y1="11" x2="5" y2="13" stroke="currentColor" strokeWidth="1.5" />
    <line x1="11" y1="11" x2="11" y2="13" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const VpnIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="3" y="6" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const SecurityIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="m8 1.5 5 2v4.5c0 3-2 5.5-5 6.5-3-1-5-3.5-5-6.5V3.5l5-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 1.5v1.6M8 12.9v1.6M14.5 8h-1.6M3.1 8H1.5m11-4.6-1.1 1.1M4.6 11.4l-1.1 1.1m0-9 1.1 1.1m6.7 6.7 1.1 1.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const AirviewIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <path d="M2 11s1.5-1 6-1 6 1 6 1M2 8s1.5-1.5 6-1.5 6 1.5 6 1.5M2 5s1.5-2 6-2 6 2 6 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const InfraIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <rect x="2" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="2" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2" y="10" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
    <rect x="10" y="10" width="4" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const IntegrationsIcon = (p: IconProps) => (
  <svg viewBox="0 0 16 16" {...base(p)}>
    <circle cx="5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="11" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
