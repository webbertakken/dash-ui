<script module lang="ts">
  export interface AvatarItem {
    initials?: string;
    src?: string;
    alt?: string;
  }
</script>

<script lang="ts">
  import Avatar from './Avatar.svelte';
  import type { AvatarSize } from './Avatar.svelte';

  interface Props {
    avatars?: AvatarItem[];
    max?: number;
    size?: AvatarSize;
    ariaLabel?: string;
  }

  let {
    avatars = [],
    max = 5,
    size = 'md',
    ariaLabel = 'Avatar group',
  }: Props = $props();

  let visible = $derived(avatars.slice(0, max));
  let overflow = $derived(avatars.length - visible.length);

  const SIZE: Record<AvatarSize, string> = {
    sm: 'h-6 w-6 text-[9px]',
    md: 'h-8 w-8 text-[12px]',
    lg: 'h-10 w-10 text-[16px]',
  };
  // Group avatars overlap by 8px to the left and add a 2px bg-coloured ring
  // to read clearly when stacked. Ring uses the chrome's literal
  // #0a0a0b (neutral-10) to match dashboard.css.
  const OVERLAP =
    '[&_>*:not(:last-child)>span]:-ml-2 [&_>*>span]:border-2 [&_>*>span]:border-bg-page';
</script>

<span
  class="inline-flex flex-row-reverse items-center {OVERLAP}"
  role="list"
  aria-label={ariaLabel}
>
  {#each visible as av, i (i)}
    <span role="listitem" class="contents">
      <Avatar initials={av.initials} src={av.src} alt={av.alt} {size} />
    </span>
  {/each}
  {#if overflow > 0}
    <span
      role="listitem"
      class="relative inline-flex shrink-0 select-none items-center justify-center overflow-visible rounded-full border-2 border-bg-page bg-neutral-07 font-bold text-text-3 {SIZE[
        size
      ]}"
      aria-label="{overflow} more"
    >+{overflow}</span>
  {/if}
</span>
