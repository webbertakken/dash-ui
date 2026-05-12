<svelte:options tag="uni-file-upload" />
<script>
  import Original from '@w5-ui/svelte/components/FileUpload.svelte';
  export let label = 'Upload file';
  export let hint = undefined;
  export let accept = undefined;
  export let multiple = false;
  export let disabled = false;
</script>

<Original {label} {hint} {accept} {multiple} {disabled}>
  <slot />
</Original>
