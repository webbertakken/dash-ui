<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let options: { value: string; label: string; disabled?: boolean }[] = [];
  export let value: string[] = [];
  export let ariaLabel: string = '';
  export let size: 'sm' | 'md' = 'md';
  let klass: string = '';
  export { klass as class };

  const dispatch = createEventDispatcher<{ change: string[] }>();

  function toggle(v: string) {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    value = next;
    dispatch('change', next);
  }
</script>

<div role="group" aria-label={ariaLabel} class="tg-group tg-group--{size}{klass ? ` ${klass}` : ''}">
  {#each options as opt}
    <button
      type="button"
      aria-pressed={value.includes(opt.value)}
      disabled={opt.disabled}
      class="tg-btn{value.includes(opt.value) ? ' tg-btn--on' : ''}"
      on:click={() => toggle(opt.value)}
    >
      {opt.label}
    </button>
  {/each}
</div>
