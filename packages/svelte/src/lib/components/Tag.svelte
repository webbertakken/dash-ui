<script lang="ts">
  export let label: string;
  let className = '';
  export { className as class };
</script>

<span class="tag {className}">
  <span class="tag__label">{label}</span>
  <button
    type="button"
    class="tag__remove"
    aria-label="Remove {label} filter"
    on:click
  >
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</span>
