<script lang="ts">
  interface Props {
    color: string;
    text: string;
    textColor?: string | undefined;
  }

  let { color, text, textColor = undefined }: Props = $props();
</script>

<span style="display:inline-flex;align-items:center;gap:6px;color:{textColor ?? color};font-size:12px;">
  <span aria-hidden="true" style="width:6px;height:6px;border-radius:50%;background:{color};"></span>
  {text}
</span>
