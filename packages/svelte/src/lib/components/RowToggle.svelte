<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import Toggle from './Toggle.svelte';
  interface Props {
    title: string;
    description: string;
    on?: boolean;
  }

  let { title, description, on = $bindable(false) }: Props = $props();
  const descId = `dash-ui-rowtoggle-${++counter}`;
</script>

<div class="row-toggle">
  <div class="info">
    <div class="t">{title}</div>
    <div class="d" id={descId}>{description}</div>
  </div>
  <Toggle bind:on ariaLabel={title} ariaDescribedBy={descId} on:toggle />
</div>
