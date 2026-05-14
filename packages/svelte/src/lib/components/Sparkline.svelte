<script lang="ts">
  interface Props {
    bars?: number;
    active?: boolean;
    seed?: number;
    ariaLabel?: string;
  }

  let {
    bars = 36,
    active = false,
    seed = 1,
    ariaLabel = 'Activity sparkline',
  }: Props = $props();

  function rng(s0: number) {
    let s = s0;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  let heights = $derived(
    (() => {
      const r = rng(seed);
      const out: number[] = [];
      let prev = 12;
      for (let i = 0; i < bars; i++) {
        const v = Math.max(4, Math.min(40, prev + (r() * 10 - 5)));
        prev = v;
        out.push(v);
      }
      return out;
    })(),
  );
</script>

<div class="flex h-12 items-end gap-px" role="img" aria-label={ariaLabel}>
  {#each heights as h, i}
    <div
      class="flex-1 rounded-t-[1px] bg-gradient-to-b from-brand-06 to-brand-04"
      aria-hidden="true"
      style="height:{h}px;opacity:{active ? 0.4 + i / (bars * 1.4) : 0.5 + i / (bars * 1.6)}"
    ></div>
  {/each}
</div>
