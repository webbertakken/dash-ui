<script lang="ts">
  import HoverCard from '../../lib/components/HoverCard.svelte';

  interface Props {
    heading?: string;
    description?: string;
    delay?: number;
    rich?: boolean;
    useTriggerSnippet?: boolean;
  }
  let {
    heading = 'gw-hq',
    description = 'Gateway, 99.98% uptime',
    delay = undefined,
    rich = false,
    useTriggerSnippet = false,
  }: Props = $props();
</script>

{#if useTriggerSnippet}
  <HoverCard {heading} {description} {delay}>
    {#snippet trigger()}<a href="#gw">gw-hq</a>{/snippet}
    {#snippet content()}{#if rich}<em>preview</em>{/if}{/snippet}
  </HoverCard>
{:else if rich}
  <HoverCard {heading} {delay}>
    <a href="#gw">gw-hq</a>
    {#snippet content()}<em>preview</em>{/snippet}
  </HoverCard>
{:else}
  <HoverCard {heading} {description} {delay}>
    <a href="#gw">gw-hq</a>
  </HoverCard>
{/if}
