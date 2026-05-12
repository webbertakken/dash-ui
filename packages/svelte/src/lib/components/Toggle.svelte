<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  interface Props {
    on?: boolean;
    ariaLabel?: string | undefined;
    ariaDescribedBy?: string | undefined;
  }

  let { on = $bindable(false), ariaLabel = undefined, ariaDescribedBy = undefined }: Props = $props();
  const dispatch = createEventDispatcher<{ toggle: boolean }>();
  function flip() {
    on = !on;
    dispatch('toggle', on);
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
