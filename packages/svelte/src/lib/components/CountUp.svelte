<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    from?: number;
    to: number;
    duration?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    separator?: string;
    class?: string;
  }

  let {
    from = 0,
    to,
    duration = 1200,
    decimals = 0,
    prefix = '',
    suffix = '',
    separator = ',',
    class: klass = ''
  }: Props = $props();
  

  let current = $state(from);
  let rafId: number;

  function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

  function fmt(n: number) {
    const fixed = n.toFixed(decimals);
    if (!separator) return fixed;
    const [int, dec] = fixed.split('.');
    const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return dec !== undefined ? `${intFmt}.${dec}` : intFmt;
  }

  let label = $derived(`${prefix}${fmt(to)}${suffix}`);
  let display = $derived(`${prefix}${fmt(current)}${suffix}`);

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { current = to; return; }
    const t0 = performance.now();
    const range = to - from;
    function tick(now: number) {
      const t = Math.min((now - t0) / duration, 1);
      current = from + range * easeOut(t);
      if (t < 1) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  });

  onDestroy(() => { if (rafId) cancelAnimationFrame(rafId); });
</script>

<span class={klass || undefined}>
  <span aria-hidden="true">{display}</span>
  <span class="sr-only">{label}</span>
</span>
