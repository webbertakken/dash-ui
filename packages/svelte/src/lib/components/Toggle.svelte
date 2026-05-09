<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let on: boolean = false;
  export let ariaLabel: string | undefined = undefined;
  const dispatch = createEventDispatcher<{ toggle: boolean }>();
  function flip() {
    on = !on;
    dispatch('toggle', on);
  }
</script>

<span
  role="switch"
  aria-checked={on}
  aria-label={ariaLabel}
  tabindex="0"
  class="toggle-track {on ? 'on' : 'off'}"
  on:click={flip}
  on:keydown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } }}
>
  <span class="knob"></span>
</span>
