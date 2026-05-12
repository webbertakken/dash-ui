<script module lang="ts">
  export type BadgeColor = 'danger' | 'warn' | 'info' | 'success' | 'neutral';
</script>

<script lang="ts">
  interface Props {
    count?: number | undefined;
    dot?: boolean;
    max?: number;
    showZero?: boolean;
    color?: BadgeColor;
    class?: string;
    children?: import('svelte').Snippet;
  }

  let {
    count = undefined,
    dot = false,
    max = 99,
    showZero = false,
    color = 'danger',
    class: klass = '',
    children
  }: Props = $props();
  

  let show = $derived(dot || (count !== undefined && (showZero || count > 0)));
  let label = $derived(count !== undefined ? (count > max ? `${max}+` : String(count)) : '');
</script>

<span class="badge-wrapper{klass ? ` ${klass}` : ''}">
  {@render children?.()}
  {#if show}
    <span class="badge badge-{color}{dot ? ' badge-dot' : ''}" aria-hidden="true">
      {#if !dot}{label}{/if}
    </span>
  {/if}
</span>
