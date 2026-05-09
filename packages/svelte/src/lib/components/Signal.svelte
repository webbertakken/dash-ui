<script lang="ts">
  export let weak: boolean = false;
  export let label: string | undefined = undefined;
</script>

<span
  class="signal {weak ? 'weak' : ''}"
  role="img"
  aria-label={label ?? (weak ? 'Signal: weak' : 'Signal: strong')}
>
  <i></i><i></i><i></i><i></i>
</span>
