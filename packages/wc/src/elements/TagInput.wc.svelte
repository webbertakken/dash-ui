<svelte:options customElement="uni-tag-input" />
<script>
  import Original from '@w5-ui/svelte/components/TagInput.svelte';
  let {
    label = undefined,
    value = [],
    placeholder = 'Type and press Enter…',
    disabled = false,
    class: klass = ''
  } = $props();
</script>

<Original {label} {value} {placeholder} {disabled} class={klass}>
  <slot />
</Original>
