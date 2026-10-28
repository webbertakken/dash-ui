<svelte:options customElement={{ tag: "uni-page-header", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/PageHeader.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    title = undefined,
    sticky = true,
    class: className = ''
  } = $props();
</script>

<Original {title} {sticky} class={className}>
  <slot />
</Original>
