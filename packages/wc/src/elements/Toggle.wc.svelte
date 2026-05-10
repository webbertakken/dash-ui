<svelte:options tag="uni-toggle" />
<script>
  import Original from '@dash-ui/svelte/components/Toggle.svelte';
  export let on = false;
  export let ariaLabel = undefined;
  export let ariaDescribedBy = undefined;
</script>

<Original {on} {ariaLabel} {ariaDescribedBy}>
  <slot />
</Original>
