<svelte:options customElement="uni-toggle-group" />
<script>
  import Original from '@w5-ui/svelte/components/ToggleGroup.svelte';
  let {
    options = [],
    value = [],
    ariaLabel = '',
    size = 'md',
    class: klass = ''
  } = $props();
</script>

<Original {options} {value} {ariaLabel} {size} class={klass}>
  <slot />
</Original>
