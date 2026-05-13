<script lang="ts">
  interface Props {
    color: string;
    text: string;
    textColor?: string | undefined;
  }

  let { color, text, textColor = undefined }: Props = $props();
</script>

<span
  class="inline-flex items-center gap-1.5 text-12"
  style="color:{textColor ?? color};"
>
  <span
    class="h-1.5 w-1.5 rounded-full"
    aria-hidden="true"
    style="background:{color};"
  ></span>
  {text}
</span>
