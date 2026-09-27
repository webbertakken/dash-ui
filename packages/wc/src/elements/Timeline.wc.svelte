<svelte:options customElement={{ tag: "uni-timeline", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Timeline.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    events = undefined,
    class: className = ''
  } = $props();
</script>

<Original {events} class={className}>
  <slot />
</Original>
