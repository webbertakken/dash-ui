<script lang="ts">
  export let title: string | undefined = undefined;
  let className = '';
  export { className as class };
  export let style: string = '';
</script>

<button class="icon-btn {className}" {title} {style} on:click>
  <slot />
</button>
