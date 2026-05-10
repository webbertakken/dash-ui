<svelte:options tag="uni-search-box" />
<script>
  import Original from '@dash-ui/svelte/components/SearchBox.svelte';
  export let placeholder = '';
  export let value = '';
  export let ariaLabel = '';
</script>

<Original {placeholder} {value} {ariaLabel}>
  <slot />
</Original>
