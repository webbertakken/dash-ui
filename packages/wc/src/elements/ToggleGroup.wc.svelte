<svelte:options customElement={{ tag: "uni-toggle-group", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/ToggleGroup.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    options = [],
    value = [],
    ariaLabel = '',
    size = 'md',
    class: klass = ''
  } = $props();
</script>

<Original {options} {value} {ariaLabel} {size} class={klass}>
  <slot />
</Original>
