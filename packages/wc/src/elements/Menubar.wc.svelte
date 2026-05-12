<svelte:options customElement="uni-menubar" />
<script>
  import Original from '@w5-ui/svelte/components/Menubar.svelte';
  let {
    menus = [],
    label = 'Menu',
    class: klass = ''
  } = $props();
</script>

<Original {menus} {label} class={klass}>
  <slot />
</Original>
