<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let label: string = 'Loading';
</script>

<span role="status" aria-label={label} class="spinner {size}" />
