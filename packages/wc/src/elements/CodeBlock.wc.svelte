<svelte:options tag="uni-code-block" />
<script>
  import Original from '@dash-ui/svelte/components/CodeBlock.svelte';
  export let code = '';
  export let label = 'Code block';
  export let language = '';
</script>

<Original {code} {label} {language}>
  <slot />
</Original>
