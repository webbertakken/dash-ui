<svelte:options customElement="uni-toast" />
<script>
  import Original from '@w5-ui/svelte/components/Toast.svelte';
  let {
    /* no public props */
  } = $props();
</script>

<Original >
  <slot />
</Original>
