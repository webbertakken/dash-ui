<script lang="ts">
  export let variant: 'primary' | 'ghost' | 'danger' = 'ghost';
  export let iconOnly = false;
  export let title: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  let className = '';
  export { className as class };
  export let style: string = '';
</script>

<button
  {type}
  {title}
  on:click
  class="btn btn-{variant} {iconOnly ? 'btn-icon' : ''} {className}"
  {style}
>
  <slot />
</button>
