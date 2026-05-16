<svelte:options customElement="uni-notif-dot" />
<script>
  import Original from '@w5-ui/svelte/components/NotifDot.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
