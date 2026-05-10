<script context="module" lang="ts">
  export type AvatarSize = 'sm' | 'md' | 'lg';
  export type AvatarStatus = 'online' | 'offline' | 'away';
</script>

<script lang="ts">
  export let initials: string = '?';
  export let src: string | undefined = undefined;
  export let alt: string | undefined = undefined;
  export let size: AvatarSize = 'md';
  export let status: AvatarStatus | undefined = undefined;
  export let className: string = '';
  export let style: string = '';
</script>

<span
  class="avatar avatar-{size}{className ? ` ${className}` : ''}"
  role="img"
  aria-label={alt ?? (src ? '' : initials)}
  {style}
>
  {#if src}
    <img {src} alt="" />
  {:else}
    {initials}
  {/if}
  {#if status}
    <span class="avatar-status avatar-status-{status}" aria-hidden="true"></span>
  {/if}
</span>
