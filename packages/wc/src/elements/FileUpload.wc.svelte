<svelte:options customElement="uni-file-upload" />
<script>
  import Original from '@w5-ui/svelte/components/FileUpload.svelte';
  let {
    label = 'Upload file',
    hint = undefined,
    accept = undefined,
    multiple = false,
    disabled = false
  } = $props();
</script>

<Original {label} {hint} {accept} {multiple} {disabled}>
  <slot />
</Original>
