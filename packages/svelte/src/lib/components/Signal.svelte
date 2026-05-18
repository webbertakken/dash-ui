<script lang="ts">
  interface Props {
    weak?: boolean;
    label?: string | undefined;
  }

  let { weak = false, label = undefined }: Props = $props();
</script>

<span
  data-weak={weak ? 'true' : undefined}
  class="inline-flex h-3 items-end gap-px [&>i]:block [&>i]:w-0.5 [&>i]:rounded-[0.5px] [&>i]:bg-status-success data-[weak=true]:[&>i:nth-child(3)]:bg-bg-3 data-[weak=true]:[&>i:nth-child(4)]:bg-bg-3"
  role="img"
  aria-label={label ?? (weak ? 'Signal: weak' : 'Signal: strong')}
>
  <i class="h-[3px]"></i><i class="h-1.5"></i><i class="h-[9px]"></i><i class="h-3"></i>
</span>
