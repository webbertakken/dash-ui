<svelte:options customElement={{ tag: "uni-combobox", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Combobox.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    options = [],
    value = undefined,
    label = undefined,
    placeholder = 'Search…',
    id = undefined,
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {options} {value} {label} {placeholder} {id} {disabled} class={className}>
  <slot />
</Original>
