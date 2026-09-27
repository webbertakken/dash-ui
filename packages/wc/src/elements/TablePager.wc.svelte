<svelte:options customElement={{ tag: "uni-table-pager", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TablePager.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
