<svelte:options tag="uni-card" />
<script>
  import Original from '@dash-ui/svelte/components/Card.svelte';
  export let span = undefined;
  export let style = '';
</script>

<Original {span} {style}>
  <slot />
</Original>
