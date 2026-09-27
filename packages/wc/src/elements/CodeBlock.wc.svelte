<svelte:options customElement={{ tag: "uni-code-block", extend: withShadowStyles }} />
<script>
  import Original from '@w5-ui/svelte/components/CodeBlock.svelte';
  import { withShadowStyles } from '../styled.ts';
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
