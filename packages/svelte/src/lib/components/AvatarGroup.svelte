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
    ariaLabel = 'Avatar group'
  }: Props = $props();

  let visible = $derived(avatars.slice(0, max));
  let overflow = $derived(avatars.length - visible.length);
</script>

<span class="avatar-group" role="list" aria-label={ariaLabel}>
  {#each visible as av, i (i)}
    <span role="listitem" class="avatar-group-item">
      <Avatar initials={av.initials} src={av.src} alt={av.alt} {size} />
    </span>
  {/each}
  {#if overflow > 0}
    <span
      role="listitem"
      class="avatar avatar-{size} avatar-overflow"
      aria-label="{overflow} more"
    >+{overflow}</span>
  {/if}
</span>
