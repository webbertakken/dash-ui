<svelte:options tag="uni-log-viewer" />
<script>
  import Original from '@dash-ui/svelte/components/LogViewer.svelte';
  export let entries = [];
  export let height = 360;
  export let defaultFollow = true;
  export let ariaLabel = 'Log entries';
  export let className = '';
</script>

<Original {entries} {height} {defaultFollow} {ariaLabel} {className}>
  <slot />
</Original>
