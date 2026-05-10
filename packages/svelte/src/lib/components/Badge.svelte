<script context="module" lang="ts">
  export type BadgeColor = 'danger' | 'warn' | 'info' | 'success' | 'neutral';
</script>

<script lang="ts">
  export let count: number | undefined = undefined;
  export let dot: boolean = false;
  export let max: number = 99;
  export let showZero: boolean = false;
  export let color: BadgeColor = 'danger';
  let klass: string = '';
  export { klass as class };

  $: show = dot || (count !== undefined && (showZero || count > 0));
  $: label = count !== undefined ? (count > max ? `${max}+` : String(count)) : '';
</script>

<span class="badge-wrapper{klass ? ` ${klass}` : ''}">
  <slot />
  {#if show}
    <span class="badge badge-{color}{dot ? ' badge-dot' : ''}" aria-hidden="true">
      {#if !dot}{label}{/if}
    </span>
  {/if}
</span>
