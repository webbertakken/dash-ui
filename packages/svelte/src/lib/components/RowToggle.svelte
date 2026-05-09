<script context="module" lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import Toggle from './Toggle.svelte';
  export let title: string;
  export let description: string;
  export let on: boolean = false;
  const descId = `dash-ui-rowtoggle-${++counter}`;
</script>

<div class="row-toggle">
  <div class="info">
    <div class="t">{title}</div>
    <div class="d" id={descId}>{description}</div>
  </div>
  <Toggle bind:on ariaLabel={title} ariaDescribedBy={descId} on:toggle />
</div>
