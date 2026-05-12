<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }

  let { size = 'md', label = 'Loading' }: Props = $props();
</script>

<span role="status" aria-label={label} class="spinner {size}"></span>
