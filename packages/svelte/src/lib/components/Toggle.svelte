<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let on: boolean = false;
  export let ariaLabel: string | undefined = undefined;
  export let ariaDescribedBy: string | undefined = undefined;
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
  on:click={flip}
>
  <span class="knob"></span>
</button>
