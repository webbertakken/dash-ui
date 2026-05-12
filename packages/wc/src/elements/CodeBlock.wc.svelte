<svelte:options customElement="uni-code-block" />
<script>
  import Original from '@w5-ui/svelte/components/CodeBlock.svelte';
  let {
    code = '',
    label = 'Code block',
    language = '',
    class: className = ''
  } = $props();
</script>

<Original {code} {label} {language} class={className}>
  <slot />
</Original>
