<svelte:options customElement={{ tag: "uni-input", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Input.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    value = '',
    placeholder = '',
    type = 'text',
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {value} {placeholder} {type} class={className} {style}>
  <slot />
</Original>
