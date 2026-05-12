<script lang="ts">
  

  interface Props {
    options?: { value: string; label: string; disabled?: boolean }[];
    value?: string[];
    ariaLabel?: string;
    size?: 'sm' | 'md';
    class?: string;
    onchange?: (payload: string[]) => void;
  }

  let {
    options = [],
    value = $bindable([]),
    ariaLabel = '',
    size = 'md',
    class: klass = '',
    onchange,
  }: Props = $props();
  function toggle(v: string) {
    const next = value.includes(v) ? value.filter((x) => x !== v) : [...value, v];
    value = next;
    onchange?.(next);
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
