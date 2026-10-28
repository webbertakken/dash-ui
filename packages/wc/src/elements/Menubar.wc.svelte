<svelte:options customElement={{ tag: "uni-menubar", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/Menubar.svelte';
  import { withShadowStyles } from '../styled.ts';
  let {
    menus = [],
    label = 'Menu',
    class: klass = ''
  } = $props();
</script>

<Original {menus} {label} class={klass}>
  <slot />
</Original>
