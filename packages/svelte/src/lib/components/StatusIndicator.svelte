<script lang="ts">
  export let color: string;
  export let text: string;
  export let textColor: string | undefined = undefined;
</script>

<span style="display:inline-flex;align-items:center;gap:6px;color:{textColor ?? color};font-size:12px;">
  <span style="width:6px;height:6px;border-radius:50%;background:{color};"></span>
  {text}
</span>
