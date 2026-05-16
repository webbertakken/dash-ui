<svelte:options customElement="uni-form-actions" />
<script>
  import Original from '@w5-ui/svelte/components/FormActions.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
