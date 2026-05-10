<script lang="ts">
  import Spinner from './Spinner.svelte';
  export let variant: 'primary' | 'ghost' | 'danger' = 'ghost';
  export let iconOnly = false;
  export let loading = false;
  export let title: string | undefined = undefined;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let disabled = false;
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
  disabled={disabled || loading}
  aria-busy={loading ? true : undefined}
>
  {#if loading}<Spinner size="sm" />{/if}
  <slot />
</button>
