<svelte:options tag="uni-input-group" />
<script>
  import Original from '@dash-ui/svelte/components/InputGroup.svelte';
  export let prefix = undefined;
  export let suffix = undefined;
</script>

<Original {prefix} {suffix}>
  <slot />
</Original>
