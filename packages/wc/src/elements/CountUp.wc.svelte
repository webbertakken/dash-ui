<svelte:options customElement="uni-count-up" />
<script>
  import Original from '@w5-ui/svelte/components/CountUp.svelte';
  let {
    from = 0,
    to = undefined,
    duration = 1200,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    class: klass = ''
  } = $props();
</script>

<Original {from} {to} {duration} {decimals} {prefix} {suffix} {separator} class={klass}>
  <slot />
</Original>
