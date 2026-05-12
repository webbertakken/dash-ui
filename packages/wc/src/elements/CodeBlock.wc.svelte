<svelte:options customElement="uni-code-block" />
<script>
  import Original from '@w5-ui/svelte/components/CodeBlock.svelte';
  export let code = '';
  export let label = 'Code block';
  export let language = '';
</script>

<Original {code} {label} {language}>
  <slot />
</Original>
