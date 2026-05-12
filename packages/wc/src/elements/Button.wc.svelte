<svelte:options customElement="uni-button" />
<script>
  import Original from '@w5-ui/svelte/components/Button.svelte';
  export let variant = 'ghost';
  export let iconOnly = false;
  export let loading = false;
  export let title = undefined;
  export let type = 'button';
  export let disabled = false;
  export let style = '';
  export let ariaLabel = undefined;
</script>

<Original {variant} {iconOnly} {loading} {title} {type} {disabled} {style} {ariaLabel}>
  <slot />
</Original>
