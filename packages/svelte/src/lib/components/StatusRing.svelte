<script lang="ts">
  interface Props {
    class?: string;
    style?: string;
  }

  let { class: className = '', style = '' }: Props = $props();
</script>

<!--
  Pulsing status indicator: a soft translucent ring around a solid coloured
  inner dot. Renders <span aria-hidden class="status-ring"> so the .status-ring
  rule in @w5-ui/tokens/dashboard.css paints the canonical 18 px green ring +
  8 px inner dot (success colour) without userland having to hand-roll the
  two layers. Used by <Topbar> next to the site name to signal site healthy;
  also suitable for tunnel / session / device tiles where a small live-state
  dot sits at the leading edge of a row. Decorative — the typed wrapper sets
  aria-hidden; pair with a label so screen readers announce the state. Typed
  equivalent of <span aria-hidden class="status-ring" /> — stops userland
  copying the class name and silently drifting when ring tokens change.
-->
<span aria-hidden="true" class="status-ring {className}" {style}></span>
