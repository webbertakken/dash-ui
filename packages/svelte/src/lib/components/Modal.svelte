<script lang="ts">
  import IconButton from './IconButton.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  export let open: boolean = false;
  export let title: string;
</script>

<div class="backdrop {open ? 'show' : ''}" on:click={() => (open = false)} role="presentation">
  <div class="modal" on:click|stopPropagation role="dialog">
    <div class="modal-h">
      <h2>{title}</h2>
      <IconButton title="Close" on:click={() => (open = false)}>
        <CloseIcon />
      </IconButton>
    </div>
    <div class="modal-b"><slot /></div>
    {#if $$slots.footer}
      <div class="modal-f"><slot name="footer" /></div>
    {/if}
  </div>
</div>
