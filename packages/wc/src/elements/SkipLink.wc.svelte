<svelte:options tag="uni-skip-link" />
<script>
  import Original from '@dash-ui/svelte/components/SkipLink.svelte';
  export let href = '#main-content';
</script>

<Original {href}>
  <slot />
</Original>
