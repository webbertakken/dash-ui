<script module lang="ts">
  let counter = 0;
</script>

<script lang="ts">
  import Toggle from './Toggle.svelte';

  interface Props {
    title: string;
    description: string;
    on?: boolean;
    ontoggle?: (value: boolean) => void;
  }

  let {
    title,
    description,
    on = $bindable(false),
    ontoggle,
  }: Props = $props();

  const descId = `dash-ui-rowtoggle-${++counter}`;
</script>

<div class="flex items-center gap-3.5 border-b border-white/[0.04] py-2.5">
  <div class="flex-1">
    <div class="text-13 font-medium text-white">{title}</div>
    <div class="mt-0.5 text-11 text-[#6e7079]" id={descId}>{description}</div>
  </div>
  <Toggle bind:on ariaLabel={title} ariaDescribedBy={descId} {ontoggle} />
</div>
