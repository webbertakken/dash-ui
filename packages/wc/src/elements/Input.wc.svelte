<svelte:options customElement="uni-input" />
<script>
  import Original from '@w5-ui/svelte/components/Input.svelte';
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
