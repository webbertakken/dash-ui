<script context="module" lang="ts">
  export interface AvatarItem {
    initials?: string;
    src?: string;
    alt?: string;
  }
</script>

<script lang="ts">
  import Avatar from './Avatar.svelte';
  import type { AvatarSize } from './Avatar.svelte';

  export let avatars: AvatarItem[] = [];
  export let max: number = 5;
  export let size: AvatarSize = 'md';
  export let ariaLabel: string = 'Avatar group';

  $: visible = avatars.slice(0, max);
  $: overflow = avatars.length - visible.length;
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
