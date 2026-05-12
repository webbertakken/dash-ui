<script lang="ts">
  interface Props {
    weak?: boolean;
    label?: string | undefined;
  }

  let { weak = false, label = undefined }: Props = $props();
</script>

<span
  class="signal {weak ? 'weak' : ''}"
  role="img"
  aria-label={label ?? (weak ? 'Signal: weak' : 'Signal: strong')}
>
  <i></i><i></i><i></i><i></i>
</span>
