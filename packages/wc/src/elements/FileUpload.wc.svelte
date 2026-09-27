<svelte:options customElement={{ tag: "uni-file-upload", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/FileUpload.svelte';
  import { withShadowStyles } from '../styled.ts';
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
