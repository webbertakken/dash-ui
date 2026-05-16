<script module lang="ts">
  export type StatusRingStatus = 'ok' | 'warn' | 'danger' | 'neutral';
</script>

<script lang="ts">
  interface Props {
    class?: string;
    style?: string;
    /** Health colour of the ring. Defaults to `'ok'` (success green). */
    status?: StatusRingStatus;
  }

  let { class: className = '', style = '', status = 'ok' }: Props = $props();

  const MODIFIER: Record<StatusRingStatus, string> = {
    ok: '',
    warn: 'status-ring--warn',
    danger: 'status-ring--danger',
    neutral: 'status-ring--neutral',
  };
  let modifier = $derived(MODIFIER[status]);
</script>

<!--
  Pulsing status indicator: a soft translucent ring around a solid coloured
  inner dot. Renders <span aria-hidden class="status-ring"> so the .status-ring
  rule in @w5-ui/tokens/dashboard.css paints the canonical 18 px ring + 8 px
  inner dot without userland having to hand-roll the two layers. The `status`
  prop swaps the ring + dot colour: 'ok' (default, success green), 'warn'
  (amber), 'danger' (red), 'neutral' (grey). Used by <Topbar> next to the site
  name to signal site health; also suitable for tunnel / session / device
  tiles where a small live-state dot sits at the leading edge of a row.
  Decorative — the typed wrapper sets aria-hidden; pair with a label so
  screen readers announce the state.
-->
<span aria-hidden="true" class="status-ring {modifier} {className}" {style}></span>
