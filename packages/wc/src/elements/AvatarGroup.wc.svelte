<svelte:options customElement="uni-avatar-group" />
<script>
  import Original from '@w5-ui/svelte/components/AvatarGroup.svelte';
  let {
    avatars = [],
    max = 5,
    size = 'md',
    ariaLabel = 'Avatar group'
  } = $props();
</script>

<Original {avatars} {max} {size} {ariaLabel}>
  <slot />
</Original>
