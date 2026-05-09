<script lang="ts">
  export let bars: number = 36;
  export let active: boolean = false;
  export let seed: number = 1;
  export let ariaLabel: string = 'Activity sparkline';

  function rng(s0: number) {
    let s = s0;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  $: heights = (() => {
    const r = rng(seed);
    const out: number[] = [];
    let prev = 12;
    for (let i = 0; i < bars; i++) {
      const v = Math.max(4, Math.min(40, prev + (r() * 10 - 5)));
      prev = v;
      out.push(v);
    }
    return out;
  })();
</script>

<div class="spark" role="img" aria-label={ariaLabel}>
  {#each heights as h, i}
    <div class="b" aria-hidden="true" style="height:{h}px;opacity:{active ? 0.4 + i / (bars * 1.4) : 0.5 + i / (bars * 1.6)}"></div>
  {/each}
</div>
