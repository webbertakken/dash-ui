<svelte:options customElement="uni-toggle-group" />
<script>
  import Original from '@w5-ui/svelte/components/ToggleGroup.svelte';
  export let options = [];
  export let value = [];
  export let ariaLabel = '';
  export let size = 'md';
</script>

<Original {options} {value} {ariaLabel} {size}>
  <slot />
</Original>
