<svelte:options customElement="uni-stat" />
<script>
  import Original from '@w5-ui/svelte/components/Stat.svelte';
  let {
    label = undefined,
    value = '',
    unit = undefined,
    sub = undefined,
    delta = undefined,
    deltaDir = 'neutral',
    span = undefined,
    color = undefined
  } = $props();
</script>

<Original {label} {value} {unit} {sub} {delta} {deltaDir} {span} {color}>
  <slot />
</Original>
