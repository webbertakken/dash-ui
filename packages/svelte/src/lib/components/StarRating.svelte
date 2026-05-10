<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  export let label: string;
  export let value: number = 0;
  export let max: number = 5;
  export let readOnly: boolean = false;
  export let size: 'sm' | 'md' = 'md';
  export let onChange: ((v: number) => void) | undefined = undefined;

  const gid = `dash-ui-sr-${++counter}`;
  let hovered = 0;

  function pick(star: number) {
    value = star;
    onChange?.(star);
  }
</script>

{#if readOnly}
  <span
    class="star-rating{size === 'sm' ? ' star-rating--sm' : ''} star-rating--readonly"
    role="img"
    aria-label="{value} out of {max} stars"
  >
    {#each Array(max) as _, i}
      <span class="star-icon{i < value ? ' star-icon--on' : ''}" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill={i < value ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </span>
    {/each}
  </span>
{:else}
  <fieldset class="star-rating{size === 'sm' ? ' star-rating--sm' : ''}">
    <legend class="sr-only">{label}</legend>
    {#each Array(max) as _, i}
      {@const star = i + 1}
      {@const on = star <= (hovered || value)}
      <label
        for="{gid}-{star}"
        class="star-label{on ? ' star-label--on' : ''}"
        on:mouseenter={() => (hovered = star)}
        on:mouseleave={() => (hovered = 0)}
      >
        <input
          type="radio"
          id="{gid}-{star}"
          name={gid}
          value={String(star)}
          checked={value === star}
          class="star-radio"
          aria-label="{star} out of {max}"
          on:change={() => pick(star)}
        />
        <svg viewBox="0 0 24 24" fill={on ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      </label>
    {/each}
  </fieldset>
{/if}
