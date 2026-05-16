<script lang="ts">
  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<!--
  Tiny red dot that sits on top of a bell / mail / inbox icon to flag unread
  activity. Renders <span aria-hidden class="topbar-notif-dot"> so the
  .topbar-notif-dot rule in @w5-ui/tokens/dashboard.css paints the canonical
  6 px circle with the danger colour and a neutral-10 ring (the ring is what
  keeps the dot legible over the deep topbar background). The dot is
  presentational — wrap your bell <IconButton> and put the live count in its
  aria-label (e.g. aria-label="Notifications, 3 new") so screen readers
  announce the number while sighted users see the indicator. The hosting
  button must be position: relative for the dot to anchor in the top-right
  corner. Typed equivalent of <span aria-hidden class="topbar-notif-dot" />
  for userland that slots a custom <Topbar actions> block and wants to keep
  the unread indicator wired up without copying the class name.
-->
<span aria-hidden="true" class="topbar-notif-dot {className}"></span>
