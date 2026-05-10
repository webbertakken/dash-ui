<svelte:options tag="uni-toggle-group" />
<script>
  import Original from '@dash-ui/svelte/components/ToggleGroup.svelte';
  export let options = [];
  export let value = [];
  export let ariaLabel = '';
  export let size = 'md';
</script>

<Original {options} {value} {ariaLabel} {size}>
  <slot />
</Original>
