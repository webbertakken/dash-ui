<script lang="ts">
  export let title: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  let className = '';
  export { className as class };
  export let style: string = '';
</script>

<button
  {type}
  class="icon-btn {className}"
  {title}
  {style}
  {...$$restProps}
  aria-label={$$restProps['aria-label'] ?? title}
  on:click
>
  <slot />
</button>
