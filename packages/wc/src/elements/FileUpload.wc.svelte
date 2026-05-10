<svelte:options tag="uni-file-upload" />
<script>
  import Original from '@dash-ui/svelte/components/FileUpload.svelte';
  export let label = 'Upload file';
  export let hint = undefined;
  export let accept = undefined;
  export let multiple = false;
  export let disabled = false;
</script>

<Original {label} {hint} {accept} {multiple} {disabled}>
  <slot />
</Original>
