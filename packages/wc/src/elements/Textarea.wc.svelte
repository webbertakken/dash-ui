<svelte:options customElement="uni-textarea" />
<script>
  import Original from '@w5-ui/svelte/components/Textarea.svelte';
  let {
    value = '',
    rows = 4,
    placeholder = undefined,
    disabled = false,
    readonly = false,
    id = undefined,
    class: className = '',
    style = ''
  } = $props();
</script>

<Original {value} {rows} {placeholder} {disabled} {readonly} {id} class={className} {style}>
  <slot />
</Original>
