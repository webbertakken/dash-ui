<svelte:options customElement={{ tag: "uni-carousel", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Carousel.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    slides = [],
    label = undefined,
    class: klass = ''
  } = $props();
</script>

<Original {slides} {label} class={klass}>
  <slot />
</Original>
