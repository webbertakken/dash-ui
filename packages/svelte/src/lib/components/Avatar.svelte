<script module lang="ts">
  export type AvatarSize = 'sm' | 'md' | 'lg';
  export type AvatarStatus = 'online' | 'offline' | 'away';
</script>

<script lang="ts">
  interface Props {
    initials?: string;
    src?: string | undefined;
    alt?: string | undefined;
    size?: AvatarSize;
    status?: AvatarStatus | undefined;
    /** Extra Tailwind utilities to compose with the avatar root. */
    class?: string;
    style?: string;
  }

  let {
    initials = '?',
    src = undefined,
    alt = undefined,
    size = 'md',
    status = undefined,
    class: className = '',
    style = '',
  }: Props = $props();

  // Pre-compose class strings so Tailwind's static scanner picks them up.
  const SIZE: Record<AvatarSize, string> = {
    sm: 'h-6 w-6 text-[9px]',
    md: 'h-8 w-8 text-[12px]',
    lg: 'h-10 w-10 text-[16px]',
  };
  const STATUS_BG: Record<AvatarStatus, string> = {
    online: 'bg-status-success',
    offline: 'bg-status-neutral',
    away: 'bg-status-warning',
  };

  // Hardcoded neutral chrome to match dashboard.css's literal #4a4b53 / #fff,
  // independent of motif. See the comment in Topbar.svelte for rationale.
  let rootClass = $derived(
    `relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-neutral-06 font-semibold text-white ${SIZE[size]} ${className}`,
  );
</script>

<span class={rootClass} role="img" aria-label={alt ?? (src ? '' : initials)} {style}>
  {#if src}
    <img {src} alt="" class="block h-full w-full object-cover" />
  {:else}
    {initials}
  {/if}
  {#if status}
    <span
      class="absolute bottom-0 right-0 h-2 w-2 rounded-full border-[1.5px] border-neutral-10 {STATUS_BG[status]}"
      aria-hidden="true"
    ></span>
  {/if}
</span>
