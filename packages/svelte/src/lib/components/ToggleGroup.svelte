<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface Props {
    options?: { value: string; label: string; disabled?: boolean }[];
    value?: string[];
    ariaLabel?: string;
    size?: 'sm' | 'md';
    class?: string;
  }

  let {
    options = [],
    value = $bindable([]),
    ariaLabel = '',
    size = 'md',
    class: klass = ''
  }: Props = $props();
  

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
      onclick={() => toggle(opt.value)}
    >
      {opt.label}
    </button>
  {/each}
</div>
