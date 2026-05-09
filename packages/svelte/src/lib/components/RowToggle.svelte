<script lang="ts">
  import Toggle from './Toggle.svelte';
  export let title: string;
  export let description: string;
  export let on: boolean = false;
</script>

<div class="row-toggle">
  <div class="info">
    <div class="t">{title}</div>
    <div class="d">{description}</div>
  </div>
  <Toggle bind:on ariaLabel={title} on:toggle />
</div>
