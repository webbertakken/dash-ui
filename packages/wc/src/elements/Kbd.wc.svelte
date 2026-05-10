<svelte:options tag="uni-kbd" />
<script>
  import Original from '@dash-ui/svelte/components/Kbd.svelte';
  export let keys = undefined;
</script>

<Original {keys}>
  <slot />
</Original>
