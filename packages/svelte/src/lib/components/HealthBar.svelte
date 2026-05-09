<script lang="ts">
  export let value: number;
  export let fillStyle: string = '';
  $: clamped = Math.max(0, Math.min(100, value));
</script>

<div class="hb">
  <div class="hb-fill" style="width:{clamped}%; {fillStyle}"></div>
</div>
