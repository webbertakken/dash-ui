<svelte:options tag="uni-carousel" />
<script>
  import Original from '@dash-ui/svelte/components/Carousel.svelte';
  export let slides = [];
  export let label = undefined;
</script>

<Original {slides} {label}>
  <slot />
</Original>
