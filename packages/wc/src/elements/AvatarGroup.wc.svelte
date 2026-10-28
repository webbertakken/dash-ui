<svelte:options customElement={{ tag: "uni-avatar-group", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/AvatarGroup.svelte';
  import { withShadowStyles } from '../styled.ts';
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
