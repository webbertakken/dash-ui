<svelte:options customElement="uni-count-up" />
<script>
  import Original from '@w5-ui/svelte/components/CountUp.svelte';
  export let from = 0;
  export let to = undefined;
  export let duration = 1200;
  export let decimals = 0;
  export let prefix = '';
  export let suffix = '';
  export let separator = ',';
</script>

<Original {from} {to} {duration} {decimals} {prefix} {suffix} {separator}>
  <slot />
</Original>
