<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  export let label: string;
  export let placement: 'top' | 'bottom' | 'left' | 'right' = 'top';
  let className = '';
  export { className as class };
  const id = `dash-ui-tooltip-${++counter}`;
</script>

<span class="tooltip-wrapper tooltip-{placement} {className}">
  <span class="tooltip-trigger" aria-describedby={id}><slot /></span>
  <span {id} role="tooltip" class="tooltip-content">{label}</span>
</span>
