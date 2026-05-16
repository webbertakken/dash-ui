<svelte:options customElement="uni-name-cell" />
<script>
  import Original from '@w5-ui/svelte/components/NameCell.svelte';
  let {
    class: className = '',
    thumbClass = ''
  } = $props();
</script>

<Original class={className} {thumbClass}>
  <slot />
</Original>
