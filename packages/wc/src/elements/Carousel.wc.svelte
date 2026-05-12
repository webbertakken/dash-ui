<svelte:options customElement="uni-carousel" />
<script>
  import Original from '@w5-ui/svelte/components/Carousel.svelte';
  let {
    slides = [],
    label = undefined,
    class: klass = ''
  } = $props();
</script>

<Original {slides} {label} class={klass}>
  <slot />
</Original>
