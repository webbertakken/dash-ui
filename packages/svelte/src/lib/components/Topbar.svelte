<script module lang="ts">
  import type { AppLogoKey } from '@w5-ui/assets';

  /** Logo identifier. Either a built-in `AppLogoKey` (resolved via
   *  `@w5-ui/assets`'s `appLogos` map) or a raw URL string — use the
   *  latter when the consuming app wants to brand an entry with its
   *  own image without having to upstream a new asset into the
   *  design system. */
  export type AppLogo = AppLogoKey | (string & {})
  export interface AppDef { id: string; label: string; logo: AppLogo }
  export type TopbarStatus = 'ok' | 'warn' | 'danger' | 'neutral';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { appLogos, type AppLogoKey } from '@w5-ui/assets';

  /** Resolve an `AppLogo` to an `<img src>` URL. Known keys go
   *  through the bundled `appLogos` map; anything else is treated as
   *  a URL the consumer supplied directly. */
  function resolveLogo(logo: string): string {
    if (logo in appLogos) return appLogos[logo as AppLogoKey]
    return logo
  }
  import IconButton from './IconButton.svelte';
  import Avatar from './Avatar.svelte';
  import CaretIcon from '../icons/CaretIcon.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import UpdatesIcon from '../icons/UpdatesIcon.svelte';
  import BellIcon from '../icons/BellIcon.svelte';
  import HelpIcon from '../icons/HelpIcon.svelte';

  export const DEFAULT_APPS: AppDef[] = [
    { id: 'system', label: 'System', logo: 'system' },
    { id: 'instances', label: 'Instances', logo: 'instances' },
    { id: 'agents', label: 'Agents', logo: 'agents' },
  ];

  interface Props {
    siteName: string;
    activeApp: string;
    apps?: AppDef[];
    initials?: string;
    notificationCount?: number;
    /** Health colour of the site-name status ring. Defaults to 'ok' (green). */
    status?: TopbarStatus;
    /** Optional URL of a square logo (or w5-ui `AppLogoKey`) to render in
     *  place of the status dot, next to `siteName`. The status colour
     *  becomes a thin ring AROUND the logo so the health signal is
     *  preserved without claiming a dedicated dot. Falls back to the
     *  classic status-dot layout when undefined. */
    siteLogo?: AppLogo;
    /** When false, the site label renders as a static element instead of a
     * site-switcher dropdown trigger. Use for single-site dashboards. */
    siteSwitchable?: boolean;
    /** Custom right-side actions snippet. When provided, replaces the default
     * Search/Updates/Notifications/Help/Avatar block in full. Use to slot in
     * app-specific controls (theme toggle, status pill, etc.). */
    actions?: Snippet;
    onappchange?: (payload: string) => void;
  }

  let {
    siteName,
    activeApp = $bindable(),
    apps = DEFAULT_APPS,
    initials = 'MS',
    notificationCount = 1,
    status = 'ok',
    siteLogo,
    siteSwitchable = true,
    actions,
    onappchange,
  }: Props = $props();

  // Status-ring colour mapping. We pre-compose the Tailwind class strings here
  // (rather than inline) so the consumer's Tailwind compiler picks them up
  // unambiguously via static-string scanning.
  // Ring background opacities chosen to match dashboard.css exactly
  // (`.status-ring { background: rgba(<colour>, 0.18) }`).
  const RING_BG: Record<TopbarStatus, string> = {
    ok: 'bg-status-success/18',
    warn: 'bg-status-warning/18',
    danger: 'bg-status-danger/18',
    neutral: 'bg-status-neutral/18',
  };
  const RING_DOT: Record<TopbarStatus, string> = {
    ok: 'bg-status-success',
    warn: 'bg-status-warning',
    danger: 'bg-status-danger',
    neutral: 'bg-status-neutral',
  };
  /** Solid-colour ring drawn AROUND the site logo (when `siteLogo` is
   *  set) so the health signal stays visible without the dot+halo
   *  treatment. Pre-composed for the Tailwind static scanner. */
  const LOGO_RING: Record<TopbarStatus, string> = {
    ok: 'ring-status-success',
    warn: 'ring-status-warning',
    danger: 'ring-status-danger',
    neutral: 'ring-status-neutral',
  };

  let ringWrapClass = $derived(
    `inline-flex h-[18px] w-[18px] items-center justify-center rounded-full ${RING_BG[status]}`,
  );
  let ringDotClass = $derived(`h-2 w-2 rounded-full ${RING_DOT[status]}`);
  let logoRingClass = $derived(
    `inline-flex h-6 w-6 items-center justify-center overflow-hidden rounded-full ring-2 ring-inset ${LOGO_RING[status]}`,
  );

  // Status-coloured glow drawn behind the site logo. Replaces the old
  // "N down" headline pill as the at-a-glance health signal: green when
  // healthy, amber when degraded, red when something is down. Rendered
  // as a blurred radial puddle behind the logo so the colour bleeds
  // softly past the rim rather than reading as a hard second ring.
  // Neutral (no data yet) gets no glow so a cold-start chrome stays calm.
  const GLOW_TOKEN: Record<TopbarStatus, string | null> = {
    ok: '--status-success',
    warn: '--status-warning',
    danger: '--status-danger',
    neutral: null,
  };
  let logoGlowStyle = $derived.by(() => {
    const token = GLOW_TOKEN[status];
    if (token === null) return 'opacity: 0;';
    const colour = `var(${token})`;
    return (
      `background: radial-gradient(closest-side, ${colour}, transparent);` +
      ' opacity: 0.85; filter: blur(5px);'
    );
  });
