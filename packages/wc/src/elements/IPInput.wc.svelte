<svelte:options customElement="uni-ipinput" />
<script>
  import Original from '@w5-ui/svelte/components/IPInput.svelte';
  let {
    label = undefined,
    value = '0.0.0.0',
    disabled = false,
    class: className = ''
  } = $props();
</script>

<Original {label} {value} {disabled} class={className}>
  <slot />
</Original>
