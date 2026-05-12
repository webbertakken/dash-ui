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
    className?: string;
    style?: string;
  }

  let {
    initials = '?',
    src = undefined,
    alt = undefined,
    size = 'md',
    status = undefined,
    className = '',
    style = ''
  }: Props = $props();
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
