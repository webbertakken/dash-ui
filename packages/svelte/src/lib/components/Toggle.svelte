<script lang="ts">
  
  interface Props {
    on?: boolean;
    ariaLabel?: string | undefined;
    ariaDescribedBy?: string | undefined;
    ontoggle?: (payload: boolean) => void;
  }

  let { on = $bindable(false), ariaLabel = undefined, ariaDescribedBy = undefined,
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
  class="toggle-track {on ? 'on' : 'off'}"
  onclick={flip}
>
  <span class="knob"></span>
</button>
