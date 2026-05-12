<svelte:options customElement="uni-carousel" />
<script>
  import Original from '@w5-ui/svelte/components/Carousel.svelte';
  export let slides = [];
  export let label = undefined;
</script>

<Original {slides} {label}>
  <slot />
</Original>