</script>

<!--
  Motif-aware chrome: surfaces resolve via `var(--bg-page)`, text via
  `var(--text-1)`, borders via `var(--border-1)`. In dark motif the
  values still resolve to the original `#0a0a0b` / `#ffffff` /
  rgba(255,255,255,0.06) so the baseline look is unchanged. Light motif
  flips them to `#ffffff` / `#0a0a0b` / `#ececee`.
-->
<header
  class="flex h-12 shrink-0 items-center gap-0 bg-bg-page px-2"
>
  {#if siteSwitchable}
    <button
      type="button"
      class="flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-row-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
      aria-label="Switch site: {siteName}"
      aria-haspopup="menu"
      title={`${siteName} — status: ${status}`}
    >
      {#if siteLogo !== undefined}
        <span class="relative inline-flex h-6 w-6 items-center justify-center">
          <span
            data-testid="site-logo-glow"
            aria-hidden="true"
            class="pointer-events-none absolute -inset-1.5 rounded-full transition-opacity duration-300"
            style={logoGlowStyle}
          ></span>
          <span class={`relative ${logoRingClass}`} aria-hidden="true">
            <img src={resolveLogo(siteLogo)} alt="" width="24" height="24" class="h-full w-full object-cover" />
          </span>
        </span>
      {:else}
        <span class={ringWrapClass}><span class={ringDotClass}></span></span>
      {/if}
      <span class="text-13 font-medium text-text-1" aria-hidden="true">{siteName}</span>
      <CaretIcon class="h-3.5 w-3.5 text-text-3" />
    </button>
  {:else}
    <div
      class="flex items-center gap-2 px-2.5 py-1.5"
      role="presentation"
      title={`${siteName} — status: ${status}`}
    >
      {#if siteLogo !== undefined}
        <span class="relative inline-flex h-6 w-6 items-center justify-center">
          <span
            data-testid="site-logo-glow"
            aria-hidden="true"
            class="pointer-events-none absolute -inset-1.5 rounded-full transition-opacity duration-300"
            style={logoGlowStyle}
          ></span>
          <span class={`relative ${logoRingClass}`} aria-hidden="true">
            <img src={resolveLogo(siteLogo)} alt="" width="24" height="24" class="h-full w-full object-cover" />
          </span>
        </span>
      {:else}
        <span class={ringWrapClass}><span class={ringDotClass}></span></span>
      {/if}
      <span class="text-13 font-medium text-text-1">{siteName}</span>
    </div>
  {/if}

  <nav class="ml-3.5 flex h-12 items-center gap-0.5" aria-label="Apps">
    {#each apps as a (a.id)}
      <button
        type="button"
        class="flex h-12 w-16 cursor-pointer flex-col items-center justify-center py-1.5 transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05
          {a.id === activeApp
            ? 'bg-bg-1 text-text-1'
            : 'bg-transparent text-text-3 hover:text-text-1'}"
        aria-current={a.id === activeApp ? 'page' : undefined}
        onclick={() => { activeApp = a.id; onappchange?.(a.id); }}
      >
        <img
          src={resolveLogo(a.logo)}
          alt=""
          width="24"
          height="24"
          class="transition-[opacity,filter] duration-150
            {a.id === activeApp
              ? 'opacity-100 dark:brightness-[1.6]'
              : 'opacity-65 hover:opacity-90 dark:hover:brightness-[1.4]'}"
        />
        <span class="mt-0.5 text-[10px] font-medium leading-none">{a.label}</span>
      </button>
    {/each}
  </nav>

  <div class="flex-1"></div>

  <div class="flex items-center gap-1 pr-2">
    {#if actions}
      {@render actions()}
    {:else}
      <IconButton aria-label="Search" title="Search"><SearchIcon /></IconButton>
      <IconButton aria-label="Updates" title="Updates"><UpdatesIcon /></IconButton>
      <IconButton
        aria-label={notificationCount > 0
          ? `Notifications, ${notificationCount} new`
          : 'Notifications'}
        title="Notifications"
        class="relative"
      >
        <BellIcon />
        {#if notificationCount > 0}
          <span
            aria-hidden="true"
            class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border-[1.5px] border-bg-page bg-status-danger"
          ></span>
        {/if}
      </IconButton>
      <IconButton aria-label="Help" title="Help"><HelpIcon /></IconButton>
      <Avatar initials={initials} size="sm" alt="Account, {initials}" class="ml-1" />
    {/if}
  </div>
</header>
