<svelte:options customElement="uni-timeline" />
<script>
  import Original from '@w5-ui/svelte/components/Timeline.svelte';
  let {
    events = undefined,
    class: className = ''
  } = $props();
</script>

<Original {events} class={className}>
  <slot />
</Original>
