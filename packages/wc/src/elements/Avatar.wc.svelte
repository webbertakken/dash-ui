<svelte:options customElement="uni-avatar" />
<script>
  import Original from '@w5-ui/svelte/components/Avatar.svelte';
  let {
    initials = '?',
    src = undefined,
    alt = undefined,
    size = 'md',
    status = undefined,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {initials} {src} {alt} {size} {status} class={className} {style}>
  <slot />
</Original>
