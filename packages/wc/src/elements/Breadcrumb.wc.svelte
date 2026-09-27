<svelte:options customElement={{ tag: "uni-breadcrumb", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Breadcrumb.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    items = [],
    class: className = ''
  } = $props();
</script>

<Original {items} class={className}>
  <slot />
</Original>
