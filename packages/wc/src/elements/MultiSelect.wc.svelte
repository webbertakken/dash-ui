<svelte:options customElement={{ tag: "uni-multi-select", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/MultiSelect.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    options = [],
    value = [],
    label = undefined,
    placeholder = 'Select…',
    id = undefined,
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {options} {value} {label} {placeholder} {id} {disabled} class={className}>
  <slot />
</Original>
