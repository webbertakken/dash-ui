<script lang="ts">
  interface Props {
    label: string;
    class?: string;
    onclick?: (event: MouseEvent) => void;
  }

  let { label, class: className = '', onclick }: Props = $props();
</script>

<span
  class="inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full border border-brand-05/25 bg-brand-05/14 pl-2.5 pr-1 text-12 font-medium text-status-info {className}"
>
  <span class="leading-none">{label}</span>
  <button
    type="button"
    class="inline-flex h-[18px] w-[18px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-status-info transition-[background,color] duration-100 hover:bg-brand-05/25 hover:text-text-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05"
    aria-label="Remove {label} filter"
    {onclick}
  >
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true" focusable="false">
      <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>
</span>
