<svelte:options tag="uni-input" />
<script>
  import Original from '@dash-ui/svelte/components/Input.svelte';
  export let value = '';
  export let placeholder = '';
  export let type = 'text';
  export let style = '';
</script>

<Original {value} {placeholder} {type} {style}>
  <slot />
</Original>
