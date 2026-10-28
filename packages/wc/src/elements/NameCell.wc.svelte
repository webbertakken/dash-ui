<svelte:options customElement={{ tag: "uni-name-cell", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/NameCell.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = '',
    thumbClass = ''
  } = $props();
</script>

<Original class={className} {thumbClass}>
  <slot />
</Original>
