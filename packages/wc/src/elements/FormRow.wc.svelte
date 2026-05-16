<svelte:options customElement="uni-form-row" />
<script>
  import Original from '@w5-ui/svelte/components/FormRow.svelte';
  let {
    class: className = ''
  } = $props();
</script>

<Original class={className}>
  <slot />
</Original>
