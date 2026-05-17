<script lang="ts">
  interface Props {
    on?: boolean;
    ariaLabel?: string | undefined;
    ariaDescribedBy?: string | undefined;
    ontoggle?: (payload: boolean) => void;
  }

  let {
    on = $bindable(false),
    ariaLabel = undefined,
    ariaDescribedBy = undefined,
    ontoggle,
  }: Props = $props();
  function flip() {
    on = !on;
    ontoggle?.(on);
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={on}
  aria-label={ariaLabel}
  aria-describedby={ariaDescribedBy}
  class="relative inline-block h-[18px] w-8 shrink-0 cursor-pointer appearance-none rounded-full border-0 p-0 font-[inherit] text-[inherit] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-05
    {on ? 'bg-brand-05' : 'bg-text-4'}"
  onclick={flip}
>
  <span
    class="absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-[left] duration-150
      {on ? 'left-4' : 'left-0.5'}"
  ></span>
</button>
