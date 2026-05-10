<svelte:options tag="uni-virtual-list" />
<script>
  import Original from '@dash-ui/svelte/components/VirtualList.svelte';
  export let items = [];
  export let itemHeight = 48;
  export let height = 400;
  export let label = undefined;
  export let overscan = 3;
</script>

<Original {items} {itemHeight} {height} {label} {overscan}>
  <slot />
</Original>
