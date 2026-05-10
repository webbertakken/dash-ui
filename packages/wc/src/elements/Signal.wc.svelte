<svelte:options tag="uni-signal" />
<script>
  import Original from '@dash-ui/svelte/components/Signal.svelte';
  export let weak = false;
  export let label = undefined;
</script>

<Original {weak} {label}>
  <slot />
</Original>
