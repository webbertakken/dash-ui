<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  interface Props {
    label: string;
    class?: string;
  }

  let { label, class: className = '' }: Props = $props();
  
</script>

<span class="tag {className}">
  <span class="tag__label">{label}</span>
  <button
    type="button"
    class="tag__remove"
    aria-label="Remove {label} filter"
    onclick={bubble('click')}
  >
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</span>
