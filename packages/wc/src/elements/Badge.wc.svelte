<svelte:options customElement="uni-badge" />
<script>
  import Original from '@w5-ui/svelte/components/Badge.svelte';
  let {
    count = undefined,
    dot = false,
    max = 99,
    showZero = false,
    color = 'danger',
    class: klass = ''
  } = $props();
</script>

<Original {count} {dot} {max} {showZero} {color} class={klass}>
  <slot />
</Original>
