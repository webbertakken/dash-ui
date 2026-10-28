<svelte:options customElement={{ tag: "uni-duration-input", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/DurationInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = 0,
    maxHours = 99,
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {maxHours} {disabled} class={className}>
  <slot />
</Original>
