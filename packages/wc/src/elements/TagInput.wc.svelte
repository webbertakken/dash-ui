<svelte:options customElement={{ tag: "uni-tag-input", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/TagInput.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    label = undefined,
    value = [],
    placeholder = 'Type and press Enter…',
    disabled = false,
    class: klass = ''
  } = $props();
</script>

<Original {label} {value} {placeholder} {disabled} class={klass}>
  <slot />
</Original>
