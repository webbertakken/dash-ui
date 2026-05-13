<script lang="ts">
  import Topbar from '../../lib/components/Topbar.svelte';
  let activeApp = $state('system');
</script>

<Topbar siteName="Demo" bind:activeApp>
  {#snippet actions()}
    <button type="button" data-testid="custom-action">custom-action</button>
  {/snippet}
</Topbar>
