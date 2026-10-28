<svelte:options customElement={{ tag: "uni-form-actions", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/FormActions.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
