<svelte:options tag="uni-stat" />
<script>
  import Original from '@dash-ui/svelte/components/Stat.svelte';
  export let label = undefined;
  export let value = '';
  export let unit = undefined;
  export let sub = undefined;
  export let delta = undefined;
  export let deltaDir = 'neutral';
  export let span = undefined;
  export let color = undefined;
</script>

<Original {label} {value} {unit} {sub} {delta} {deltaDir} {span} {color}>
  <slot />
</Original>
