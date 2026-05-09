<script lang="ts">
  export let href: string = '#main-content';
  let className = '';
  export { className as class };
</script>

<a class="skip-link {className}" {href}>
  <slot>Skip to main content</slot>
</a>
